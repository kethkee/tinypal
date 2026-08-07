import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await register(formData);

      setMessage(response.message);

      setFormData({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });
    } catch (error) {
      if (error.response?.data) {
        setMessage(JSON.stringify(error.response.data));
      } else {
        setMessage("Something went wrong.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-3xl p-10 w-[420px]"
      >

        <h1 className="text-4xl font-bold text-center text-red-500 mb-8">
          🌸 TinyPal
        </h1>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          className="w-full border rounded-xl p-3 mb-6"
        />

        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-semibold transition"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {message && (
          <p className="text-center mt-5 text-sm">
            {message}
          </p>
        )}

      </form>

    </div>
  );
}

export default Signup;