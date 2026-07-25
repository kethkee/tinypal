function FeatureCard({ icon, title, description }) {
  return (
    <div className="
      bg-white
      rounded-3xl
      p-8
      shadow-md
      hover:shadow-2xl
      hover:-translate-y-3
      transition-all
      duration-300
      border
      border-transparent
      hover:border-[#FF5A5F]
    ">

      <div className="
        w-16
        h-16
        rounded-2xl
        bg-[#FFE5EC]
        text-[#FF5A5F]
        flex
        items-center
        justify-center
        mb-6
      ">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4">
        {title}
      </h3>

      <p className="text-gray-600 leading-8">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;