"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Users,
    Image,
    Video,
    Coins,
    TrendingUp,
    Search,
    MoreVertical,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/authStore";

interface User {
    id: string;
    email: string;
    full_name: string;
    credits: number;
    role: string;
    is_active: boolean;
    created_at: string;
}

interface Analytics {
    total_users: number;
    active_users: number;
    total_generations: number;
    credits_consumed: number;
    popular_types: Record<string, number>;
}

export default function AdminPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (user?.role !== "admin") {
            router.push("/images");
            return;
        }
        loadData();
    }, [user]);

    const loadData = async () => {
        try {
            const [usersRes, analyticsRes] = await Promise.all([
                adminApi.getUsers(50, 0),
                adminApi.getAnalytics(),
            ]);
            setUsers(usersRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Failed to load admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await adminApi.updateUser(userId, { is_active: !currentStatus });
            setUsers(users.map((u) =>
                u.id === userId ? { ...u, is_active: !currentStatus } : u
            ));
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    const handleAdjustCredits = async (userId: string, amount: number) => {
        try {
            await adminApi.adjustCredits(userId, {
                amount,
                reason: "Admin adjustment",
            });
            setUsers(users.map((u) =>
                u.id === userId ? { ...u, credits: u.credits + amount } : u
            ));
        } catch (error) {
            console.error("Failed to adjust credits:", error);
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.full_name.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-muted">Manage users and view analytics</p>
                </div>

                {/* Stats Grid */}
                {analytics && (
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-violet-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{analytics.total_users}</div>
                                    <div className="text-sm text-muted">Total Users</div>
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
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{analytics.active_users}</div>
                                    <div className="text-sm text-muted">Active Users</div>
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
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                    <Image className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{analytics.total_generations}</div>
                                    <div className="text-sm text-muted">Generations</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="card"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                    <Coins className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{analytics.credits_consumed}</div>
                                    <div className="text-sm text-muted">Credits Used</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Popular Types */}
                {analytics && Object.keys(analytics.popular_types).length > 0 && (
                    <div className="card mb-8">
                        <h2 className="text-xl font-semibold mb-4">Popular Generation Types</h2>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(analytics.popular_types).map(([type, count]) => (
                                <div
                                    key={type}
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                                >
                                    <span className="font-medium">{type}</span>
                                    <span className="text-muted ml-2">({count})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Users</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted">User</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted">Credits</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted">Role</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted">Status</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted">Joined</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400" />
                                                <div>
                                                    <div className="font-medium">{u.full_name}</div>
                                                    <div className="text-sm text-muted">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <span>{u.credits}</span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleAdjustCredits(u.id, 100)}
                                                        className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                    >
                                                        +100
                                                    </button>
                                                    <button
                                                        onClick={() => handleAdjustCredits(u.id, -50)}
                                                        className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                                    >
                                                        -50
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`px-2 py-1 rounded-lg text-xs font-medium ${u.role === "admin"
                                                        ? "bg-violet-500/20 text-violet-400"
                                                        : "bg-white/10 text-muted"
                                                    }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => handleToggleStatus(u.id, u.is_active)}
                                                className={`px-2 py-1 rounded-lg text-xs font-medium ${u.is_active
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-red-500/20 text-red-400"
                                                    }`}
                                            >
                                                {u.is_active ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-muted">
                                            {formatDate(u.created_at)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <button className="p-2 rounded-lg hover:bg-white/10 transition">
                                                <MoreVertical className="w-5 h-5 text-muted" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                        <span className="text-sm text-muted">
                            Showing {filteredUsers.length} of {users.length} users
                        </span>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
