import { Navigation } from "@/components/Navigation";
import { useMasterExam } from "@/hooks/useMasterExam";
import { ExamIntro } from "@/components/master-exam/ExamIntro";
import { ExamActive } from "@/components/master-exam/ExamActive";
import { ExamResults } from "@/components/master-exam/ExamResults";
import { ExamTypeSelector } from "@/components/master-exam/ExamTypeSelector";
import { RoomIntelligenceSelector } from "@/components/master-exam/RoomIntelligenceSelector";
import { motion } from "framer-motion";

const MasterExam = () => {
  const exam = useMasterExam();

  const examTypeLabels: Record<string, string> = {
    master: "Master Exam",
    foundation: "Foundation Diagnostic",
    prophecy_sanctuary: "Prophecy & Sanctuary",
    room_test: exam.selectedRoomName ? `${exam.selectedRoomName} Test` : "Room Intelligence Test",
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Navigation />

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8 pb-24 md:pb-8 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 md:gap-4 mb-6"
        >
          <img
            src="/pwa-192x192.png"
            alt="Phototheology"
            className="h-10 w-10 md:h-12 md:w-12 rounded-xl shadow-lg shadow-primary/20"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Test Me
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {exam.phase === "active" || exam.phase === "submitting"
                ? examTypeLabels[exam.selectedExamType] || "Exam"
                : "PT Assessment System"}
            </p>
          </div>
        </motion.div>

        {/* Phase content */}
        <motion.div
          key={exam.phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {exam.phase === "intro" && (
            <ExamIntro
              history={exam.history}
              bestScore={exam.bestScore}
              inProgressExam={exam.inProgressExam}
              loading={exam.loading}
              onStart={() => exam.generateExam("master")}
              onResume={exam.resumeExam}
              onShowTypeSelector={exam.showTypeSelector}
            />
          )}

          {exam.phase === "select_type" && (
            <div className="max-w-2xl mx-auto">
              <ExamTypeSelector onSelect={async (type) => {
                if (type === "room_test") {
                  exam.showRoomSelector();
                } else if (type === "weakest_room") {
                  const weakest = await exam.findWeakestRoom();
                  if (weakest) {
                    exam.generateRoomExam(weakest.code, weakest.name);
                  }
                } else {
                  exam.generateExam(type);
                }
              }} />
            </div>
          )}

          {exam.phase === "select_room" && (
            <div className="max-w-3xl mx-auto">
              <RoomIntelligenceSelector
                onSelect={(roomCode, roomName) => exam.generateRoomExam(roomCode, roomName)}
                onBack={exam.showTypeSelector}
              />
            </div>
          )}

          {exam.phase === "generating" && (
            <div className="max-w-md mx-auto text-center py-20 space-y-6">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Generating Your Exam</h2>
                <p className="text-muted-foreground">
                  AI is crafting 50 unique questions
                  {exam.selectedExamType === "foundation" && " testing your PT framework knowledge"}
                  {exam.selectedExamType === "prophecy_sanctuary" && " on prophecy & sanctuary"}
                   {exam.selectedExamType === "master" && " across all domains"}
                   {exam.selectedExamType === "room_test" && exam.selectedRoomName && ` for the ${exam.selectedRoomName}`}
                  ...
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This usually takes 15-30 seconds
                </p>
              </div>
            </div>
          )}

          {exam.phase === "active" && (
            <ExamActive
              questions={exam.questions}
              answers={exam.answers}
              currentIndex={exam.currentIndex}
              flagged={exam.flagged}
              timeRemaining={exam.timeRemaining}
              answeredCount={exam.answeredCount}
              gradedCount={exam.gradedCount}
              questionGrades={exam.questionGrades}
              gradingQuestionId={exam.gradingQuestionId}
              challengingQuestionId={exam.challengingQuestionId}
              onSetCurrentIndex={exam.setCurrentIndex}
              onSetAnswer={exam.setAnswer}
              onToggleFlag={exam.toggleFlag}
              onSubmit={exam.submitExam}
              onAbandon={exam.abandonExam}
              onGradeQuestion={exam.gradeQuestion}
              onChallengeQuestion={exam.challengeQuestion}
            />
          )}

          {exam.phase === "submitting" && (
            <div className="max-w-md mx-auto text-center py-20 space-y-6">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {exam.selectedExamType !== "master" ? "Analyzing & Grading" : "Grading Your Exam"}
                </h2>
                <p className="text-muted-foreground">
                  {exam.selectedExamType !== "master"
                    ? "AI is grading your answers and generating your diagnostic report..."
                    : "AI is evaluating your written answers against rubrics..."}
                </p>
              </div>
            </div>
          )}

          {exam.phase === "results" && exam.results && (
            <ExamResults
              results={exam.results}
              onRetake={exam.resetToIntro}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default MasterExam;
