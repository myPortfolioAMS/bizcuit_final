import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import BizcuitLogo from "../assets/Bizcuit-logo.png";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [validationErrors, setValidationErrors] = useState<{
        username?: string;
        password?: string;
    }>({});
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string()
            .email("Please enter a valid email address")
            .required("Username is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await validationSchema.validate(
                { username, password },
                { abortEarly: false }
            );
            setValidationErrors({});

            const response = await axios.post<{
                access_token: string;
                user: { id: string; username: string };
            }>("/auth/login", {
                username,
                password,
            });
            const { access_token, user } = response.data;

            localStorage.setItem("token", access_token);
            localStorage.setItem("userId", user.id);
            navigate(`/tasks`);
        } catch (err: any) {
            if (err.name === "ValidationError") {
                const errors: { [key: string]: string } = {};
                err.inner.forEach((validationError: Yup.ValidationError) => {
                    errors[validationError.path!] = validationError.message;
                });
                setValidationErrors(errors);
            } else {
                console.error(err.response?.data || err.message);
                setError(err.response?.data?.message || "Invalid credentials");
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 rounded-lg">
            <form
                onSubmit={handleLogin}
                className="space-y-8 bg-white p-6 rounded shadow-md"
            >
                <div className="flex justify-center mb-4">
                    <img
                        src={BizcuitLogo}
                        alt="Bizcuit Logo"
                        className="h-32 w-auto"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`block h-16 w-full p-2 bg-neutral-50 border rounded${
                            validationErrors.username ? "border-red-500" : ""
                        }`}
                    />
                    {validationErrors.username && (
                        <p className="text-red-500">
                            {validationErrors.username}
                        </p>
                    )}
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block h-16 w-full p-2 bg-neutral-50 border rounded${
                            validationErrors.password ? "border-red-500" : ""
                        }`}
                    />
                    {validationErrors.password && (
                        <p className="text-red-500">
                            {validationErrors.password}
                        </p>
                    )}
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    className="px-4 py-2 text-white  rounded"
                    style={{ backgroundColor: "#fc8404" }}
                    type="submit"
                >
                    Login
                </button>
                <Link
                    to="/register"
                    className="text-blue-500 hover:underline ml-auto pl-64"
                >
                    New User?
                </Link>
            </form>
        </div>
    );
}
