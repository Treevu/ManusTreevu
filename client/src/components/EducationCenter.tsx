import { useState } from 'react';
import { 
  BookOpen, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  GraduationCap,
  Target,
  Star,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EducationGamification, useEducationProgress } from './EducationGamification';
import { 
  getEducationalContent, 
  TutorialContent, 
  UserRole, 
  ExperienceLevel,
  determineExperienceLevel 
} from '@/lib/educationalContent';
import { useAuth } from '@/_core/hooks/useAuth';

interface EducationCenterProps {
  role?: UserRole;
  experienceLevel?: ExperienceLevel;
  compact?: boolean;
}

export function EducationCenter({ 
  role: propRole, 
  experienceLevel: propLevel,
  compact = false 
}: EducationCenterProps) {
  const { user } = useAuth();
  const { allProgress, completedTutorials, totalPointsEarned, getTutorialStatus, isLoading } = useEducationProgress();
  
  // Determine role from user or props
  const role = propRole || (user?.role as UserRole) || 'employee';
  
  // Determine experience level based on user activity
  const daysActive = user?.createdAt 
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const experienceLevel = propLevel || determineExperienceLevel(daysActive, completedTutorials.length);
  
  // Get tutorials for this role and level
  const tutorials = getEducationalContent(role, experienceLevel);
  
  // Calculate overall progress
  const totalTutorials = tutorials.length;
  const completedCount = tutorials.filter(t => getTutorialStatus(t.type).isCompleted).length;
  const overallProgress = totalTutorials > 0 ? (completedCount / totalTutorials) * 100 : 0;
  const totalPossiblePoints = tutorials.reduce((sum, t) => sum + t.points, 0);

  if (compact) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-400" />
              <span className="font-medium text-white">Centro de Aprendizaje</span>
            </div>
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
              {completedCount}/{totalTutorials}
            </Badge>
          </div>
          <Progress value={overallProgress} className="h-2 bg-slate-700 mb-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {totalPointsEarned} / {totalPossiblePoints} TreePoints
            </span>
            <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
              Ver todos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Trophy className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Tutoriales Completados</p>
                <p className="text-2xl font-bold text-white">{completedCount}/{totalTutorials}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/50 to-slate-900 border-yellow-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">TreePoints Ganados</p>
                <p className="text-2xl font-bold text-white">{totalPointsEarned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900 border-purple-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Puntos Disponibles</p>
                <p className="text-2xl font-bold text-white">{totalPossiblePoints - totalPointsEarned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <GraduationCap className="h-5 w-5 text-emerald-400" />
                Tu Progreso de Aprendizaje
              </CardTitle>
              <CardDescription className="text-slate-400">
                Nivel: <span className="text-emerald-400 capitalize">{experienceLevel === 'new' ? 'Principiante' : experienceLevel === 'intermediate' ? 'Intermedio' : 'Avanzado'}</span>
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-400">{Math.round(overallProgress)}%</p>
              <p className="text-xs text-slate-400">completado</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3 bg-slate-700" />
          {overallProgress === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-center"
            >
              <Star className="h-5 w-5 text-yellow-400 inline-block mr-2" />
              <span className="text-emerald-400 font-medium">
                ¡Felicitaciones! Has completado todos los tutoriales disponibles
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Tutorial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tutorials.map((tutorial, index) => {
          const status = getTutorialStatus(tutorial.type);
          const isCompleted = status.isCompleted;
          
          return (
            <motion.div
              key={tutorial.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-slate-900/50 border-slate-700/50 backdrop-blur-sm transition-all hover:border-emerald-500/50 ${
                isCompleted ? 'opacity-80' : ''
              }`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isCompleted ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{tutorial.name}</h3>
                        <p className="text-sm text-slate-400">{tutorial.steps.length} pasos</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={isCompleted 
                        ? 'border-emerald-500/50 text-emerald-400' 
                        : 'border-yellow-500/50 text-yellow-400'
                      }
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          +{status.pointsAwarded}
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          +{tutorial.points}
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-4">
                    {tutorial.description}
                  </p>
                  
                  {!isCompleted && status.stepsCompleted > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progreso</span>
                        <span>{status.stepsCompleted}/{tutorial.steps.length}</span>
                      </div>
                      <Progress 
                        value={(status.stepsCompleted / tutorial.steps.length) * 100} 
                        className="h-1.5 bg-slate-700" 
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Zap className="h-3 w-3" />
                      <span>{tutorial.steps.length * 2} min aprox.</span>
                    </div>
                    
                    <EducationGamification
                      tutorialType={tutorial.type as 'fwi' | 'ewa' | 'b2b' | 'merchant'}
                      steps={tutorial.steps}
                    >
                      <Button
                        size="sm"
                        variant={isCompleted ? 'outline' : 'default'}
                        className={isCompleted 
                          ? 'border-slate-600 text-slate-300 hover:bg-slate-800' 
                          : 'bg-emerald-600 hover:bg-emerald-700'
                        }
                      >
                        {isCompleted ? 'Repasar' : status.stepsCompleted > 0 ? 'Continuar' : 'Comenzar'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </EducationGamification>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Locked Advanced Content Teaser */}
      {experienceLevel !== 'advanced' && (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm border-dashed">
          <CardContent className="p-6 text-center">
            <Lock className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Contenido Avanzado Disponible
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Completa los tutoriales actuales y usa la plataforma por más tiempo para desbloquear contenido avanzado con más TreePoints.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {experienceLevel === 'new' ? '7+ días activo' : '30+ días activo'}
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                {experienceLevel === 'new' ? '2+ tutoriales' : '4+ tutoriales'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default EducationCenter;
