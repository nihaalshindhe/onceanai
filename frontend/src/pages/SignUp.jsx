import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const nav = useNavigate();

    const register = async () => {
        if (!username || !password) return setError("Fill all fields");

        setLoading(true);
        setError("");

        try {
            await API.post("/auth/register", { username, password });

            const res = await API.post("/auth/login", { username, password });
            localStorage.setItem("token", res.data.token);

            nav("/dashboard");
        } catch (err) {
            const msg =
                err.response?.data?.detail?.[0]?.msg ||
                err.response?.data?.detail ||
                "Registration failed";

            setError(msg);


    } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center pt-10 px-6" style={{ backgroundColor: "#DDD0C8" }}>

            <div className="w-4/5 max-w-4xl text-center space-y-6 mb-12">
                <h1 className="text-3xl font-bold" style={{ color: "#323232" }}>
                    Create Your Account
                </h1>

                <p className="text-lg opacity-80 leading-relaxed mx-auto" style={{ color: "#323232" }}>
                    If you're seeing this page, it means you're a new user.
                    Once you enter your username and password, the system will create a new user in the database
                    and then automatically log you in with a secure JWT token.
                </p>
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold" style={{ color: "#323232" }}>
                        Sign Up
                    </h2>

                    <p className="mt-2 text-sm opacity-80" style={{ color: "#323232" }}>
                        Create your new account below
                    </p>

                    {error && (
                        <p className="text-red-600 text-sm mt-3">
                            {error}
                        </p>
                    )}
                </div>

                <div className="space-y-6">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="appearance-none block w-full px-3 py-4 rounded-md bg-white sm:text-sm"
                        style={{ color: "#323232", borderColor: "#323232", borderWidth: "1px" }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-4 rounded-md bg-white sm:text-sm"
                        style={{ color: "#323232", borderColor: "#323232", borderWidth: "1px" }}
                    />
                </div>

                <button
                    onClick={register}
                    disabled={loading}
                    className="w-full py-3 text-sm font-medium rounded-md disabled:opacity-50 transition-colors"
                    style={{ backgroundColor: "#323232", color: "#DDD0C8" }}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </div>
        </div>
    );
}
