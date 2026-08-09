import { ArrowRight } from "lucide-react";

function StepCard({ number, icon, title, description, showArrow }) {
  return (
    <div className="relative flex flex-col items-center text-center">

      <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
        {number}
      </div>

      <div className="mt-8 w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-md">
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-4 text-gray-600 leading-7 max-w-xs">
        {description}
      </p>

      {showArrow && (
        <ArrowRight
          className="hidden lg:block absolute top-8 -right-16 text-indigo-400"
          size={40}
        />
      )}

    </div>
  );
}

export default StepCard;
