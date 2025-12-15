"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Sparkles,
    Image,
    Video,
    History,
    Settings,
    LogOut,
    Menu,
    X,
    Coins,
    ChevronRight,
    Home,
    Palette,
    Layers,
    Mic,
    ChevronLeft
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "Image Generation", href: "/images", icon: Image },
    { name: "Video Generation", href: "/videos", icon: Video },
    { name: "History", href: "/history", icon: History },
];

const quickActions = [
    { name: "Banner", icon: Palette, href: "/images?type=banner" },
    { name: "Logo", icon: Sparkles, href: "/images?type=logo" },
    { name: "Remove BG", icon: Layers, href: "/images?type=remove-bg" },
    { name: "Voiceover", icon: Mic, href: "/videos?type=voiceover" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout, fetchUser } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        if (!user) {
            fetchUser().catch(() => {
                router.push("/login");
            });
        }
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? 80 : 288,
                    x: sidebarOpen ? 0 : 0
                }}
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0d0d0d] border-r border-white/5 transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
                // Using style for width on mobile to avoid conflicts, but motion uses width on desktop
                style={{ width: undefined }}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Logo & Toggle */}
                    <div className={`p-4 border-b border-white/5 flex ${isCollapsed ? "flex-col gap-4 text-center items-center py-6" : "items-center justify-between"}`}>
                        <Link href="/" className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
                            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-lg font-bold whitespace-nowrap"
                                >
                                    AI Studio Pro
                                </motion.span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`p-2 rounded-lg hover:bg-white/10 text-muted hover:text-white transition ${isCollapsed ? "" : "bg-white/5"}`}
                        >
                            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Credits */}
                    <div className="p-4">
                        {!isCollapsed ? (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 whitespace-nowrap overflow-hidden">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted">Credits</span>
                                    <Coins className="w-4 h-4 text-yellow-400" />
                                </div>
                                <div className="text-2xl font-bold">{user.credits}</div>
                                <Link
                                    href="/pricing"
                                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 mt-2"
                                >
                                    Get more <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white/5 border border-white/5">
                                <Coins className="w-4 h-4 text-yellow-400" />
                                <span className="text-xs font-bold">{user.credits}</span>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition group ${isActive
                                        ? "bg-violet-500/20 text-violet-400"
                                        : "text-muted hover:bg-white/5 hover:text-white"
                                        } ${isCollapsed ? "justify-center" : ""}`}
                                    title={isCollapsed ? item.name : ""}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-violet-400" : "group-hover:text-white"}`} />
                                    {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                                </Link>
                            );
                        })}

                        {/* Quick Actions */}
                        {!isCollapsed && (
                            <div className="pt-6">
                                <div className="text-xs font-medium text-muted uppercase tracking-wider px-4 mb-3 whitespace-nowrap">
                                    Quick Actions
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickActions.map((action) => (
                                        <Link
                                            key={action.name}
                                            href={action.href}
                                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-center"
                                        >
                                            <action.icon className="w-5 h-5 text-violet-400" />
                                            <span className="text-xs whitespace-nowrap">{action.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </nav>

                    {/* Footer - No Toggle */}
                    <div className="p-4 border-t border-white/5 flex flex-col gap-2">
                        {!isCollapsed ? (
                            <div className="flex items-center gap-3 mb-2 overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate text-sm">{user.full_name}</div>
                                    <div className="text-xs text-muted truncate">{user.email}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 shrink-0" />
                            </div>
                        )}

                        <div className={`flex gap-2 ${isCollapsed ? "flex-col items-center" : ""}`}>
                            {!isCollapsed && (
                                <>
                                    <Link
                                        href="/settings"
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm whitespace-nowrap"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center px-3 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </>
                            )}

                            {isCollapsed && (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center px-3 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0d0d0d]/80 backdrop-blur-lg sticky top-0 z-40">
                    <button
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X /> : <Menu />}
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        {user.role === "admin" && (
                            <Link
                                href="/admin"
                                className="text-sm px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition"
                            >
                                Admin Panel
                            </Link>
                        )}
                        {/* Minified User Profile for Header when collapsed */}
                        {isCollapsed && (
                            <div className="hidden lg:flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-sm font-medium">{user.full_name}</div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400" />
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
