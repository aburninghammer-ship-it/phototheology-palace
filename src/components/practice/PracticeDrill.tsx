import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dumbbell, CheckCircle, XCircle, Clock, Trophy, ArrowRight } from "lucide-react";
import { DrillQuestion, DrillResult, useDrills } from "@/hooks/useDrills";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { palaceFloors } from "@/data/palaceData";
import { useNavigate } from "react-router-dom";

interface PracticeDrillProps {
  floorNumber: number;
  roomId: string;
  roomName: string;
  drillType: string;
  questions: DrillQuestion[];
}

export const PracticeDrill = ({
  floorNumber,
  roomId,
  roomName,
  drillType,
  questions,
}: PracticeDrillProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [completed, setCompleted] = useState(false);
  
  const { saveDrillResult } = useDrills(floorNumber, roomId);
  const navigate = useNavigate();
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Find next room in sequence
  const getNextRoom = () => {
    const currentFloor = palaceFloors.find(f => f.number === floorNumber);
    if (!currentFloor) return null;

    const currentRoomIndex = currentFloor.rooms.findIndex(r => r.id === roomId);
    if (currentRoomIndex === -1) return null;

    // Check if there's a next room on the same floor
    if (currentRoomIndex < currentFloor.rooms.length - 1) {
      return {
        floor: floorNumber,
        room: currentFloor.rooms[currentRoomIndex + 1]
      };
    }

    // Move to the first room of the next floor
    const nextFloor = palaceFloors.find(f => f.number === floorNumber + 1);
    if (nextFloor && nextFloor.rooms.length > 0) {
      return {
        floor: nextFloor.number,
        room: nextFloor.rooms[0]
      };
    }

    return null;
  };

  const nextRoom = getNextRoom();

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = [...answers, { questionId: currentQuestion.id, correct: isCorrect }];
    setAnswers(newAnswers);
    setShowResult(true);

    // Auto-advance after showing result
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question and reset state
        setShowResult(false);
        setSelectedAnswer(null);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        completeDrill(newAnswers);
      }
    }, 2000);
  };

  const completeDrill = async (finalAnswers: { questionId: string; correct: boolean }[]) => {
    const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const score = finalAnswers.filter(a => a.correct).length;
    
    const result: DrillResult = {
      score,
      maxScore: questions.length,
      timeSeconds,
      answers: finalAnswers,
    };

    await saveDrillResult(drillType, result, { questionCount: questions.length });
    setCompleted(true);
  };

  const restart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setStartTime(Date.now());
    setCompleted(false);
  };

  if (completed) {
    const score = answers.filter(a => a.correct).length;
    const percentage = Math.round((score / questions.length) * 100);
    const timeSeconds = Math.floor((Date.now() - startTime) / 1000);

    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
          <CardTitle className="text-3xl">Drill Complete!</CardTitle>
          <CardDescription>
            {roomName} - {drillType}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-6xl font-bold text-primary">{percentage}%</div>
            <p className="text-muted-foreground">
              {score} out of {questions.length} correct
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {timeSeconds} seconds
            </div>
          </div>

          <div className="space-y-2">
            {answers.map((answer, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  answer.correct ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
                }`}
              >
                {answer.correct ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm">Question {idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={restart} variant="outline" className="flex-1">
              Practice Again
            </Button>
            {nextRoom && (
              <Button 
                onClick={() => navigate(`/palace/floor/${nextRoom.floor}/room/${nextRoom.room.id}`)}
                className="flex-1 gradient-palace"
              >
                Next Room
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Dumbbell className="h-4 w-4" />
            {drillType}
          </div>
        </div>
        <Progress value={progress} className="mb-4" />
        <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedAnswer?.toString()} onValueChange={(val) => handleAnswerSelect(parseInt(val))}>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                } ${showResult ? "pointer-events-none" : ""}`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer font-medium"
                >
                  {option}
                </Label>
                {showResult && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            ))}
          </div>
        </RadioGroup>

        {showResult && currentQuestion.explanation && (
          <Alert>
            <AlertDescription className="text-sm">
              {currentQuestion.explanation}
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmitAnswer}
          disabled={selectedAnswer === null || showResult}
          className="w-full"
        >
          {showResult ? "Moving to next..." : "Submit Answer"}
        </Button>
      </CardContent>
    </Card>
  );
};
