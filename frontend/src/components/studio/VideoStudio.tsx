"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Layout,
    Type,
    Image as ImageIcon,
    Music,
    Users,
    Play,
    Download,
    Settings,
    Plus,
    Trash2,
    Save,
    Undo,
    Redo,
    MonitorPlay
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";

// Types
type Scene = {
    id: string;
    script: string;
    avatar: string;
    voice: string;
    background: string;
    duration: number;
};

const MOCK_AVATARS = [
    { id: "anna_business", name: "Anna (Business)", img: "/avatars/anna.jpg" },
    { id: "mark_casual", name: "Mark (Casual)", img: "/avatars/mark.jpg" },
    { id: "sarah_news", name: "Sarah (News)", img: "/avatars/sarah.jpg" },
];

const MOCK_BACKGROUNDS = [
    { id: "studio_ws", name: "White Studio", color: "#ffffff" },
    { id: "studio_dark", name: "Dark Studio", color: "#1a1a1a" },
    { id: "office_blur", name: "Office Blur", color: "#2d3748" },
];

export default function VideoStudio() {
    const { user } = useAuthStore();
    const [scenes, setScenes] = useState<Scene[]>([
        {
            id: "1",
            script: "Welcome to our new AI video platform. This is a self-hosted solution.",
            avatar: "anna_business",
            voice: "en_us_female_1",
            background: "studio_ws",
            duration: 5,
        },
    ]);
    const [activeSceneId, setActiveSceneId] = useState("1");
    const [isPlaying, setIsPlaying] = useState(false);

    const activeScene = scenes.find((s) => s.id === activeSceneId) || scenes[0];

    const updateScene = (id: string, updates: Partial<Scene>) => {
        setScenes(scenes.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    };

    const addScene = () => {
        const newId = (scenes.length + 1).toString();
        setScenes([
            ...scenes,
            {
                id: newId,
                script: "",
                avatar: activeScene.avatar,
                voice: activeScene.voice,
                background: activeScene.background,
                duration: 5,
            },
        ]);
        setActiveSceneId(newId);
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* 1. Sidebar Assets */}
            <div className="w-20 flex flex-col items-center py-6 gap-6 bg-black/40 border-r border-white/10">
                <ToolButton icon={Users} label="Avatars" active />
                <ToolButton icon={Type} label="Text" />
                <ToolButton icon={ImageIcon} label="Media" />
                <ToolButton icon={Music} label="Audio" />
                <div className="flex-1" />
                <ToolButton icon={Settings} label="Settings" />
            </div>

            {/* 2. Asset Browser (Slide-out panel could go here, simplified for now) */}
            <div className="w-80 bg-neutral-900/50 border-r border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-violet-400" />
                        Select Avatar
                    </h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto flex-1">
                    {MOCK_AVATARS.map((avatar) => (
                        <button
                            key={avatar.id}
                            onClick={() => updateScene(activeSceneId, { avatar: avatar.id })}
                            className={`p-2 rounded-xl border transition text-left group ${activeScene.avatar === avatar.id
                                    ? "border-violet-500 bg-violet-500/10"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                }`}
                        >
                            <div className="aspect-square rounded-lg bg-neutral-800 mb-2 overflow-hidden relative">
                                {/* Placeholder for Avatar Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-muted">
                                    {avatar.id.split("_")[0]}
                                </div>
                            </div>
                            <span className="text-sm font-medium truncate block">{avatar.name}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10 bg-neutral-900">
                     <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                         <Layout className="w-4 h-4 text-violet-400" />
                         Background
                     </h3>
                     <div className="flex gap-2">
                         {MOCK_BACKGROUNDS.map(bg => (
                             <button
                                key={bg.id}
                                onClick={() => updateScene(activeSceneId, { background: bg.id })}
                                className={`w-8 h-8 rounded-full border-2 transition ${
                                    activeScene.background === bg.id ? "border-violet-500 scale-110" : "border-white/20"
                                }`}
                                style={{ backgroundColor: bg.color }}
                                title={bg.name}
                             />
                         ))}
                     </div>
                </div>
            </div>

            {/* 3. Main Stage & Timeline */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-neutral-900">
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition">
                            <Undo className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition">
                            <Redo className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="font-semibold">Untitled Project</h1>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-muted">Draft</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition">
                            <Save className="w-5 h-5" />
                        </button>
                        <button className="btn-primary flex items-center gap-2 px-4 py-1.5 text-sm">
                            <Download className="w-4 h-4" />
                            Export Video
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-[#050505] relative flex items-center justify-center p-8 overflow-hidden">
                    <div className="aspect-video w-full max-w-4xl bg-[#111] rounded-xl shadow-2xl border border-white/5 relative overflow-hidden group">
                        {/* Simulation of the Video Output */}
                        <div 
                            className="absolute inset-0 flex items-center justify-center transition-colors duration-500"
                            style={{ 
                                backgroundColor: MOCK_BACKGROUNDS.find(b => b.id === activeScene.background)?.color 
                            }}
                        >
                             <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 animate-pulse flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                                    {activeScene.avatar.charAt(0).toUpperCase()}
                                </div>
                                <div className="max-w-md text-center p-4 bg-black/50 backdrop-blur-md rounded-xl border border-white/10">
                                    <p className="text-lg font-medium text-white/90">
                                        "{activeScene.script || "..."}"
                                    </p>
                                </div>
                             </div>
                        </div>

                        {/* Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline & script */}
                <div className="h-48 border-t border-white/10 bg-neutral-900/50 flex flex-col">
                    <div className="flex-1 flex min-w-0">
                        {/* Script Editor */}
                        <div className="w-1/2 p-4 border-r border-white/10 flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center justify-between">
                                <span>Analysis Script</span>
                                <span className="text-emerald-400">{activeScene.script.length} chars</span>
                            </label>
                            <textarea
                                value={activeScene.script}
                                onChange={(e) => updateScene(activeSceneId, { script: e.target.value })}
                                className="flex-1 bg-transparent resize-none focus:outline-none text-lg leading-relaxed font-light"
                                placeholder="Type what you want the avatar to say..."
                            />
                        </div>

                        {/* Timeline Visualization */}
                        <div className="w-1/2 p-4 flex flex-col gap-3 overflow-x-auto">
                            <div className="flex items-center justify-between text-xs text-muted mb-1">
                                <span>Scene Timeline</span>
                                <button 
                                    onClick={addScene}
                                    className="flex items-center gap-1 hover:text-violet-400 transition"
                                >
                                    <Plus className="w-3 h-3" /> Add Scene
                                </button>
                            </div>
                            <div className="flex gap-2 h-full items-center">
                                {scenes.map((scene, idx) => (
                                    <button
                                        key={scene.id}
                                        onClick={() => setActiveSceneId(scene.id)}
                                        className={`h-20 min-w-[120px] rounded-xl border transition relative flex flex-col items-center justify-center p-2 group ${
                                            activeSceneId === scene.id
                                                ? "border-violet-500 bg-violet-500/10 ring-1 ring-violet-500/50"
                                                : "border-white/10 bg-white/5 hover:bg-white/10"
                                        }`}
                                    >
                                        <span className="text-xs font-medium text-white/50 absolute top-2 left-2">
                                            {idx + 1}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/50 to-cyan-500/50 mb-1" />
                                        <span className="text-[10px] text-muted truncate max-w-full px-2">
                                            {scene.script.slice(0, 15) || "Empty"}...
                                        </span>
                                        
                                        {scenes.length > 1 && (
                                            <div 
                                                onClick={(e) => { e.stopPropagation(); /* Delete logic needed */ }}
                                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400 transition"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                                <button
                                    onClick={addScene}
                                    className="h-20 w-12 rounded-xl border border-white/5 border-dashed flex items-center justify-center text-muted hover:text-white hover:border-white/20 transition"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Playback Controls */}
                    <div className="h-12 border-t border-white/5 flex items-center justify-center gap-4 bg-neutral-900">
                        <button className="p-2 hover:bg-white/5 rounded-full transition text-muted hover:text-white">
                            <MonitorPlay className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition"
                        >
                            {isPlaying ? (
                                <div className="w-3 h-3 bg-black rounded-[2px]" />
                            ) : (
                                <Play className="w-3 h-3 fill-current translate-x-0.5" />
                            )}
                        </button>
                        <span className="text-xs font-mono text-muted">00:00 / 00:15</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolButton({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <button className={`flex flex-col items-center gap-1 group relative ${
            active ? "text-violet-400" : "text-muted hover:text-white"
        }`}>
            <div className={`p-3 rounded-xl transition ${
                active ? "bg-violet-500/10" : "bg-transparent group-hover:bg-white/5"
            }`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium">{label}</span>
            {active && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-500 rounded-r-full" />
            )}
        </button>
    );
}
