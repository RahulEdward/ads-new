"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Image,
    Palette,
    Sparkles,
    Layers,
    Wand2,
    Download,
    Loader2,
    ChevronDown,
    Copy,
    ExternalLink,
} from "lucide-react";
import { imagesApi } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/authStore";
import { useGenerationStore } from "@/lib/stores/generationStore";

type GenerationType = "image" | "banner" | "logo" | "remove-bg";

const generationTypes = [
    { id: "image", name: "General Image", icon: Image, credits: 5 },
    { id: "banner", name: "Banner", icon: Palette, credits: 5 },
    { id: "logo", name: "Logo", icon: Sparkles, credits: 5 },
    { id: "remove-bg", name: "Remove Background", icon: Layers, credits: 2 },
];

const platforms = [
    { id: "youtube", name: "YouTube (1280×720)", size: "1280x720" },
    { id: "facebook", name: "Facebook (1200×630)", size: "1200x630" },
    { id: "instagram", name: "Instagram (1080×1080)", size: "1080x1080" },
    { id: "twitter", name: "Twitter (1500×500)", size: "1500x500" },
    { id: "linkedin", name: "LinkedIn (1584×396)", size: "1584x396" },
];

const styles = [
    { id: "minimal", name: "Minimal" },
    { id: "bold", name: "Bold" },
    { id: "playful", name: "Playful" },
    { id: "corporate", name: "Corporate" },
    { id: "modern", name: "Modern" },
];

const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "E-commerce",
    "Food & Beverage",
    "Real Estate",
    "Entertainment",
    "Fashion",
    "Travel",
];

export default function ImagesPage() {
    const { user, updateCredits } = useAuthStore();
    const { addGeneration, setGenerating, isGenerating } = useGenerationStore();

    const [activeType, setActiveType] = useState<GenerationType>("image");
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [prompt, setPrompt] = useState("");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [brandName, setBrandName] = useState("");
    const [industry, setIndustry] = useState("Technology");
    const [platform, setPlatform] = useState("youtube");
    const [style, setStyle] = useState("modern");
    const [imageUrl, setImageUrl] = useState("");

    const handleGenerate = async () => {
        setError(null);
        setResult(null);
        setGenerating(true);

        try {
            let response;

            switch (activeType) {
                case "image":
                    response = await imagesApi.generate({ prompt, style });
                    break;
                case "banner":
                    response = await imagesApi.generateBanner({ title, subtitle, platform, style });
                    break;
                case "logo":
                    response = await imagesApi.generateLogo({ brand_name: brandName, industry, style });
                    break;
                case "remove-bg":
                    response = await imagesApi.removeBackground({ image_url: imageUrl });
                    break;
            }

            if (response?.data) {
                setResult(response.data.output_url);
                addGeneration(response.data);

                // Update credits
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

    const getActiveTypeInfo = () => generationTypes.find((t) => t.id === activeType)!;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Image Generation</h1>
                <p className="text-muted">Create stunning visuals with AI</p>
            </div>

            {/* Type Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {generationTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setActiveType(type.id as GenerationType)}
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
                        <span className="text-xs text-muted">{type.credits} credits</span>
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
                        {/* General Image Form */}
                        {activeType === "image" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Describe your image
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none resize-none"
                                        placeholder="A futuristic city at sunset with flying cars..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Style</label>
                                    <select
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 focus:border-violet-500 focus:outline-none text-white"
                                    >
                                        {styles.map((s) => (
                                            <option key={s.id} value={s.id} className="bg-neutral-900 text-white">
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Banner Form */}
                        {activeType === "banner" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                                        placeholder="Your banner title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Subtitle (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                                        placeholder="Optional tagline..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Platform</label>
                                    <select
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 focus:border-violet-500 focus:outline-none text-white"
                                    >
                                        {platforms.map((p) => (
                                            <option key={p.id} value={p.id} className="bg-neutral-900 text-white">
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Style</label>
                                    <select
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 focus:border-violet-500 focus:outline-none text-white"
                                    >
                                        {styles.map((s) => (
                                            <option key={s.id} value={s.id} className="bg-neutral-900 text-white">
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Logo Form */}
                        {activeType === "logo" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Brand Name
                                    </label>
                                    <input
                                        type="text"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                                        placeholder="Your brand name..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Industry</label>
                                    <select
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 focus:border-violet-500 focus:outline-none text-white"
                                    >
                                        {industries.map((ind) => (
                                            <option key={ind} value={ind} className="bg-neutral-900 text-white">
                                                {ind}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Style</label>
                                    <select
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 focus:border-violet-500 focus:outline-none text-white"
                                    >
                                        {styles.map((s) => (
                                            <option key={s.id} value={s.id} className="bg-neutral-900 text-white">
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Remove Background Form */}
                        {activeType === "remove-bg" && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <p className="text-xs text-muted mt-2">
                                    Paste a URL to any image to remove its background
                                </p>
                            </div>
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

                    <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        {isGenerating ? (
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 animate-spin text-violet-400 mx-auto mb-4" />
                                <p className="text-muted">Creating your masterpiece...</p>
                            </div>
                        ) : result ? (
                            <img
                                src={result}
                                alt="Generated"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-center text-muted">
                                <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Your generated image will appear here</p>
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
                            <button
                                onClick={() => navigator.clipboard.writeText(result)}
                                className="btn-secondary"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                            <a
                                href={result}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
