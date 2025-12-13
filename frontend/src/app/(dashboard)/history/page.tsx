"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Image,
    Video,
    Mic,
    Clock,
    Download,
    ExternalLink,
    Loader2,
    Filter,
} from "lucide-react";
import { usersApi } from "@/lib/api";

interface Generation {
    id: string;
    type: string;
    status: string;
    prompt?: string;
    output_url?: string;
    credits_used: number;
    created_at: string;
}

const typeIcons: Record<string, any> = {
    image: Image,
    banner: Image,
    logo: Image,
    background_removal: Image,
    video: Video,
    presenter_video: Video,
    voiceover: Mic,
};

const typeLabels: Record<string, string> = {
    image: "Image",
    banner: "Banner",
    logo: "Logo",
    background_removal: "BG Removal",
    video: "Video",
    presenter_video: "Presenter",
    voiceover: "Voiceover",
};

export default function HistoryPage() {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const response = await usersApi.getHistory(100, 0);
            setGenerations(response.data.items || []);
        } catch (error) {
            console.error("Failed to load history:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredGenerations = filter === "all"
        ? generations
        : generations.filter((g) => {
            if (filter === "images") return ["image", "banner", "logo", "background_removal"].includes(g.type);
            if (filter === "videos") return ["video", "presenter_video", "voiceover"].includes(g.type);
            return true;
        });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Generation History</h1>
                    <p className="text-muted">View all your past generations</p>
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="images">Images Only</option>
                        <option value="videos">Videos Only</option>
                    </select>
                </div>
            </div>

            {filteredGenerations.length === 0 ? (
                <div className="card text-center py-16">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-muted opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No generations yet</h3>
                    <p className="text-muted">Start creating to see your history here</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGenerations.map((gen, i) => {
                        const Icon = typeIcons[gen.type] || Image;
                        return (
                            <motion.div
                                key={gen.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="card group"
                            >
                                {/* Preview */}
                                <div className="aspect-video rounded-xl bg-white/5 mb-4 overflow-hidden relative">
                                    {gen.output_url ? (
                                        gen.type === "voiceover" ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Mic className="w-12 h-12 text-violet-400" />
                                            </div>
                                        ) : gen.type.includes("video") ? (
                                            <video
                                                src={gen.output_url}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={gen.output_url}
                                                alt={gen.prompt || "Generated"}
                                                className="w-full h-full object-cover"
                                            />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Icon className="w-12 h-12 text-muted opacity-50" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div
                                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${gen.status === "completed"
                                                ? "bg-green-500/20 text-green-400"
                                                : gen.status === "failed"
                                                    ? "bg-red-500/20 text-red-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                            }`}
                                    >
                                        {gen.status}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-medium">
                                        {typeLabels[gen.type] || gen.type}
                                    </span>
                                    <span className="text-xs text-muted">
                                        {gen.credits_used} credits
                                    </span>
                                </div>

                                <p className="text-sm text-muted line-clamp-2 mb-3">
                                    {gen.prompt || "No description"}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted">
                                        {formatDate(gen.created_at)}
                                    </span>

                                    {gen.output_url && (
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <a
                                                href={gen.output_url}
                                                download
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                            <a
                                                href={gen.output_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
