/**
 * Gemini AI Service for Treevü
 * Handles expense classification, financial advice, and smart offer generation
 */

import { invokeLLM } from "../_core/llm";

export interface ExpenseClassification {
  merchant: string;
  amount: number;
  category: "food" | "transport" | "entertainment" | "services" | "health" | "shopping" | "other";
  isDiscretionary: boolean;
  confidence: number;
  budgetImpact: {
    categoryLimit: number;
    remainingAfter: number;
    percentUsed: number;
    status: "safe" | "warning" | "critical";
  };
  suggestedAction: {
    type: "save" | "offer";
    title: string;
    description: string;
    actionId: string;
  };
}

export interface FinancialAdvice {
  advice: string;
  category: "savings" | "spending" | "investment" | "general";
  priority: "low" | "medium" | "high";
  actionable: boolean;
}

export interface SmartOffer {
  suggestedTitle: string;
  suggestedDiscount: string;
  rationale: string;
  targetSegment: "low" | "mid" | "high" | "all";
}

/**
 * Helper to extract string content from LLM response
 */
function extractContent(content: string | Array<{ type: string; text?: string }>): string {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    const textPart = content.find(p => p.type === 'text');
    return textPart?.text || '';
  }
  return '';
}

/**
 * Classify an expense using AI
 */
export async function classifyExpense(inputText: string, userBudgets?: Record<string, number>): Promise<ExpenseClassification> {
  try {
    const budgetContext = userBudgets 
      ? `Presupuestos del usuario: ${JSON.stringify(userBudgets)}`
      : "Usa presupuestos estándar: Alimentos $400, Transporte $150, Ocio $100, Servicios $200, Salud $100";

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Eres el motor financiero de Treevü. Analiza gastos y proporciona clasificación inteligente.
          ${budgetContext}
          
          Responde SIEMPRE en JSON válido con esta estructura exacta:
          {
            "merchant": "nombre del comercio",
            "amount": número (en centavos),
            "category": "food" | "transport" | "entertainment" | "services" | "health" | "shopping" | "other",
            "isDiscretionary": boolean,
            "confidence": número 0-100,
            "budgetImpact": {
              "categoryLimit": número,
              "remainingAfter": número,
              "percentUsed": número 0-100,
              "status": "safe" | "warning" | "critical"
            },
            "suggestedAction": {
              "type": "save" | "offer",
              "title": "título corto",
              "description": "descripción breve",
              "actionId": "id único"
            }
          }`
        },
        {
          role: "user",
          content: `Analiza este gasto: "${inputText}"`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "expense_classification",
          strict: true,
          schema: {
            type: "object",
            properties: {
              merchant: { type: "string" },
              amount: { type: "number" },
              category: { type: "string", enum: ["food", "transport", "entertainment", "services", "health", "shopping", "other"] },
              isDiscretionary: { type: "boolean" },
              confidence: { type: "number" },
              budgetImpact: {
                type: "object",
                properties: {
                  categoryLimit: { type: "number" },
                  remainingAfter: { type: "number" },
                  percentUsed: { type: "number" },
                  status: { type: "string", enum: ["safe", "warning", "critical"] }
                },
                required: ["categoryLimit", "remainingAfter", "percentUsed", "status"],
                additionalProperties: false
              },
              suggestedAction: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["save", "offer"] },
                  title: { type: "string" },
                  description: { type: "string" },
                  actionId: { type: "string" }
                },
                required: ["type", "title", "description", "actionId"],
                additionalProperties: false
              }
            },
            required: ["merchant", "amount", "category", "isDiscretionary", "confidence", "budgetImpact", "suggestedAction"],
            additionalProperties: false
          }
        }
      }
    });

    const content = extractContent(response.choices[0]?.message?.content || '');
    if (!content) throw new Error("No response from AI");

    return JSON.parse(content) as ExpenseClassification;
  } catch (error) {
    console.error("[GeminiService] Expense classification failed:", error);
    return {
      merchant: "Comercio Desconocido",
      amount: 0,
      category: "other",
      isDiscretionary: true,
      confidence: 0,
      budgetImpact: {
        categoryLimit: 20000,
        remainingAfter: 15000,
        percentUsed: 25,
        status: "safe"
      },
      suggestedAction: {
        type: "save",
        title: "Ahorra el cambio",
        description: "Redondea y guarda en tu meta.",
        actionId: "fallback_save"
      }
    };
  }
}

/**
 * Get personalized financial advice based on user profile
 */
export async function getFinancialAdvice(
  fwiScore: number, 
  monthlyIncome: number,
  recentTransactions: Array<{ merchant: string; amount: number; category: string }>
): Promise<FinancialAdvice> {
  try {
    const transactionSummary = recentTransactions.slice(0, 5).map(t => 
      `${t.merchant}: $${(t.amount / 100).toFixed(2)} (${t.category})`
    ).join(", ");

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Eres un asesor financiero experto de Treevü. Proporciona consejos personalizados basados en el perfil del usuario.
          
          Responde SIEMPRE en JSON válido:
          {
            "advice": "consejo conciso en español latino (máximo 100 palabras)",
            "category": "savings" | "spending" | "investment" | "general",
            "priority": "low" | "medium" | "high",
            "actionable": boolean
          }`
        },
        {
          role: "user",
          content: `Perfil del usuario:
          - FWI Score: ${fwiScore}/100
          - Ingreso mensual: $${(monthlyIncome / 100).toFixed(2)}
          - Transacciones recientes: ${transactionSummary || "Sin transacciones recientes"}
          
          Dame un consejo personalizado para mejorar su bienestar financiero.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "financial_advice",
          strict: true,
          schema: {
            type: "object",
            properties: {
              advice: { type: "string" },
              category: { type: "string", enum: ["savings", "spending", "investment", "general"] },
              priority: { type: "string", enum: ["low", "medium", "high"] },
              actionable: { type: "boolean" }
            },
            required: ["advice", "category", "priority", "actionable"],
            additionalProperties: false
          }
        }
      }
    });

    const content = extractContent(response.choices[0]?.message?.content || '');
    if (!content) throw new Error("No response from AI");

    return JSON.parse(content) as FinancialAdvice;
  } catch (error) {
    console.error("[GeminiService] Financial advice failed:", error);
    return {
      advice: "Revisa tus gastos hormiga para mejorar tu puntaje esta semana. Pequeños ahorros diarios hacen una gran diferencia.",
      category: "general",
      priority: "medium",
      actionable: true
    };
  }
}

/**
 * Generate a smart offer suggestion for merchants
 */
export async function generateSmartOffer(
  topOffers: Array<{ title: string; conversions: number; redemptions: number }>,
  merchantCategory?: string
): Promise<SmartOffer> {
  try {
    const offersSummary = topOffers.map(o => 
      `"${o.title}" - ${o.conversions} conversiones, ${o.redemptions} redenciones`
    ).join("; ");

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Eres un experto en marketing para comercios en la plataforma Treevü.
          Basándote en ofertas exitosas anteriores, sugiere una NUEVA oferta optimizada.
          
          Responde SIEMPRE en JSON válido:
          {
            "suggestedTitle": "título corto y atractivo",
            "suggestedDiscount": "ej: 25% OFF, 2x1, $50 de descuento",
            "rationale": "explicación breve de por qué funcionará",
            "targetSegment": "low" | "mid" | "high" | "all"
          }`
        },
        {
          role: "user",
          content: `Ofertas exitosas anteriores: ${offersSummary || "Sin historial de ofertas"}
          ${merchantCategory ? `Categoría del comercio: ${merchantCategory}` : ""}
          
          Sugiere una nueva oferta optimizada para maximizar conversiones.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "smart_offer",
          strict: true,
          schema: {
            type: "object",
            properties: {
              suggestedTitle: { type: "string" },
              suggestedDiscount: { type: "string" },
              rationale: { type: "string" },
              targetSegment: { type: "string", enum: ["low", "mid", "high", "all"] }
            },
            required: ["suggestedTitle", "suggestedDiscount", "rationale", "targetSegment"],
            additionalProperties: false
          }
        }
      }
    });

    const content = extractContent(response.choices[0]?.message?.content || '');
    if (!content) throw new Error("No response from AI");

    return JSON.parse(content) as SmartOffer;
  } catch (error) {
    console.error("[GeminiService] Smart offer generation failed:", error);
    return {
      suggestedTitle: "Pack Ahorro Familiar",
      suggestedDiscount: "15% OFF",
      rationale: "Basado en tendencias de consumo familiar.",
      targetSegment: "all"
    };
  }
}

/**
 * Chat with financial advisor
 */
export async function chatWithAdvisor(
  userMessage: string,
  fwiScore: number,
  monthlyIncome: number,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  try {
    const systemPrompt = `Eres "Treevü Brain", un asistente financiero experto y empático.

PERFIL DEL USUARIO:
- FWI Score: ${fwiScore}/100 (Índice de Bienestar Financiero)
- Ingreso Mensual: $${(monthlyIncome / 100).toFixed(2)}

INSTRUCCIONES:
1. Sé conciso, directo y empático
2. Usa español latino neutro
3. Mantén respuestas bajo 100 palabras
4. Si preguntan por gastos, sugiere revisar categorías específicas
5. Si preguntan cómo mejorar su score, sugiere reducir gastos discrecionales
6. Usa emojis ocasionalmente para ser más amigable`;

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6).map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    const response = await invokeLLM({ messages });

    const content = extractContent(response.choices[0]?.message?.content || '');
    return content || "Lo siento, estoy recalculando. ¿Puedes preguntar de nuevo?";
  } catch (error) {
    console.error("[GeminiService] Chat failed:", error);
    return "Tengo problemas conectando con el servidor de análisis. Intenta más tarde.";
  }
}

/**
 * Calculate FWI Score factors using AI analysis
 */
export async function analyzeFwiFactors(
  transactions: Array<{ amount: number; category: string; isDiscretionary: boolean }>,
  goals: Array<{ targetAmount: number; currentAmount: number }>,
  ewaHistory: Array<{ amount: number; status: string }>
): Promise<{
  score: number;
  factors: {
    savingsRate: number;
    discretionarySpending: number;
    goalProgress: number;
    ewaUsage: number;
    consistency: number;
  };
  recommendations: string[];
}> {
  try {
    const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
    const discretionarySpending = transactions.filter(t => t.isDiscretionary).reduce((sum, t) => sum + t.amount, 0);
    const goalProgress = goals.length > 0 
      ? goals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount), 0) / goals.length * 100
      : 50;
    const ewaCount = ewaHistory.filter(e => e.status === "disbursed").length;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Eres un analista financiero de Treevü. Calcula el FWI Score (0-100) basado en los datos proporcionados.
          
          Responde en JSON:
          {
            "score": número 0-100,
            "factors": {
              "savingsRate": número 0-100,
              "discretionarySpending": número 0-100,
              "goalProgress": número 0-100,
              "ewaUsage": número 0-100,
              "consistency": número 0-100
            },
            "recommendations": ["recomendación 1", "recomendación 2", "recomendación 3"]
          }`
        },
        {
          role: "user",
          content: `Datos del usuario:
          - Gasto total: $${(totalSpending / 100).toFixed(2)}
          - Gasto discrecional: $${(discretionarySpending / 100).toFixed(2)} (${totalSpending > 0 ? ((discretionarySpending / totalSpending) * 100).toFixed(1) : 0}%)
          - Progreso de metas: ${goalProgress.toFixed(1)}%
          - Solicitudes EWA recientes: ${ewaCount}
          - Número de transacciones: ${transactions.length}
          
          Calcula el FWI Score y proporciona recomendaciones.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "fwi_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              score: { type: "number" },
              factors: {
                type: "object",
                properties: {
                  savingsRate: { type: "number" },
                  discretionarySpending: { type: "number" },
                  goalProgress: { type: "number" },
                  ewaUsage: { type: "number" },
                  consistency: { type: "number" }
                },
                required: ["savingsRate", "discretionarySpending", "goalProgress", "ewaUsage", "consistency"],
                additionalProperties: false
              },
              recommendations: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["score", "factors", "recommendations"],
            additionalProperties: false
          }
        }
      }
    });

    const content = extractContent(response.choices[0]?.message?.content || '');
    if (!content) throw new Error("No response from AI");

    return JSON.parse(content);
  } catch (error) {
    console.error("[GeminiService] FWI analysis failed:", error);
    return {
      score: 50,
      factors: {
        savingsRate: 50,
        discretionarySpending: 50,
        goalProgress: 50,
        ewaUsage: 50,
        consistency: 50
      },
      recommendations: [
        "Revisa tus gastos hormiga",
        "Establece una meta de ahorro",
        "Reduce gastos discrecionales"
      ]
    };
  }
}
