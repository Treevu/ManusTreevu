import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  Heart,
  TreePine,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Emoji scale options
const EMOJI_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Muy mal' },
  { value: 2, emoji: '😕', label: 'Mal' },
  { value: 3, emoji: '😐', label: 'Regular' },
  { value: 4, emoji: '🙂', label: 'Bien' },
  { value: 5, emoji: '😊', label: 'Muy bien' },
];

// Scale labels
const SCALE_LABELS = ['Muy bajo', 'Bajo', 'Medio', 'Alto', 'Muy alto'];

interface Question {
  id: number;
  questionText: string;
  questionType: 'scale' | 'emoji' | 'text' | 'choice';
  category: string;
  options?: string;
  orderIndex: number;
}

interface Response {
  questionId: number;
  responseValue?: number;
  responseText?: string;
  responseChoice?: string;
}

export default function PulseSurvey() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const { data: surveyData, isLoading } = trpc.surveys.getActive.useQuery();
  
  const submitMutation = trpc.surveys.submit.useMutation({
    onSuccess: () => {
      setIsComplete(true);
      toast.success('¡Gracias por completar la encuesta!');
    },
    onError: (error) => {
      toast.error('Error al enviar la encuesta. Por favor intenta de nuevo.');
    },
  });

  const questions: Question[] = surveyData?.questions || [];
  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const getCurrentResponse = () => {
    return responses.find(r => r.questionId === currentQuestion?.id);
  };

  const setResponse = (value: number | string, type: 'value' | 'text' | 'choice') => {
    const newResponses = responses.filter(r => r.questionId !== currentQuestion.id);
    const response: Response = { questionId: currentQuestion.id };
    
    if (type === 'value') response.responseValue = value as number;
    else if (type === 'text') response.responseText = value as string;
    else if (type === 'choice') response.responseChoice = value as string;
    
    newResponses.push(response);
    setResponses(newResponses);
  };

  const canProceed = () => {
    const response = getCurrentResponse();
    if (!response) return false;
    if (currentQuestion.questionType === 'text') return (response.responseText?.length || 0) > 0;
    if (currentQuestion.questionType === 'choice') return !!response.responseChoice;
    return response.responseValue !== undefined;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Submit survey
      if (surveyData?.survey?.id) {
        submitMutation.mutate({
          surveyId: surveyData.survey.id,
          responses: responses,
        });
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-gray-400">Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (!surveyData?.survey || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="bg-gray-900/50 border-gray-800 max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No hay encuestas pendientes</h2>
            <p className="text-gray-400 mb-6">
              ¡Excelente! Ya completaste todas las encuestas disponibles.
            </p>
            <Link href="/dashboard/employee">
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                Volver al Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <Card className="bg-gray-900/50 border-gray-800 max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6"
              >
                <Heart className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Gracias por tu tiempo!</h2>
              <p className="text-gray-400 mb-6">
                Tu feedback nos ayuda a mejorar el bienestar de todos en la organización.
              </p>
              <div className="flex items-center justify-center gap-2 text-emerald-400 mb-6">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">+50 TreePoints ganados</span>
              </div>
              <Link href="/dashboard/employee">
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <TreePine className="w-4 h-4 mr-2" />
                  Volver al Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/employee" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold">Encuesta de Bienestar</h1>
                <p className="text-sm text-gray-400">{surveyData.survey.title || 'Pulse Survey'}</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {currentIndex + 1} / {questions.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="sticky top-[73px] z-40 bg-[#0a0a0a]">
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardDescription className="text-emerald-400 uppercase text-xs tracking-wider">
                  {currentQuestion.category.replace(/_/g, ' ')}
                </CardDescription>
                <CardTitle className="text-white text-xl leading-relaxed">
                  {currentQuestion.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Emoji Type */}
                {currentQuestion.questionType === 'emoji' && (
                  <div className="flex justify-between gap-2">
                    {EMOJI_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setResponse(option.value, 'value')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                          getCurrentResponse()?.responseValue === option.value
                            ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-105'
                            : 'bg-gray-800/50 border-2 border-transparent hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-3xl">{option.emoji}</span>
                        <span className="text-xs text-gray-400">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Scale Type */}
                {currentQuestion.questionType === 'scale' && (
                  <div className="space-y-4">
                    <div className="flex justify-between gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setResponse(value, 'value')}
                          className={`flex-1 aspect-square flex items-center justify-center text-xl font-bold rounded-xl transition-all ${
                            getCurrentResponse()?.responseValue === value
                              ? 'bg-emerald-500 text-white scale-105'
                              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{SCALE_LABELS[0]}</span>
                      <span>{SCALE_LABELS[4]}</span>
                    </div>
                  </div>
                )}

                {/* Text Type */}
                {currentQuestion.questionType === 'text' && (
                  <Textarea
                    placeholder="Escribe tu respuesta aquí..."
                    value={getCurrentResponse()?.responseText || ''}
                    onChange={(e) => setResponse(e.target.value, 'text')}
                    className="bg-gray-800 border-gray-700 text-white min-h-[120px] resize-none"
                  />
                )}

                {/* Choice Type */}
                {currentQuestion.questionType === 'choice' && currentQuestion.options && (
                  <div className="space-y-2">
                    {JSON.parse(currentQuestion.options).map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setResponse(option, 'choice')}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          getCurrentResponse()?.responseChoice === option
                            ? 'bg-emerald-500/20 border-2 border-emerald-500'
                            : 'bg-gray-800/50 border-2 border-transparent hover:bg-gray-800'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="border-gray-700 text-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || submitMutation.isPending}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            {submitMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : currentIndex === questions.length - 1 ? (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
