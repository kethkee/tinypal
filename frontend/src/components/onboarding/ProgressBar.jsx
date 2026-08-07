function ProgressBar({ step, totalSteps }) {

  const percentage = (step / totalSteps) * 100;

  return (
    <div className="mb-10">

      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>
          Step {step} of {totalSteps}
        </span>

        <span>
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">

        <div
          className="bg-red-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>
  );
}

export default ProgressBar;