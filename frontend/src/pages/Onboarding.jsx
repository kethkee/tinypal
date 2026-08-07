import { useState } from "react";

import WelcomeStep from "../components/onboarding/WelcomeStep";
import AcademicStep from "../components/onboarding/AcademicStep";
import SubjectsStep from "../components/onboarding/SubjectsStep";
import CommitmentsStep from "../components/onboarding/CommitmentsStep";
import GoalsStep from "../components/onboarding/GoalsStep";
import RoutineStep from "../components/onboarding/RoutineStep";
import ReviewStep from "../components/onboarding/ReviewStep";
import ProgressBar from "../components/onboarding/ProgressBar";

function Onboarding() {

    const [step, setStep] = useState(1);
    const [onboardingData, setOnboardingData] = useState({
  college: "",
  branch: "",
  semester: "",

  subjects: [],

  commitments: [],

  goal: "",

  wake_up_time: "",
  sleep_time: "",

  preferred_study_time: "",
  daily_study_target: "",
});

    const nextStep = () => {

        setStep((prev) => prev + 1);

    };

    const prevStep = () => {

        setStep((prev) => prev - 1);

    };
    const updateData = (newData) => {
  setOnboardingData((prev) => ({
    ...prev,
    ...newData,
  }));
};

    const renderStep = () => {

        switch (step) {

            case 1:
                return <WelcomeStep nextStep={nextStep} />;

            case 2:
                return (
                    <AcademicStep
                        nextStep={nextStep}
                        prevStep={prevStep}
                        data={onboardingData}
                        updateData={updateData}
                    />
                );

            case 3:
                return (
                    <SubjectsStep
                        nextStep={nextStep}
                        prevStep={prevStep}
                        data={onboardingData}
                        updateData={updateData}
                    />
                );

            case 4:
                return (
                    <CommitmentsStep
                        nextStep={nextStep}
                        prevStep={prevStep}
                        data={onboardingData}
                        updateData={updateData}
                    />
                );

            case 5:
                return (
                    <GoalsStep
                        nextStep={nextStep}
                        prevStep={prevStep}
                        data={onboardingData}
                        updateData={updateData}
                    />
                );

            case 6:
                return (
                    <RoutineStep
                        nextStep={nextStep}
                        prevStep={prevStep}
                        data={onboardingData}
                        updateData={updateData}
                    />
                );

            case 7:
                return <ReviewStep prevStep={prevStep}
                data={onboardingData} />;

            default:
                return <WelcomeStep nextStep={nextStep} />;
        }

    };

    return (

        <div className="min-h-screen bg-[#FFF8F0] flex justify-center items-center">

            <div className="bg-white w-[700px] rounded-3xl shadow-xl p-10">

                <ProgressBar step={step} totalSteps={7} />

                {renderStep()}

            </div>

        </div>

    );

}

export default Onboarding;