import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateProject from "./pages/CreateProject.jsx";
import Editor from "./pages/Editor.jsx";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/" />;
    return children;
}

function RedirectIfLoggedIn({ children }) {
    const token = localStorage.getItem("token");
    if (token) return <Navigate to="/dashboard" />;
    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
                <Route path="/signup" element={<RedirectIfLoggedIn><Signup /></RedirectIfLoggedIn>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
                <Route path="/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}
