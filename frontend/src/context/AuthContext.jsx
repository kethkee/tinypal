import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const register = async (data) => {
        return await registerUser(data);
    };

    const login = async (credentials) => {

        const response = await loginUser(credentials);

        localStorage.setItem("access", response.access);
        localStorage.setItem("refresh", response.refresh);

        setUser(credentials.email);

        return response;
    };

    const logout = () => {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

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

export function useAuth() {
    return useContext(AuthContext);
}