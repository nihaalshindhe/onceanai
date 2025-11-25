import { useEffect, useState } from "react";
import API from "../api";
import { useParams } from "react-router-dom";

export default function Editor() {
    const { id } = useParams();
    const [sections, setSections] = useState([]);
    const [selected, setSelected] = useState(null);
    const [text, setText] = useState("");
    const [refinePrompt, setRefinePrompt] = useState("");
    const [refinedText, setRefinedText] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const load = async () => {
        try {
            const res = await API.get(`/project/sections/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const sorted = res.data.sort((a, b) => a.id - b.id);
            setSections(sorted);
        } catch {
            alert("Failed to load sections");
        }
    };

    const refine = async () => {
        if (!refinePrompt) return;
        setLoading(true);
        try {
            const res = await API.post(
                "/project/refine",
                { section_id: selected.id, prompt: refinePrompt },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRefinedText(res.data.updated_content);
        } catch {
            alert("Refinement failed");
        } finally {
            setLoading(false);
        }
    };

    const approveRefinement = async (docType) => {
        try {
            const res = await API.post(
                "/project/refine/approve",
                { section_id: selected.id, doc_type: docType },
                { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
            );
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${selected.title}-refined.${docType}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setText(refinedText);
            setRefinedText("");
            setRefinePrompt("");
            load();
        } catch {
            alert("Failed to approve/download refinement");
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div
            style={{
                display: "flex",
                gap: 40,
                padding: 40,
                minHeight: "100vh",
                background: "#DDD0C8",
                color: "#323232"
            }}
        >
            <div
                style={{
                    width: 260,
                    background: "#fff",
                    borderRadius: 10,
                    padding: 20,
                    border: "1px solid #323232"
                }}
            >
                <h3 style={{ color: "#323232", marginBottom: 20, fontWeight: 700 }}>Sections</h3>
                {sections.map((s) => (
                    <div
                        key={s.id}
                        onClick={() => {
                            setSelected(s);
                            setText(s.content);
                            setRefinedText("");
                            setRefinePrompt("");
                        }}
                        style={{
                            padding: 12,
                            borderRadius: 10,
                            marginBottom: 10,
                            cursor: "pointer",
                            background: selected?.id === s.id ? "#323232" : "#f9f5f0",
                            color: selected?.id === s.id ? "#DDD0C8" : "#323232",
                            fontWeight: 500,
                            transition: "0.2s"
                        }}
                    >
                        {s.title}
                    </div>
                ))}
            </div>

            {selected && (
                <div style={{ flex: 1 }}>
                    <h2 style={{ color: "#323232", fontWeight: 700 }}>{selected.title}</h2>

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 10,
                            padding: 20,
                            marginTop: 20,
                            marginBottom: 20,
                            minHeight: 220,
                            border: "1px solid #323232",
                            whiteSpace: "pre-wrap"
                        }}
                    >
                        {text}
                    </div>

                    <textarea
                        value={refinePrompt}
                        onChange={(e) => setRefinePrompt(e.target.value)}
                        style={{
                            width: "100%",
                            height: 120,
                            padding: 12,
                            fontSize: 16,
                            borderRadius: 10,
                            border: "1px solid #323232",
                            outline: "none",
                            background: "#fff",
                            color: "#323232",
                            marginBottom: 15
                        }}
                        placeholder="Enter refinement instructions..."
                        disabled={loading}
                    />

                    <button
                        onClick={refine}
                        disabled={loading || !refinePrompt}
                        style={{
                            padding: "10px 22px",
                            borderRadius: 8,
                            background: "#323232",
                            color: "#DDD0C8",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 700,
                            marginRight: 12,
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? "Refining..." : "Refine with AI"}
                    </button>

                    {refinedText && (
                        <div style={{ marginTop: 40 }}>
                            <h3 style={{ color: "#323232", marginBottom: 10 }}>Refined Preview</h3>

                            <div
                                style={{
                                    background: "#f9f5f0",
                                    borderRadius: 10,
                                    padding: 20,
                                    minHeight: 200,
                                    whiteSpace: "pre-wrap",
                                    border: "1px solid #323232",
                                    color: "#323232"
                                }}
                            >
                                {refinedText}
                            </div>

                            <button
                                onClick={() => approveRefinement("docx")}
                                style={{
                                    padding: "10px 20px",
                                    marginTop: 15,
                                    borderRadius: 8,
                                    background: "#323232",
                                    color: "#DDD0C8",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                    marginRight: 12
                                }}
                            >
                                Approve & Download DOCX
                            </button>

                            <button
                                onClick={() => approveRefinement("pptx")}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: 8,
                                    background: "#323232",
                                    color: "#DDD0C8",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: 700
                                }}
                            >
                                Approve & Download PPTX
                            </button>
                        </div>
                    )}
                    <div style={{ marginTop: 40, padding: 20, fontSize: 14, color: "#323232", opacity: 0.8 }}>
                        <p>
                            The Refine with AI button sends your prompt and the selected
                            section content to our backend endpoint. The AI generates an
                            improved version, which appears above for review. If you approve it, the updated content
                            replaces the original and the refined file is downloaded automatically.
                        </p>
                    </div>

                </div>
            )}

        </div>
    );
}
