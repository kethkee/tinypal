import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await login(formData);

            setMessage("Login Successful!");

        } catch {

            setMessage("Invalid Email or Password");

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-[#FFF8F0]">

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-xl p-10 w-[420px]"
            >

                <h1 className="text-4xl font-bold text-red-500 text-center mb-8">
                    Welcome Back 🌸
                </h1>

                <input
                    className="border w-full rounded-xl p-3 mb-4"
                    placeholder="Email"
                    type="email"
                    name="email"
                    onChange={handleChange}
                />

                <input
                    className="border w-full rounded-xl p-3 mb-6"
                    placeholder="Password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                />

                <button
                    className="bg-red-500 text-white w-full rounded-xl py-3"
                >
                    Login
                </button>

                <p className="text-center mt-5">
                    {message}
                </p>

            </form>

        </div>

    );

}

export default Login;