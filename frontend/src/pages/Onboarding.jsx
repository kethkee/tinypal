import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WelcomeStep from "../components/onboarding/WelcomeStep";
import SubjectsStep from "../components/onboarding/SubjectsStep";
import GoalsStep from "../components/onboarding/GoalsStep";
import CommitmentsStep from "../components/onboarding/CommitmentsStep";
import RoutineStep from "../components/onboarding/RoutineStep";
import ReviewStep from "../components/onboarding/ReviewStep";
import { getProfile } from "../services/profileService";
import ProgressStepper from "../ui/ProgressStepper";
import PageContainer from "../ui/PageContainer";
import Card from "../ui/Card";

const steps = ["Welcome", "Tasks", "Priorities", "Schedule", "Preferences", "Review"];
const blankData = { tasks: [], priorities: [], commitments: [], wake_up_time: "", sleep_time: "", preferred_study_time: "", daily_study_target: "", break_duration: "25" };
function Onboarding() {
  const editing = new URLSearchParams(useLocation().search).get("edit") === "true";
  const [step, setStep] = useState(() => editing ? 2 : 1); const [loading, setLoading] = useState(editing); const [error, setError] = useState(""); const [onboardingData, setOnboardingData] = useState(blankData);
  useEffect(() => { if (!editing) return; let active = true; getProfile().then((profile) => { if (active) setOnboardingData({ ...blankData, ...profile }); }).catch(() => { if (active) setError("Your saved plan could not be loaded. You can still create a new one."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [editing]);
  const updateData = (newData) => setOnboardingData((previous) => ({ ...previous, ...newData })); const nextStep = () => setStep((current) => Math.min(current + 1, steps.length)); const prevStep = () => setStep((current) => Math.max(current - 1, editing ? 2 : 1)); const common = { nextStep, prevStep, data: onboardingData, updateData };
  const content = [<WelcomeStep key="welcome" nextStep={nextStep} />, <SubjectsStep key="tasks" {...common} />, <GoalsStep key="priorities" {...common} />, <CommitmentsStep key="schedule" {...common} />, <RoutineStep key="preferences" {...common} />, <ReviewStep key="review" prevStep={prevStep} data={onboardingData} />][step - 1];
  return <PageContainer><Card className="max-w-4xl mx-auto p-6 sm:p-10">{editing && <p className="mb-5 text-sm font-semibold text-indigo-600">EDIT YOUR SAVED PLAN</p>}{error && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{loading ? <p className="py-16 text-center text-gray-500">Loading your saved plan...</p> : <><ProgressStepper currentStep={step} steps={steps} /><AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>{content}</motion.div></AnimatePresence></>}</Card></PageContainer>;
}
export default Onboarding;
