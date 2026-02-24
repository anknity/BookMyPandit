export interface Puja {
    id: string; // UUID
    name: string;
    name_hi?: string;
    description: string;
    description_hi?: string;
    category: string;
    base_price: number;
    duration: string;
    duration_hours?: string;
    image_url?: string;
    is_active: boolean;
    mantra_count?: string;
    pandits_required: number;
    samagri_available: boolean;
    items_included?: string[];
    benefits?: string[];
    created_at: string;
    updated_at: string;
}

// Add other types as needed
export interface Pandit {
    id: string;
    name: string;
    // ...
}
