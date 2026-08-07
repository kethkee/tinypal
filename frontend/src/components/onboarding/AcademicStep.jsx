import { useState } from "react";

function AcademicStep({ nextStep, prevStep, data, updateData }) {
  const [formData, setFormData] = useState({
    college: data.college,
    branch: data.branch,
    semester: data.semester,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (
      !formData.college ||
      !formData.branch ||
      !formData.semester
    ) {
      alert("Please fill all the fields.");
      return;
    }

    updateData(formData);
    nextStep();
  };

  return (
    <div>

      <h1 className="text-3xl font-bold text-red-500 mb-3">
        🎓 Academic Information
      </h1>

      <p className="text-gray-600 mb-8">
        Tell Tiny about your academic details.
      </p>

      <input
        type="text"
        name="college"
        placeholder="College"
        value={formData.college}
        onChange={handleChange}
        className="w-full border rounded-xl p-3 mb-4"
      />

      <input
        type="text"
        name="branch"
        placeholder="Branch"
        value={formData.branch}
        onChange={handleChange}
        className="w-full border rounded-xl p-3 mb-4"
      />

      <input
        type="number"
        name="semester"
        placeholder="Semester"
        value={formData.semester}
        onChange={handleChange}
        className="w-full border rounded-xl p-3 mb-8"
      />

      <div className="flex justify-between">

        <button
          onClick={prevStep}
          className="bg-gray-300 px-6 py-3 rounded-xl"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600"
        >
          Next →
        </button>

      </div>

    </div>
  );
}

export default AcademicStep;