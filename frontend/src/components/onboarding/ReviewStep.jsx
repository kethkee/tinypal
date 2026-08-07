import { createProfile } from "../services/profileService";
import { useNavigate } from "react-router-dom";

function ReviewStep({ prevStep, data }) {
  const navigate = useNavigate();
  const handleFinish = async () => {

    try {

        await createProfile(data);

        alert("Profile created successfully!");

        navigate("/dashboard");

    } catch (error) {

        console.error(error);

        alert("Failed to save profile.");

    }

};
  return (
    <div>

      <h1 className="text-3xl font-bold text-red-500 mb-3">
        🌸 Review Your Profile
      </h1>

      <p className="text-gray-600 mb-8">
        Please review your information before continuing.
      </p>

      <div className="space-y-8">

        <div>
          <h2 className="font-bold text-xl mb-2">🎓 Academic</h2>

          <p>College: {data.college}</p>
          <p>Branch: {data.branch}</p>
          <p>Semester: {data.semester}</p>
        </div>

        <div>
          <h2 className="font-bold text-xl mb-2">📚 Subjects</h2>

          <ul className="list-disc ml-6">
            {data.subjects.map((subject, index) => (
              <li key={index}>{subject}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-xl mb-2">📅 Commitments</h2>

          {data.commitments.map((item, index) => (
            <div key={index} className="mb-2">

              <p>
                {item.day} | {item.start} - {item.end}
              </p>

              <p>
                {item.title} ({item.type})
              </p>

            </div>
          ))}
        </div>

        <div>
          <h2 className="font-bold text-xl mb-2">🎯 Goal</h2>

          <p>{data.goal}</p>
        </div>

        <div>
          <h2 className="font-bold text-xl mb-2">🌙 Routine</h2>

          <p>Wake Up: {data.wake_up_time}</p>
          <p>Sleep: {data.sleep_time}</p>
          <p>Preferred Study: {data.preferred_study_time}</p>
          <p>Daily Target: {data.daily_study_target} hrs</p>
        </div>

      </div>

      <div className="flex justify-between mt-10">

        <button
          onClick={prevStep}
          className="bg-gray-300 px-6 py-3 rounded-xl"
        >
          ← Back
        </button>

        <button
          className="bg-red-500 text-white px-8 py-3 rounded-xl"
          onClick={handleFinish}  
        >
          Finish ✨
        </button>

      </div>

    </div>
  );
}

export default ReviewStep;