import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const login = async () => {
        setIsLoading(true);
        try {
            const res = await API.post("/auth/login", { username, password });
            localStorage.setItem("token", res.data.token);
            nav("/dashboard");
        } catch (err) {
            alert(err.response?.data?.detail || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login();
    };

    return (
        <div className="min-h-screen w-screen flex flex-col items-center pt-10 px-6" style={{backgroundColor: '#DDD0C8'}}>

            <div className="w-4/5 w-4xl text-center space-y-6 mb-12">
                <h1 className="text-3xl font-bold" style={{color:'#323232'}}>
                    Hi. Thanks for checking my assigment!
                </h1>

                <p className="text-lg opacity-80 leading-relaxed mx-auto" style={{color:'#323232'}}>
                    I use jwt for authentication which i saved in the local storage after login.
                    and the routing is decided using the react router.

                </p>
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold" style={{color: '#323232'}}>
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm opacity-80" style={{color: '#323232'}}>
                        Use your username and password to continue
                    </p>
                </div>

                <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <input
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-4 rounded-md bg-white sm:text-sm"
                            style={{color:'#323232', borderColor:'#323232', borderWidth:'1px'}}
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            type="password"
                            required
                            className="appearance-none block w-full px-3 py-4 rounded-md bg-white sm:text-sm"
                            style={{color:'#323232', borderColor:'#323232', borderWidth:'1px'}}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 text-sm font-medium rounded-md disabled:opacity-50 transition-colors"
                        style={{backgroundColor: '#323232', color: '#DDD0C8'}}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>

                    <div className="text-center">
                        <span className="text-sm" style={{color: '#323232'}}>
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium hover:underline underline-offset-2"
                                style={{color: '#323232'}}
                            >
                                Sign up
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}
