import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import { getProfile } from "../services/profileService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => localStorage.getItem("user_email"));

    const register = async (data) => {
        return await registerUser(data);
    };

    const login = async (credentials) => {

        const response = await loginUser(credentials);

        localStorage.setItem("access", response.access);
        localStorage.setItem("refresh", response.refresh);

        localStorage.setItem("user_email", credentials.email);
        setUser(credentials.email);

        try {
            const profile = await getProfile();
            return { ...response, profile };
        } catch (error) {
            if (error.response?.status !== 404) console.error("Profile lookup after login failed:", error);
            return { ...response, profile: null };
        }
    };

    const logout = () => {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_email");

        setUser(null);

    };

    return (
        <AuthContext.Provider
            value={{
                user,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}
