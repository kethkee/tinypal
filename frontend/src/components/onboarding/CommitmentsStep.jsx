import { useState } from "react";

function CommitmentsStep({ nextStep, prevStep, data, updateData }) {

  const [commitment, setCommitment] = useState({
    day: "",
    start: "",
    end: "",
    title: "",
    type: "",
  });

  const [commitments, setCommitments] = useState(
    data.commitments || []
  );

  const handleChange = (e) => {
    setCommitment({
      ...commitment,
      [e.target.name]: e.target.value,
    });
  };

  const addCommitment = () => {

    if (
      !commitment.day ||
      !commitment.start ||
      !commitment.end ||
      !commitment.title ||
      !commitment.type
    ) {
      alert("Please complete all fields.");
      return;
    }

    setCommitments([...commitments, commitment]);

    setCommitment({
      day: "",
      start: "",
      end: "",
      title: "",
      type: "",
    });

  };

  const removeCommitment = (index) => {
    setCommitments(commitments.filter((_, i) => i !== index));
  };

  const handleNext = () => {

    updateData({
      commitments,
    });

    nextStep();

  };

  return (
    <div>

      <h1 className="text-3xl font-bold text-red-500 mb-3">
        📅 Weekly Commitments
      </h1>

      <p className="text-gray-600 mb-8">
        Tell Tiny when you're usually busy.
      </p>

      <div className="grid grid-cols-2 gap-4">

        <select
          name="day"
          value={commitment.day}
          onChange={handleChange}
          className="border rounded-xl p-3"
        >
          <option value="">Select Day</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
          <option>Sunday</option>
        </select>

        <select
          name="type"
          value={commitment.type}
          onChange={handleChange}
          className="border rounded-xl p-3"
        >
          <option value="">Type</option>
          <option>Academic</option>
          <option>Personal</option>
          <option>Work</option>
          <option>Other</option>
        </select>

        <input
          type="time"
          name="start"
          value={commitment.start}
          onChange={handleChange}
          className="border rounded-xl p-3"
        />

        <input
          type="time"
          name="end"
          value={commitment.end}
          onChange={handleChange}
          className="border rounded-xl p-3"
        />

      </div>

      <input
        type="text"
        name="title"
        placeholder="Commitment Title"
        value={commitment.title}
        onChange={handleChange}
        className="w-full border rounded-xl p-3 mt-4"
      />

      <button
        onClick={addCommitment}
        className="bg-red-500 text-white px-5 py-3 rounded-xl mt-5"
      >
        + Add Commitment
      </button>

      <div className="mt-8 space-y-3">

        {commitments.map((item, index) => (

          <div
            key={index}
            className="bg-gray-100 rounded-xl p-4 flex justify-between items-center"
          >

            <div>

              <p className="font-semibold">
                {item.day} | {item.start} - {item.end}
              </p>

              <p>{item.title}</p>

              <p className="text-sm text-gray-500">
                {item.type}
              </p>

            </div>

            <button
              onClick={() => removeCommitment(index)}
              className="text-red-500 font-bold text-xl"
            >
              ✕
            </button>

          </div>

        ))}

      </div>

      <div className="flex justify-between mt-8">

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

export default CommitmentsStep;