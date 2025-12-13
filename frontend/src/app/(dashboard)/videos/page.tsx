"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Video,
    Mic,
    Users,
    Play,
    Wand2,
    Download,
    Loader2,
    FileText,
} from "lucide-react";
import { videosApi } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/authStore";
import { useGenerationStore } from "@/lib/stores/generationStore";

type VideoType = "video" | "presenter" | "voiceover";

const videoTypes = [
    { id: "video", name: "Text to Video", icon: Video, credits: 50, desc: "Generate video from text" },
    { id: "presenter", name: "AI Presenter", icon: Users, credits: 100, desc: "Video with AI avatar" },
    { id: "voiceover", name: "Voiceover", icon: Mic, credits: 10, desc: "Text-to-speech audio" },
];

const voices = [
    { id: "alloy", name: "Alloy", accent: "American", gender: "Neutral" },
    { id: "echo", name: "Echo", accent: "American", gender: "Female" },
    { id: "fable", name: "Fable", accent: "British", gender: "Female" },
    { id: "onyx", name: "Onyx", accent: "American", gender: "Male" },
    { id: "nova", name: "Nova", accent: "American", gender: "Female" },
    { id: "shimmer", name: "Shimmer", accent: "American", gender: "Female" },
];

const avatars = [
    { id: "avatar_1", name: "Professional Male", style: "Business Attire" },
    { id: "avatar_2", name: "Professional Female", style: "Business Attire" },
    { id: "avatar_3", name: "Casual Male", style: "Casual Wear" },
    { id: "avatar_4", name: "Casual Female", style: "Casual Wear" },
];

const backgrounds = [
    { id: "studio", name: "Modern Studio" },
    { id: "office", name: "Office" },
    { id: "gradient", name: "Gradient" },
    { id: "nature", name: "Nature" },
];

export default function VideosPage() {
    const { user, updateCredits } = useAuthStore();
    const { addGeneration, setGenerating, isGenerating } = useGenerationStore();

    const [activeType, setActiveType] = useState<VideoType>("video");
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [topic, setTopic] = useState("");
    const [script, setScript] = useState("");
    const [duration, setDuration] = useState(30);
    const [voice, setVoice] = useState("alloy");
    const [avatar, setAvatar] = useState("avatar_1");
    const [background, setBackground] = useState("studio");
    const [text, setText] = useState("");
    const [speed, setSpeed] = useState(1.0);

    const handleGenerate = async () => {
        setError(null);
        setResult(null);
        setGenerating(true);

        try {
            let response;

            switch (activeType) {
                case "video":
                    response = await videosApi.generate({ topic, script, duration, voice });
                    break;
                case "presenter":
                    response = await videosApi.generatePresenter({
                        script,
                        avatar_id: avatar,
                        background,
                        voice_id: voice,
                    });
                    break;
                case "voiceover":
                    response = await videosApi.generateVoiceover({ text, voice, speed });
                    break;
            }

            if (response?.data) {
                setResult(response.data.output_url);
                addGeneration(response.data);

                if (user) {
                    updateCredits(user.credits - response.data.credits_used);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Generation failed. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const getActiveTypeInfo = () => videoTypes.find((t) => t.id === activeType)!;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Video Generation</h1>
                <p className="text-muted">Create professional videos with AI</p>
            </div>

            {/* Type Selector */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                {videoTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setActiveType(type.id as VideoType)}
                        className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition ${activeType === type.id
                                ? "border-violet-500 bg-violet-500/10"
                                : "border-white/10 bg-white/5 hover:border-white/20"
                            }`}
                    >
                        <type.icon
                            className={`w-8 h-8 ${activeType === type.id ? "text-violet-400" : "text-muted"
                                }`}
                        />
                        <span className="font-medium">{type.name}</span>
                        <span className="text-xs text-muted">{type.desc}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                            {type.credits} credits
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-violet-400" />
                        {getActiveTypeInfo().name} Settings
                    </h2>

                    <div className="space-y-5">
                        {/* Text to Video Form */}
                        {activeType === "video" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Topic</label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                                        placeholder="What is your video about?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Script (optional)
                                    </label>
                                    <textarea
                                        value={script}
                                        onChange={(e) => setScript(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none resize-none"
                                        placeholder="Leave empty to auto-generate, or write your own script..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Duration: {duration}s
                                    </label>
                                    <input
                                        type="range"
                                        min={15}
                                        max={60}
                                        step={15}
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-muted">
                                        <span>15s</span>
                                        <span>30s</span>
                                        <span>45s</span>
                                        <span>60s</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Voice</label>
                                    <select
                                        value={voice}
                                        onChange={(e) => setVoice(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                                    >
                                        {voices.map((v) => (
                                            <option key={v.id} value={v.id}>
                                                {v.name} ({v.gender}, {v.accent})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* AI Presenter Form */}
                        {activeType === "presenter" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Script</label>
                                    <textarea
                                        value={script}
                                        onChange={(e) => setScript(e.target.value)}
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none resize-none"
                                        placeholder="Write what you want the presenter to say..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Avatar</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {avatars.map((a) => (
                                            <button
                                                key={a.id}
                                                onClick={() => setAvatar(a.id)}
                                                className={`p-4 rounded-xl border transition text-left ${avatar === a.id
                                                        ? "border-violet-500 bg-violet-500/10"
                                                        : "border-white/10 bg-white/5"
                                                    }`}
                                            >
                                                <div className="font-medium text-sm">{a.name}</div>
                                                <div className="text-xs text-muted">{a.style}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Background</label>
                                    <select
                                        value={background}
                                        onChange={(e) => setBackground(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                                    >
                                        {backgrounds.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Voice</label>
                                    <select
                                        value={voice}
                                        onChange={(e) => setVoice(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                                    >
                                        {voices.map((v) => (
                                            <option key={v.id} value={v.id}>
                                                {v.name} ({v.gender}, {v.accent})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Voiceover Form */}
                        {activeType === "voiceover" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Text</label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none resize-none"
                                        placeholder="Enter the text you want to convert to speech..."
                                    />
                                    <div className="flex justify-between text-xs text-muted mt-2">
                                        <span>{text.length} characters</span>
                                        <span>~{Math.ceil(text.length / 150)} seconds</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Voice</label>
                                    <select
                                        value={voice}
                                        onChange={(e) => setVoice(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                                    >
                                        {voices.map((v) => (
                                            <option key={v.id} value={v.id}>
                                                {v.name} ({v.gender}, {v.accent})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Speed: {speed.toFixed(1)}x
                                    </label>
                                    <input
                                        type="range"
                                        min={0.5}
                                        max={2.0}
                                        step={0.1}
                                        value={speed}
                                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-muted">
                                        <span>0.5x</span>
                                        <span>1.0x</span>
                                        <span>1.5x</span>
                                        <span>2.0x</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="btn-primary w-full justify-center"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5" />
                                    Generate ({getActiveTypeInfo().credits} credits)
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-6">Preview</h2>

                    <div className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        {isGenerating ? (
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 animate-spin text-violet-400 mx-auto mb-4" />
                                <p className="text-muted">Creating your video...</p>
                                <p className="text-xs text-muted mt-2">This may take a few minutes</p>
                            </div>
                        ) : result ? (
                            activeType === "voiceover" ? (
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                                        <Mic className="w-10 h-10 text-violet-400" />
                                    </div>
                                    <p className="font-medium mb-4">Audio Generated!</p>
                                    <audio controls src={result} className="w-full" />
                                </div>
                            ) : (
                                <video
                                    src={result}
                                    controls
                                    className="w-full h-full object-contain"
                                />
                            )
                        ) : (
                            <div className="text-center text-muted">
                                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Your generated content will appear here</p>
                            </div>
                        )}
                    </div>

                    {result && (
                        <div className="flex gap-3 mt-4">
                            <a
                                href={result}
                                download
                                className="btn-primary flex-1 justify-center"
                            >
                                <Download className="w-5 h-5" />
                                Download
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
