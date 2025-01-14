import { useState } from "react";
import axios from "../api/axios";
import axiosLib from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post<{
                message: string;
            }>("/auth/register", {
                username,
                password,
            });

            console.log("Registration message:", response.data.message);

            const login = await axios.post<{
                access_token: string;
            }>("/auth/login", {
                username,
                password,
            });

            const { access_token } = login.data;

            localStorage.setItem("token", access_token);
            navigate(`/tasks`);
        } catch (err: any) {
            if (axiosLib.isAxiosError(err)) {
                console.error(
                    "Error during registration or login:",
                    err.response?.data || err.message
                );
                setError(err.response?.data?.message || "Registration failed");
            } else {
                console.error("Unexpected error:", err);
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleRegister} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full p-2 border rounded"
                />
                {error && <p className="text-red-500">{error}</p>}
                <button
                    className="px-4 py-2 text-white bg-blue-500 rounded"
                    type="submit"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
