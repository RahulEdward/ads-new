"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Layout,
    Search,
    Filter,
    ArrowRight,
    Star,
    Video,
    Image as ImageIcon,
} from "lucide-react";

// Mock Data for Templates
const CATEGORIES = ["All", "Social Media", "Business", "Marketing", "Education", "E-commerce"];

const TEMPLATES = [
    {
        id: "1",
        title: "Product Launch Teaser",
        category: "Marketing",
        type: "video",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        duration: "15s",
        rating: 4.8,
    },
    {
        id: "2",
        title: "Tech Review Banner",
        category: "Social Media",
        type: "image",
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",
        dims: "1280x720",
        rating: 4.5,
    },
    {
        id: "3",
        title: "Corporate Presentation",
        category: "Business",
        type: "video",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
        duration: "60s",
        rating: 4.9,
    },
    {
        id: "4",
        title: "Instagram Story Sale",
        category: "E-commerce",
        type: "image",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&q=80",
        dims: "1080x1920",
        rating: 4.7,
    },
    {
        id: "5",
        title: "Educational Course Intro",
        category: "Education",
        type: "video",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
        duration: "30s",
        rating: 4.6,
    },
    {
        id: "6",
        title: "Youtube Thumbnail Gaming",
        category: "Social Media",
        type: "image",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
        dims: "1280x720",
        rating: 4.8,
    },
];

export default function TemplatesPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTemplates = TEMPLATES.filter((template) => {
        const matchesCategory =
            selectedCategory === "All" || template.category === selectedCategory;
        const matchesSearch = template.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto p-2">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Layout className="w-8 h-8 text-violet-400" />
                    Template Library
                </h1>
                <p className="text-muted">
                    Start with a pre-designed template to save time
                </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search templates..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${selectedCategory === cat
                                    ? "bg-violet-500 text-white"
                                    : "bg-white/5 text-muted hover:bg-white/10"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template, idx) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-[#111] rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition-all hover:shadow-2xl hover:shadow-violet-500/10"
                    >
                        {/* Preview Image */}
                        <div className="aspect-video relative overflow-hidden">
                            <img
                                src={template.image}
                                alt={template.title}
                                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <button className="w-full btn-primary justify-center">
                                    Use Template
                                </button>
                            </div>
                            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-xs font-medium flex items-center gap-1">
                                {template.type === "video" ? (
                                    <Video className="w-3 h-3 text-cyan-400" />
                                ) : (
                                    <ImageIcon className="w-3 h-3 text-violet-400" />
                                )}
                                <span className="uppercase">{template.type}</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg group-hover:text-violet-400 transition">
                                    {template.title}
                                </h3>
                                <div className="flex items-center gap-1 text-amber-400 text-sm">
                                    <Star className="w-3 h-3 fill-current" />
                                    {template.rating}
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted">
                                <span>{template.category}</span>
                                <span>{template.duration || template.dims}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Filter className="w-8 h-8 text-muted" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                    <p className="text-muted">
                        Try adjusting your search or filters
                    </p>
                </div>
            )}
        </div>
    );
}
