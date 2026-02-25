export interface Tiffin {
    _id: string;
    name: string;
    shortDescription?: string;
    pricePerMeal?: number;
    rating?: number;
    imageUrl?: string;
    vegOnly?: boolean;
    coverageAreas?: string[];
    mealPlans?: string[];
    scheduleDays?: string[];
    priceRange?: string | number;
    // Based on standard API structure, adapting as needed by UI.
}

export interface TiffinDetail extends Tiffin {
    description?: string;
    menu?: string[];
    contact?: string;
    contactPhone?: string;
    contactEmail?: string;
    location?: {
        lat: number;
        lng: number;
        address?: string;
    };
}
