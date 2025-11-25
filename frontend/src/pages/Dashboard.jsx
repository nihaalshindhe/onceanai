import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const nav = useNavigate();
    const [projects, setProjects] = useState([]);

    const load = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/project/projects", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
        } catch {
            alert("Failed to load projects");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        nav("/");
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="min-h-screen w-screen flex flex-col items-center px-6 py-10"
             style={{ backgroundColor: "#DDD0C8" }}>

            <div className="w-full max-w-5xl flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold" style={{ color: "#323232" }}>
                    Your Dashboard
                </h1>

                <button
                    onClick={logout}
                    className="px-4 py-2 rounded-md text-sm font-medium"
                    style={{ backgroundColor: "#323232", color: "#DDD0C8" }}
                >
                    Logout
                </button>
            </div>

            <div className="w-full max-w-5xl">
                <button
                    onClick={() => nav("/create")}
                    className="px-6 py-3 rounded-md text-sm font-medium mb-8"
                    style={{ backgroundColor: "#323232", color: "#DDD0C8" }}
                >
                    Create New Project
                </button>

                <div className="space-y-4">
                    {projects.length === 0 && (
                        <p className="opacity-80" style={{ color: "#323232" }}>
                            No projects found.
                        </p>
                    )}

                    {projects.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => nav(`/editor/${p.id}`)}
                            className="p-5 rounded-md cursor-pointer transition-all"
                            style={{
                                backgroundColor: "white",
                                border: "1px solid #323232",
                                color: "#323232"
                            }}
                        >
                            <h3 className="text-xl font-semibold">{p.topic}</h3>
                            <p className="opacity-80 text-sm">Type: {p.doc_type}</p>
                        </div>
                    ))}
                </div>
            </div>

            <p className="mt-16 w-full max-w-2xl text-center text-sm opacity-70 leading-relaxed"
               style={{ color: "#323232" }}>
                This dashboard securely loads your saved projects using your authentication token.
                Each project is private to your account and can be reopened, edited, or expanded anytime.
            </p>
        </div>
    );
}
