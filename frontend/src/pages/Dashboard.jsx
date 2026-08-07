import { useAuth } from "../context/AuthContext";

function Dashboard() {

    const { user, logout } = useAuth();

    return (

        <div className="min-h-screen bg-[#FFF8F0]">

            <div className="flex justify-between items-center p-6 shadow bg-white">

                <h1 className="text-3xl font-bold text-red-500">
                    🌸 TinyPal
                </h1>

                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-5 py-2 rounded-xl"
                >
                    Logout
                </button>

            </div>

            <div className="max-w-6xl mx-auto mt-10">

                <h2 className="text-4xl font-bold mb-3">
                    Welcome Back 👋
                </h2>

                <p className="text-gray-600 mb-10">
                    {user}
                </p>

                <div className="grid grid-cols-3 gap-6">

                    <div className="bg-white rounded-3xl shadow-lg p-8">

                        <h3 className="font-bold text-xl mb-3">
                            🔥 Study Streak
                        </h3>

                        <p className="text-5xl font-bold text-red-500">
                            0
                        </p>

                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8">

                        <h3 className="font-bold text-xl mb-3">
                            ⭐ XP
                        </h3>

                        <p className="text-5xl font-bold text-red-500">
                            0
                        </p>

                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8">

                        <h3 className="font-bold text-xl mb-3">
                            📅 Today's Tasks
                        </h3>

                        <p className="text-5xl font-bold text-red-500">
                            0
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;