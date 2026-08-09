function StatsCard({ number, label }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

      <h2 className="text-5xl font-black text-indigo-600">
        {number}
      </h2>

      <p className="mt-4 text-gray-600 font-medium">
        {label}
      </p>

    </div>
  );
}

export default StatsCard;
