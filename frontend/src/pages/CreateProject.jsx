import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id, section, onChange, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "12px",
        padding: "8px",
        background: "#fff",
        border: "1px solid #323232",
        borderRadius: "8px"
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div {...attributes} {...listeners} style={{ cursor: "grab", marginBottom: 8 }}>☰ Drag</div>
            <input
                type="text"
                placeholder="Section Title"
                value={section.title}
                onChange={(e) => onChange(id, "title", e.target.value)}
                className="px-4 py-2 rounded-md bg-white sm:text-sm"
                style={{ color: "#323232", borderColor: "#323232", borderWidth: "1px" }}
            />
            <textarea
                placeholder="Prompt / instructions"
                value={section.prompt}
                onChange={(e) => onChange(id, "prompt", e.target.value)}
                className="px-4 py-2 rounded-md bg-white sm:text-sm"
                style={{ color: "#323232", borderColor: "#323232", borderWidth: "1px", height: "80px" }}
            />
            <button
                onClick={() => onRemove(id)}
                className="px-3 py-2 rounded-md font-medium"
                style={{ backgroundColor: "#323232", color: "#DDD0C8" }}
            >
                Remove
            </button>
        </div>
    );
}

export default function CreateProject() {
    const nav = useNavigate();
    const [topic, setTopic] = useState("");
    const [docType, setDocType] = useState("");
    const [sections, setSections] = useState([{ id: 1, title: "", prompt: "" }]);
    const [loading, setLoading] = useState(false);

    const sensors = useSensors(useSensor(PointerSensor));

    const addSection = () => setSections([...sections, { id: Date.now(), title: "", prompt: "" }]);
    const removeSection = (id) => setSections(sections.filter((s) => s.id !== id));
    const updateSection = (id, field, value) =>
        setSections(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);
            setSections(arrayMove(sections, oldIndex, newIndex));
        }
    };

    const createAndDownload = async () => {
        if (!topic || !docType) return alert("Fill all fields");
        if (sections.some((s) => !s.title || !s.prompt)) return alert("Fill all section titles and prompts");

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await API.post(
                "/project/generate-doc",
                { topic, doc_type: docType, sections },
                { headers: { Authorization: token }, responseType: "blob" }
            );

            const blob = new Blob([res.data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${topic}.${docType}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            alert("Error generating document");
        } finally {
            setLoading(false);
            nav("/dashboard");
        }
    };

    return (
        <div className="min-h-screen w-screen flex flex-col items-center px-6 py-12" style={{ backgroundColor: "#DDD0C8" }}>
            <div className="w-full max-w-3xl text-center mb-12">
                <h1 className="text-3xl font-bold" style={{ color: "#323232" }}>Create a New Project</h1>
                <p className="text-lg opacity-80 leading-relaxed mt-4" style={{ color: "#323232" }}>
                    Enter your topic, choose a document type, and define sections with individual prompts.
                    <br/>
                    Drag and drop to reorder sections as needed this is achieved using the DnD Kit library.
                    once the type and topic is decided along with the sections, the create and download hits our backend endpoint to generate the document using AI.
                </p>
            </div>

            <div className="w-full max-w-2xl space-y-6">
                <input
                    type="text"
                    placeholder="Enter topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-4 rounded-md bg-white sm:text-sm"
                    style={{ color: "#323232", borderColor: "#323232", borderWidth: "1px" }}
                />

                <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-4 py-4 rounded-md bg-white sm:text-sm"
                    style={{ color: "#323232", borderColor: "#323232", borderWidth: "1px" }}
                >
                    <option value="">Select Document Type</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="pptx">PowerPoint (.pptx)</option>
                </select>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                        {sections.map((s) => (
                            <SortableItem key={s.id} id={s.id} section={s} onChange={updateSection} onRemove={removeSection} />
                        ))}
                    </SortableContext>
                </DndContext>

                <button
                    onClick={addSection}
                    className="px-4 py-2 rounded-md font-medium w-full"
                    style={{ backgroundColor: "#323232", color: "#DDD0C8" }}
                >
                    Add Section
                </button>

                <button
                    onClick={createAndDownload}
                    disabled={loading}
                    className="w-full py-3 rounded-md font-medium disabled:opacity-50"
                    style={{ backgroundColor: "#323232", color: "#DDD0C8" }}
                >
                    {loading ? "Generating..." : "Create & Download"}
                </button>
            </div>

            <p className="mt-16 w-full max-w-2xl text-center text-sm opacity-70 leading-relaxed" style={{ color: "#323232" }}>
                Your project is generated using AI and securely processed using your authentication token.
            </p>
        </div>
    );
}
