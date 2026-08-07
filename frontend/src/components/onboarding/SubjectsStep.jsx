import { useState } from "react";

function SubjectsStep({ nextStep, prevStep, data, updateData }) {
  const [subject, setSubject] = useState("");

  const [subjects, setSubjects] = useState(data.subjects || []);

  const addSubject = () => {
    if (!subject.trim()) return;

    setSubjects([...subjects, subject.trim()]);
    setSubject("");
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (subjects.length === 0) {
      alert("Please add at least one subject.");
      return;
    }

    updateData({
      subjects,
    });

    nextStep();
  };

  return (
    <div>

      <h1 className="text-3xl font-bold text-red-500 mb-3">
        📚 Subjects
      </h1>

      <p className="text-gray-600 mb-8">
        Add all the subjects you are studying this semester.
      </p>

      <div className="flex gap-3 mb-6">

        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject"
          className="flex-1 border rounded-xl p-3"
        />

        <button
          onClick={addSubject}
          className="bg-red-500 text-white px-5 rounded-xl"
        >
          Add
        </button>

      </div>

      <div className="space-y-3 mb-8">

        {subjects.map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center bg-gray-100 rounded-xl px-4 py-3"
          >

            <span>{item}</span>

            <button
              onClick={() => removeSubject(index)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>

          </div>

        ))}

      </div>

      <div className="flex justify-between">

        <button
          onClick={prevStep}
          className="bg-gray-300 px-6 py-3 rounded-xl"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          className="bg-red-500 text-white px-6 py-3 rounded-xl"
        >
          Next →
        </button>

      </div>

    </div>
  );
}

export default SubjectsStep;