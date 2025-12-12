import { getDb } from '../db';
import { 
  pulseSurveys, 
  pulseQuestions, 
  pulseResponses, 
  pulseSurveyAssignments,
  users 
} from '../../drizzle/schema';
import { eq, and, isNull, gte, lte, desc } from 'drizzle-orm';
import { sendPushToUser } from './pushService';

export const DEFAULT_QUESTIONS = [
  {
    questionText: '¿Cómo te sientes respecto a tu situación financiera esta semana?',
    questionType: 'emoji' as const,
    category: 'financial_stress' as const,
  },
  {
    questionText: '¿Qué tan confiado te sientes en alcanzar tus metas financieras?',
    questionType: 'scale' as const,
    category: 'financial_confidence' as const,
  },
  {
    questionText: '¿Has podido ahorrar algo esta semana?',
    questionType: 'choice' as const,
    category: 'savings_habits' as const,
    options: JSON.stringify(['Sí, más de lo planeado', 'Sí, lo planeado', 'Un poco menos', 'No pude ahorrar']),
  },
  {
    questionText: '¿Cómo calificarías tu balance vida-trabajo esta semana?',
    questionType: 'scale' as const,
    category: 'work_life_balance' as const,
  },
  {
    questionText: '¿Qué tan satisfecho estás con tu trabajo actualmente?',
    questionType: 'scale' as const,
    category: 'job_satisfaction' as const,
  },
  {
    questionText: 'En general, ¿cómo te sientes hoy?',
    questionType: 'emoji' as const,
    category: 'overall_wellbeing' as const,
  },
];

export async function createDefaultSurvey(
  organizationId: number | null,
  createdBy: number,
  title: string = 'Encuesta de Bienestar Semanal'
): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  const now = new Date();
  const endsAt = new Date(now);
  endsAt.setDate(endsAt.getDate() + 7);

  const [survey] = await db.insert(pulseSurveys).values({
    title,
    description: 'Cuéntanos cómo te sientes esta semana para ayudarte mejor',
    organizationId,
    frequency: 'weekly',
    isActive: true,
    startsAt: now,
    endsAt,
    createdBy,
  }).$returningId();

  if (!survey?.id) return null;

  for (let i = 0; i < DEFAULT_QUESTIONS.length; i++) {
    const q = DEFAULT_QUESTIONS[i];
    await db.insert(pulseQuestions).values({
      surveyId: survey.id,
      questionText: q.questionText,
      questionType: q.questionType,
      category: q.category,
      options: (q as any).options || null,
      orderIndex: i,
      isRequired: true,
    });
  }

  return survey.id;
}

export async function getActiveSurveyForUser(userId: number): Promise<{
  survey: any;
  questions: any[];
  assignment: any;
} | null> {
  const db = await getDb();
  if (!db) return null;

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user.length) return null;

  const now = new Date();

  const surveys = await db.select().from(pulseSurveys).where(
    and(
      eq(pulseSurveys.isActive, true),
      lte(pulseSurveys.startsAt, now),
      gte(pulseSurveys.endsAt, now)
    )
  ).orderBy(desc(pulseSurveys.createdAt)).limit(1);

  if (!surveys.length) return null;

  const survey = surveys[0];

  let assignment = await db.select().from(pulseSurveyAssignments).where(
    and(
      eq(pulseSurveyAssignments.surveyId, survey.id),
      eq(pulseSurveyAssignments.userId, userId)
    )
  ).limit(1);

  if (!assignment.length) {
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 3);
    
    await db.insert(pulseSurveyAssignments).values({
      surveyId: survey.id,
      userId,
      dueAt,
    });
    
    assignment = await db.select().from(pulseSurveyAssignments).where(
      and(
        eq(pulseSurveyAssignments.surveyId, survey.id),
        eq(pulseSurveyAssignments.userId, userId)
      )
    ).limit(1);
  }

  if (assignment[0]?.completedAt) return null;

  const questions = await db.select().from(pulseQuestions)
    .where(eq(pulseQuestions.surveyId, survey.id))
    .orderBy(pulseQuestions.orderIndex);

  return {
    survey,
    questions,
    assignment: assignment[0],
  };
}

export async function submitSurveyResponses(
  userId: number,
  surveyId: number,
  responses: Array<{
    questionId: number;
    responseValue?: number;
    responseText?: string;
    responseChoice?: string;
  }>
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const assignment = await db.select().from(pulseSurveyAssignments).where(
    and(
      eq(pulseSurveyAssignments.surveyId, surveyId),
      eq(pulseSurveyAssignments.userId, userId),
      isNull(pulseSurveyAssignments.completedAt)
    )
  ).limit(1);

  if (!assignment.length) return false;

  for (const response of responses) {
    await db.insert(pulseResponses).values({
      surveyId,
      questionId: response.questionId,
      userId,
      responseValue: response.responseValue,
      responseText: response.responseText,
      responseChoice: response.responseChoice,
    });
  }

  await db.update(pulseSurveyAssignments).set({
    completedAt: new Date(),
  }).where(eq(pulseSurveyAssignments.id, assignment[0].id));

  return true;
}

export async function getSurveyResults(surveyId: number): Promise<{
  survey: any;
  totalResponses: number;
  completionRate: number;
  questionResults: Array<{
    question: any;
    avgScore: number | null;
    distribution: Record<string, number>;
  }>;
} | null> {
  const db = await getDb();
  if (!db) return null;

  const survey = await db.select().from(pulseSurveys).where(eq(pulseSurveys.id, surveyId)).limit(1);
  if (!survey.length) return null;

  const questions = await db.select().from(pulseQuestions)
    .where(eq(pulseQuestions.surveyId, surveyId))
    .orderBy(pulseQuestions.orderIndex);

  const assignments = await db.select().from(pulseSurveyAssignments)
    .where(eq(pulseSurveyAssignments.surveyId, surveyId));

  const totalAssigned = assignments.length;
  const totalCompleted = assignments.filter((a: any) => a.completedAt).length;
  const completionRate = totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0;

  const questionResults = [];

  for (const question of questions) {
    const responses = await db.select().from(pulseResponses).where(
      and(
        eq(pulseResponses.surveyId, surveyId),
        eq(pulseResponses.questionId, question.id)
      )
    );

    let avgScore: number | null = null;
    const distribution: Record<string, number> = {};

    if (question.questionType === 'scale' || question.questionType === 'emoji') {
      const scores = responses.filter((r: any) => r.responseValue !== null).map((r: any) => r.responseValue);
      if (scores.length > 0) {
        avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
      }
      for (let i = 1; i <= 5; i++) {
        distribution[String(i)] = scores.filter((s: number) => s === i).length;
      }
    } else if (question.questionType === 'choice') {
      for (const r of responses) {
        const choice = (r as any).responseChoice || 'Sin respuesta';
        distribution[choice] = (distribution[choice] || 0) + 1;
      }
    }

    questionResults.push({
      question,
      avgScore: avgScore ? Math.round(avgScore * 10) / 10 : null,
      distribution,
    });
  }

  return {
    survey: survey[0],
    totalResponses: totalCompleted,
    completionRate: Math.round(completionRate),
    questionResults,
  };
}

export async function calculateWellbeingScore(userId: number): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const responses = await db.select().from(pulseResponses).where(
    and(
      eq(pulseResponses.userId, userId),
      gte(pulseResponses.submittedAt, fourWeeksAgo)
    )
  );

  if (responses.length === 0) return null;

  const scores = responses
    .filter((r: any) => r.responseValue !== null)
    .map((r: any) => r.responseValue);

  if (scores.length === 0) return null;

  const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
  return Math.round((avgScore - 1) * 25);
}

export async function sendSurveyReminders(surveyId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const pendingAssignments = await db.select({
    assignment: pulseSurveyAssignments,
    user: users,
  }).from(pulseSurveyAssignments)
    .innerJoin(users, eq(pulseSurveyAssignments.userId, users.id))
    .where(
      and(
        eq(pulseSurveyAssignments.surveyId, surveyId),
        isNull(pulseSurveyAssignments.completedAt)
      )
    );

  let sentCount = 0;

  for (const { assignment, user } of pendingAssignments) {
    if (assignment.reminderSentAt && assignment.reminderSentAt > twoDaysAgo) continue;

    try {
      await sendPushToUser(user.id, {
        title: '📋 Encuesta de Bienestar',
        body: '¡Tu opinión importa! Completa la encuesta semanal en menos de 2 minutos.',
      });

      await db.update(pulseSurveyAssignments).set({
        reminderSentAt: now,
      }).where(eq(pulseSurveyAssignments.id, assignment.id));

      sentCount++;
    } catch (error) {
      console.error(`[PulseSurvey] Failed to send reminder to user ${user.id}:`, error);
    }
  }

  return sentCount;
}

export async function getOrganizationSurveys(organizationId: number | null): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  if (organizationId) {
    return db.select().from(pulseSurveys)
      .where(eq(pulseSurveys.organizationId, organizationId))
      .orderBy(desc(pulseSurveys.createdAt));
  }

  return db.select().from(pulseSurveys).orderBy(desc(pulseSurveys.createdAt));
}
