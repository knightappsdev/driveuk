'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target, 
  CheckCircle, 
  XCircle, 
  Star,
  Brain,
  Award,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface TheoryQuestion {
  id: number;
  categoryId: number;
  questionType: string;
  difficultyLevel: string;
  questionText: string;
  questionImage?: string;
  optionA: string;
  optionB: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  explanation: string;
  officialReference?: string;
}

interface TheoryCategory {
  id: number;
  categoryCode: string;
  categoryName: string;
  description: string;
  totalQuestions: number;
  passRequirement: number;
  displayOrder: number;
  progress?: {
    questionsAttempted: number;
    questionsCorrect: number;
    accuracyPercentage: string;
    isReadyForTest: boolean;
    lastPracticeDate: string;
  } | null;
}

interface TestSession {
  sessionId: string;
  questions: TheoryQuestion[];
  totalQuestions: number;
  timeLimit: number;
  categoryId: string;
}

interface UserStats {
  totalPoints: number;
  theoryPoints: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  nextLevelPoints: number;
}

export default function TheoryTestSystem() {
  // State management
  const [categories, setCategories] = useState<TheoryCategory[]>([]);
  const [currentSession, setCurrentSession] = useState<TestSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionResults, setSessionResults] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState(10);

  // Mock user ID - in real app, get from auth context
  const userId = '1';

  useEffect(() => {
    loadCategories();
    loadUserStats();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            handleSessionTimeout();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const loadCategories = async () => {
    try {
      const response = await fetch(`/api/theory/categories?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    // Mock stats - in real app, fetch from API
    setUserStats({
      totalPoints: 1250,
      theoryPoints: 850,
      currentStreak: 5,
      longestStreak: 12,
      level: 3,
      nextLevelPoints: 500
    });
  };

  const startPracticeSession = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/theory/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          categoryId: selectedCategory,
          questionCount,
          difficulty: selectedDifficulty
        })
      });

      const data = await response.json();
      if (data.success) {
        setCurrentSession(data.data);
        setTimeRemaining(data.data.timeLimit);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setSelectedAnswer('');
        setShowExplanation(false);
        setSessionComplete(false);
        setSessionResults(null);
        setIsActive(true);
      } else {
        alert('Error starting session: ' + data.error);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error starting practice session');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (!currentSession || showExplanation) return;
    
    setSelectedAnswer(answer);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setShowExplanation(true);
    setIsActive(false);
  };

  const handleNextQuestion = () => {
    if (!currentSession) return;

    if (currentQuestionIndex < currentSession.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1] || '');
      setShowExplanation(false);
      setIsActive(true);
    } else {
      // Session complete
      handleSessionComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || '');
      setShowExplanation(false);
      setIsActive(true);
    }
  };

  const handleSessionComplete = async () => {
    if (!currentSession) return;

    setIsActive(false);
    setSessionComplete(true);

    // Prepare results
    const results = currentSession.questions.map((question, index) => ({
      questionId: question.id,
      selectedAnswer: userAnswers[index] || '',
      correctAnswer: question.correctAnswer,
      isCorrect: userAnswers[index] === question.correctAnswer,
      timeSpent: 120 // Mock time per question
    }));

    try {
      const response = await fetch('/api/theory/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          sessionId: currentSession.sessionId,
          categoryId: currentSession.categoryId,
          results,
          timeSpent: currentSession.timeLimit - timeRemaining,
          sessionType: 'practice'
        })
      });

      const data = await response.json();
      if (data.success) {
        setSessionResults(data.data);
        await loadCategories(); // Refresh progress
        await loadUserStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error submitting session:', error);
    }
  };

  const handleSessionTimeout = () => {
    alert('Time is up! Submitting your answers...');
    handleSessionComplete();
  };

  const resetSession = () => {
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setUserAnswers({});
    setShowExplanation(false);
    setTimeRemaining(0);
    setIsActive(false);
    setSessionComplete(false);
    setSessionResults(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    return currentSession?.questions[currentQuestionIndex];
  };

  const getProgressPercentage = () => {
    if (!currentSession) return 0;
    return ((currentQuestionIndex + 1) / currentSession.questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading theory test system...</span>
      </div>
    );
  }

  // Session Results View
  if (sessionComplete && sessionResults) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              {sessionResults.result === 'pass' ? (
                <Trophy className="w-8 h-8 text-yellow-600" />
              ) : (
                <Target className="w-8 h-8 text-blue-600" />
              )}
              Session Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={sessionResults.result === 'pass' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {sessionResults.score}/{sessionResults.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Questions Correct</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {sessionResults.accuracyPercentage}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    +{sessionResults.pointsEarned}
                  </div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </CardContent>
              </Card>
            </div>

            {/* Result Badge */}
            <div className="text-center">
              <Badge 
                variant={sessionResults.result === 'pass' ? 'default' : 'secondary'}
                className={`text-lg py-2 px-4 ${
                  sessionResults.result === 'pass' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {sessionResults.result === 'pass' ? '✅ PASS' : '📚 KEEP PRACTICING'}
              </Badge>
            </div>

            {/* Feedback */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Feedback</h3>
                <p className="text-gray-700">{sessionResults.feedback}</p>
              </CardContent>
            </Card>

            {/* New Achievements */}
            {sessionResults.newAchievements && sessionResults.newAchievements.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    New Achievements!
                  </h3>
                  <div className="space-y-2">
                    {sessionResults.newAchievements.map((achievement: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Star className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-sm text-gray-600">{achievement.description}</div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          +{achievement.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button onClick={startPracticeSession} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </Button>
              <Button onClick={resetSession} variant="outline" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Back to Categories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active Session View
  if (currentSession && !sessionComplete) {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const hasAnswered = showExplanation;

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Session Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">Question {currentQuestionIndex + 1} of {currentSession.questions.length}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeRemaining)}
                </Badge>
              </div>
              <Button onClick={resetSession} variant="outline" size="sm">
                Exit Session
              </Button>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className={`
                ${currentQuestion.difficultyLevel === 'foundation' ? 'bg-green-100 text-green-800' : ''}
                ${currentQuestion.difficultyLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${currentQuestion.difficultyLevel === 'advanced' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {currentQuestion.difficultyLevel}
              </Badge>
              {currentQuestion.officialReference && (
                <Badge variant="outline">
                  {currentQuestion.officialReference}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Question Image */}
            {currentQuestion.questionImage && (
              <div className="mb-6">
                <img 
                  src={currentQuestion.questionImage} 
                  alt="Question diagram"
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>
            )}

            {/* Question Text */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold leading-relaxed">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((option) => {
                const optionText = currentQuestion[`option${option}` as keyof TheoryQuestion] as string;
                if (!optionText) return null;

                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = currentQuestion.correctAnswer === option;
                
                let buttonClass = 'w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ';
                
                if (hasAnswered) {
                  if (isCorrectAnswer) {
                    buttonClass += 'border-green-500 bg-green-50 text-green-800';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'border-red-500 bg-red-50 text-red-800';
                  } else {
                    buttonClass += 'border-gray-200 bg-gray-50 text-gray-600';
                  }
                } else if (isSelected) {
                  buttonClass += 'border-blue-500 bg-blue-50 text-blue-800';
                } else {
                  buttonClass += 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={hasAnswered}
                    className={buttonClass}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold">
                        {hasAnswered && isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                        {!hasAnswered && option}
                      </div>
                      <span className="flex-1">{optionText}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6">
              <Button 
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {!hasAnswered && (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="flex items-center gap-2"
                  >
                    {selectedAnswer ? <CheckCircle className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                    Submit Answer
                  </Button>
                )}
                
                {hasAnswered && (
                  <Button 
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2"
                  >
                    {currentQuestionIndex === currentSession.questions.length - 1 ? (
                      <>
                        <Trophy className="w-4 h-4" />
                        Finish Session
                      </>
                    ) : (
                      <>
                        Next Question
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Explanation */}
            {hasAnswered && (
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold">Explanation</h3>
                    {isCorrect && <Badge className="bg-green-100 text-green-800">Correct!</Badge>}
                    {!isCorrect && <Badge className="bg-red-100 text-red-800">Incorrect</Badge>}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">UK Theory Test Practice</h1>
        <p className="text-gray-600">Master the DVSA theory test with unlimited practice</p>
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">{userStats.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{userStats.currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">Level {userStats.level}</div>
              <div className="text-sm text-gray-600">{userStats.nextLevelPoints} to next</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{userStats.longestStreak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Practice Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Start Practice Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="foundation">Foundation</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Questions</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={20}>20 Questions</option>
                <option value={50}>50 Questions (Full Mock)</option>
              </select>
            </div>
          </div>
          
          <Button 
            onClick={startPracticeSession}
            disabled={loading}
            className="w-full md:w-auto flex items-center gap-2"
            size="lg"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            Start Practice Session
          </Button>
        </CardContent>
      </Card>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Your Progress by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const progress = category.progress;
              const accuracyPercentage = progress ? parseFloat(progress.accuracyPercentage) : 0;
              const isReady = progress?.isReadyForTest || false;
              
              return (
                <div key={category.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{category.categoryName}</h3>
                    <div className="flex items-center gap-2">
                      {isReady && (
                        <Badge className="bg-green-100 text-green-800">Ready</Badge>
                      )}
                      <Badge variant="outline">
                        {progress?.questionsAttempted || 0} attempted
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Accuracy</span>
                      <span>{accuracyPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={accuracyPercentage} 
                      className={`h-2 ${isReady ? 'bg-green-100' : ''}`}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}