import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import WelcomeStep from "../components/onboarding/WelcomeStep";
import SubjectsStep from "../components/onboarding/SubjectsStep";
import GoalsStep from "../components/onboarding/GoalsStep";
import CommitmentsStep from "../components/onboarding/CommitmentsStep";
import RoutineStep from "../components/onboarding/RoutineStep";
import ReviewStep from "../components/onboarding/ReviewStep";
import ProgressStepper from "../ui/ProgressStepper";
import PageContainer from "../ui/PageContainer";
import Card from "../ui/Card";

const steps = ["Welcome", "Tasks", "Priorities", "Schedule", "Preferences", "Review"];

function Onboarding() {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    tasks: [], priorities: [], commitments: [], wake_up_time: "", sleep_time: "",
    preferred_study_time: "", daily_study_target: "", break_duration: "25",
  });
  const updateData = (newData) => setOnboardingData((previous) => ({ ...previous, ...newData }));
  const nextStep = () => setStep((current) => Math.min(current + 1, steps.length));
  const prevStep = () => setStep((current) => Math.max(current - 1, 1));
  const common = { nextStep, prevStep, data: onboardingData, updateData };

  const content = [
    <WelcomeStep key="welcome" nextStep={nextStep} />,
    <SubjectsStep key="tasks" {...common} />,
    <GoalsStep key="priorities" {...common} />,
    <CommitmentsStep key="schedule" {...common} />,
    <RoutineStep key="preferences" {...common} />,
    <ReviewStep key="review" prevStep={prevStep} data={onboardingData} />,
  ][step - 1];

  return <PageContainer>
    <Card className="max-w-4xl mx-auto p-6 sm:p-10">
      <ProgressStepper currentStep={step} steps={steps} />
      <AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>{content}</motion.div></AnimatePresence>
    </Card>
  </PageContainer>;
}

export default Onboarding;
