function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

      <div className="text-5xl mb-6">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {title}
      </h3>

      <p className="text-gray-600 leading-8">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;