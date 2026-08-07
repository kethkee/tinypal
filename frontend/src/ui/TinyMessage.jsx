import { motion } from "framer-motion";

function TinyMessage({ title, message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="text-6xl mb-4">
        🌸
      </div>

      <h1 className="text-4xl font-bold text-gray-800">
        {title}
      </h1>

      <p className="text-gray-500 text-lg mt-4 leading-8">
        {message}
      </p>
    </motion.div>
  );
}

export default TinyMessage;