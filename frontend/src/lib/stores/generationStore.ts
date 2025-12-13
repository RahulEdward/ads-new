import { create } from 'zustand';

interface Generation {
    id: string;
    type: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    prompt?: string;
    output_url?: string;
    thumbnail_url?: string;
    credits_used: number;
    created_at: string;
    completed_at?: string;
    error_message?: string;
}

interface GenerationState {
    generations: Generation[];
    currentGeneration: Generation | null;
    isGenerating: boolean;

    // Actions
    addGeneration: (generation: Generation) => void;
    updateGeneration: (id: string, updates: Partial<Generation>) => void;
    setCurrentGeneration: (generation: Generation | null) => void;
    setGenerating: (isGenerating: boolean) => void;
    clearGenerations: () => void;
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
    generations: [],
    currentGeneration: null,
    isGenerating: false,

    addGeneration: (generation) => {
        set((state) => ({
            generations: [generation, ...state.generations],
        }));
    },

    updateGeneration: (id, updates) => {
        set((state) => ({
            generations: state.generations.map((gen) =>
                gen.id === id ? { ...gen, ...updates } : gen
            ),
            currentGeneration:
                state.currentGeneration?.id === id
                    ? { ...state.currentGeneration, ...updates }
                    : state.currentGeneration,
        }));
    },

    setCurrentGeneration: (generation) => {
        set({ currentGeneration: generation });
    },

    setGenerating: (isGenerating) => {
        set({ isGenerating });
    },

    clearGenerations: () => {
        set({ generations: [], currentGeneration: null });
    },
}));
