"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Image,
    Video,
    Mic,
    Palette,
    Sparkles,
    Layers,
    ArrowRight,
    Coins,
    TrendingUp,
    Clock,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { usersApi } from "@/lib/api";

interface Stats {
    total_generations: number;
    credits_used: number;
    by_type: Record<string, number>;
}

const quickActions = [
    { name: "Generate Image", icon: Image, href: "/images", color: "from-pink-500 to-rose-500" },
    { name: "Create Banner", icon: Palette, href: "/images?type=banner", color: "from-violet-500 to-purple-500" },
    { name: "Design Logo", icon: Sparkles, href: "/images?type=logo", color: "from-amber-500 to-orange-500" },
    { name: "Remove BG", icon: Layers, href: "/images?type=remove-bg", color: "from-cyan-500 to-blue-500" },
    { name: "Create Video", icon: Video, href: "/videos", color: "from-green-500 to-emerald-500" },
    { name: "AI Voiceover", icon: Mic, href: "/videos?type=voiceover", color: "from-indigo-500 to-violet-500" },
];

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await usersApi.getStats();
            setStats(response.data);
        } catch (error) {
            console.error("Failed to load stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.full_name?.split(" ")[0]}! 👋
                </h1>
                <p className="text-muted">What would you like to create today?</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                            <Coins className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{user?.credits || 0}</div>
                            <div className="text-sm text-muted">Credits Available</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats?.total_generations || 0}</div>
                            <div className="text-sm text-muted">Total Generations</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats?.credits_used || 0}</div>
                            <div className="text-sm text-muted">Credits Used</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {quickActions.map((action, i) => (
                        <motion.div
                            key={action.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={action.href}
                                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition"
                            >
                                <div
                                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition`}
                                >
                                    <action.icon className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-sm font-medium text-center">{action.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Usage by Type */}
            {stats && Object.keys(stats.by_type).length > 0 && (
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Your Usage</h2>
                        <Link
                            href="/history"
                            className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                        >
                            View History <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(stats.by_type).map(([type, count]) => (
                            <div
                                key={type}
                                className="p-4 rounded-xl bg-white/5 border border-white/10"
                            >
                                <div className="text-2xl font-bold mb-1">{count}</div>
                                <div className="text-sm text-muted capitalize">{type.replace("_", " ")}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Getting Started */}
            {(!stats || stats.total_generations === 0) && (
                <div className="card text-center py-12">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-violet-400" />
                    <h3 className="text-xl font-semibold mb-2">Ready to create?</h3>
                    <p className="text-muted mb-6 max-w-md mx-auto">
                        You have {user?.credits || 0} credits to start. Try generating your first image or video!
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/images" className="btn-primary">
                            <Image className="w-5 h-5" />
                            Generate Image
                        </Link>
                        <Link href="/videos" className="btn-secondary">
                            <Video className="w-5 h-5" />
                            Create Video
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
