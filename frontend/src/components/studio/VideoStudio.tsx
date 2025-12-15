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
    MonitorPlay,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { cn } from "@/lib/utils";

// Types
type Scene = {
    id: string;
    script: string;
    avatar: string;
    voice: string;
    background: string;
    duration: number;
};

type DrawerTab = "avatars" | "text" | "media" | "audio" | "settings";

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

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<DrawerTab>("avatars");

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

    const handleTabClick = (tab: DrawerTab) => {
        if (activeTab === tab) {
            setIsDrawerOpen(!isDrawerOpen);
        } else {
            setActiveTab(tab);
            setIsDrawerOpen(true);
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-[#09090b] rounded-2xl overflow-hidden border border-white/5 shadow-2xl font-sans">
            {/* 1. Sidebar Assets */}
            <div className="w-16 flex flex-col items-center py-4 gap-4 bg-black/40 border-r border-white/5 z-20">
                <ToolButton
                    icon={Users}
                    label="Avatars"
                    active={activeTab === "avatars" && isDrawerOpen}
                    onClick={() => handleTabClick("avatars")}
                />
                <ToolButton
                    icon={Type}
                    label="Text"
                    active={activeTab === "text" && isDrawerOpen}
                    onClick={() => handleTabClick("text")}
                />
                <ToolButton
                    icon={ImageIcon}
                    label="Media"
                    active={activeTab === "media" && isDrawerOpen}
                    onClick={() => handleTabClick("media")}
                />
                <ToolButton
                    icon={Music}
                    label="Audio"
                    active={activeTab === "audio" && isDrawerOpen}
                    onClick={() => handleTabClick("audio")}
                />
                <div className="flex-1" />
                <button
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className="p-3 text-muted hover:text-white transition-colors"
                >
                    {isDrawerOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                </button>
            </div>

            {/* 2. Asset Browser (Collapsible Drawer) */}
            <AnimatePresence initial={false} mode="wait">
                {isDrawerOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-[#0c0c0e] border-r border-white/5 flex flex-col z-10 overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                            <h2 className="font-semibold text-sm flex items-center gap-2 text-white/90">
                                {activeTab === "avatars" && <Users className="w-4 h-4 text-violet-400" />}
                                {activeTab === "text" && <Type className="w-4 h-4 text-violet-400" />}
                                {activeTab === "media" && <ImageIcon className="w-4 h-4 text-violet-400" />}
                                {activeTab === "audio" && <Music className="w-4 h-4 text-violet-400" />}
                                <span className="capitalize">{activeTab}</span>
                            </h2>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-1 hover:bg-white/5 rounded-md text-muted hover:text-white transition"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {activeTab === "avatars" && (
                                <div className="p-4 grid grid-cols-2 gap-3">
                                    {MOCK_AVATARS.map((avatar) => (
                                        <button
                                            key={avatar.id}
                                            onClick={() => updateScene(activeSceneId, { avatar: avatar.id })}
                                            className={cn(
                                                "p-2 rounded-xl border transition-all text-left group relative overflow-hidden",
                                                activeScene.avatar === avatar.id
                                                    ? "border-violet-500/50 bg-violet-500/10 shadow-[0_0_15px_-5px_rgba(139,92,246,0.5)]"
                                                    : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                                            )}
                                        >
                                            <div className="aspect-square rounded-lg bg-neutral-800 mb-2 overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 mix-blend-overlay" />
                                                <div className="absolute inset-0 flex items-center justify-center text-xs text-white/40 font-medium">
                                                    {avatar.id.split("_")[0]}
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-white/80 truncate block group-hover:text-white transition-colors">
                                                {avatar.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Placeholder for other tabs */}
                            {activeTab !== "avatars" && (
                                <div className="p-8 text-center text-muted text-sm">
                                    <p>Select {activeTab} options here.</p>
                                </div>
                            )}

                            {activeTab === "avatars" && (
                                <div className="p-4 border-t border-white/5 bg-black/20">
                                    <h3 className="font-semibold text-xs mb-3 flex items-center gap-2 text-muted uppercase tracking-wider">
                                        Background
                                    </h3>
                                    <div className="flex gap-2">
                                        {MOCK_BACKGROUNDS.map(bg => (
                                            <button
                                                key={bg.id}
                                                onClick={() => updateScene(activeSceneId, { background: bg.id })}
                                                className={cn(
                                                    "w-8 h-8 rounded-full border-2 transition-all shadow-lg",
                                                    activeScene.background === bg.id
                                                        ? "border-violet-500 scale-110 ring-2 ring-violet-500/20"
                                                        : "border-white/10 hover:scale-105"
                                                )}
                                                style={{ backgroundColor: bg.color }}
                                                title={bg.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. Main Stage & Timeline */}
            <div className="flex-1 flex flex-col min-w-0 bg-black/20">
                {/* Toolbar */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#09090b]/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition">
                            <Undo className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition">
                            <Redo className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="font-medium text-sm text-white/90">Untitled Project</h1>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted border border-white/5">Draft</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition">
                            <Save className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium bg-white text-black rounded-lg hover:bg-neutral-200 transition">
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-hidden relative flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] to-black">
                    <motion.div
                        layout
                        className="aspect-video w-full max-w-4xl bg-black rounded-xl shadow-2xl border border-white/10 relative overflow-hidden group"
                    >
                        {/* Simulation of the Video Output */}
                        <div
                            className="absolute inset-0 flex items-center justify-center transition-colors duration-700"
                            style={{
                                backgroundColor: MOCK_BACKGROUNDS.find(b => b.id === activeScene.background)?.color
                            }}
                        >
                            <div className="flex flex-col items-center gap-6">
                                <motion.div
                                    key={activeScene.avatar}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-40 h-40 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] flex items-center justify-center text-5xl font-bold text-white relative z-10"
                                >
                                    {activeScene.avatar.charAt(0).toUpperCase()}

                                    {/* Speaking Ripple Effect */}
                                    {isPlaying && (
                                        <>
                                            <span className="absolute inset-0 rounded-full border border-white/30 animate-ping" />
                                            <span className="absolute inset-0 rounded-full border border-white/20 animate-ping delay-75" />
                                        </>
                                    )}
                                </motion.div>

                                <motion.div
                                    layoutId="caption-box"
                                    className="max-w-xl text-center p-6 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
                                >
                                    <p className="text-xl font-medium text-white/90 leading-relaxed">
                                        "{activeScene.script || "..."}"
                                    </p>
                                </motion.div>
                            </div>
                        </div>

                        {/* Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition duration-300"
                            >
                                {isPlaying ? (
                                    <div className="w-6 h-6 bg-white rounded-sm" />
                                ) : (
                                    <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Timeline & script */}
                <div className="h-56 border-t border-white/5 bg-[#0c0c0e] flex flex-col z-10">
                    <div className="flex-1 flex min-w-0">
                        {/* Script Editor */}
                        <div className="w-1/3 p-5 border-r border-white/5 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted uppercase tracking-wider">Script</span>
                                <span className="text-[10px] font-mono text-zinc-500">{activeScene.script.length} chars</span>
                            </div>
                            <textarea
                                value={activeScene.script}
                                onChange={(e) => updateScene(activeSceneId, { script: e.target.value })}
                                className="flex-1 bg-transparent resize-none focus:outline-none text-base text-white/80 leading-relaxed font-light placeholder:text-zinc-600 custom-scrollbar"
                                placeholder="Type your script here..."
                            />
                        </div>

                        {/* Timeline Visualization */}
                        <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted uppercase tracking-wider">Timeline</span>
                                <button
                                    onClick={addScene}
                                    className="text-[10px] flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 transition"
                                >
                                    <Plus className="w-3 h-3" /> Add Scene
                                </button>
                            </div>
                            <div className="flex gap-3 h-full items-center overflow-x-auto custom-scrollbar pb-2">
                                {scenes.map((scene, idx) => (
                                    <button
                                        key={scene.id}
                                        onClick={() => setActiveSceneId(scene.id)}
                                        className={cn(
                                            "h-24 min-w-[140px] rounded-xl border transition-all relative flex flex-col items-center justify-center p-3 gap-2 group",
                                            activeSceneId === scene.id
                                                ? "border-violet-500/50 bg-violet-500/5 ring-1 ring-violet-500/20"
                                                : "border-white/5 bg-white/5 hover:bg-white/10"
                                        )}
                                    >
                                        <span className="absolute top-2 left-2 text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 transition">
                                            {idx + 1}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/40 to-indigo-500/40 shadow-inner" />
                                        <div className="w-full">
                                            <p className="text-[10px] text-zinc-400 truncate w-full text-center">
                                                {scene.script || "No script"}
                                            </p>
                                            <div className="text-[9px] text-zinc-600 text-center mt-0.5">
                                                {scene.duration}s
                                            </div>
                                        </div>

                                        {scenes.length > 1 && (
                                            <div
                                                onClick={(e) => { e.stopPropagation(); /* Delete logic */ }}
                                                className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 rounded-md text-red-400 hover:text-red-300 transition"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                                <button
                                    onClick={addScene}
                                    className="h-24 min-w-[60px] rounded-xl border border-white/5 border-dashed flex flex-col items-center justify-center gap-1 text-zinc-600 hover:text-zinc-300 hover:border-white/20 transition-all hover:bg-white/5"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="h-10 border-t border-white/5 flex items-center justify-center gap-6 bg-[#09090b]">
                        <button className="text-zinc-500 hover:text-white transition">
                            <MonitorPlay className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-zinc-500">00:00</span>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="hover:scale-110 transition duration-200"
                            >
                                {isPlaying ? (
                                    <div className="w-4 h-4 bg-white rounded-[1px]" />
                                ) : (
                                    <Play className="w-4 h-4 text-white fill-current" />
                                )}
                            </button>
                            <span className="text-[10px] font-mono text-zinc-500">00:15</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolButton({
    icon: Icon,
    label,
    active,
    onClick
}: {
    icon: any,
    label: string,
    active?: boolean,
    onClick?: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-1.5 group relative w-full px-2 transition-all duration-300",
                active ? "text-violet-400" : "text-zinc-500 hover:text-zinc-300"
            )}
        >
            <div className={cn(
                "p-2.5 rounded-xl transition-all duration-300 relative",
                active
                    ? "bg-violet-500/10 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
                    : "bg-transparent group-hover:bg-white/5"
            )}>
                <Icon className={cn("w-5 h-5 transition-transform duration-300", active && "scale-110")} />
                {active && (
                    <span className="absolute inset-0 rounded-xl bg-violet-400/20 blur-lg animate-pulse" />
                )}
            </div>
            <span className="text-[9px] font-medium tracking-wide opacity-80">{label}</span>

            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-violet-500 rounded-r-full shadow-[0_0_10px_2px_rgba(139,92,246,0.5)]"
                />
            )}
        </button>
    );
}
