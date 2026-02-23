export interface Tiffin {
    _id: string;
    name: string;
    shortDescription?: string;
    pricePerMeal?: number;
    rating?: number;
    imageUrl?: string;
    // Based on standard API structure, adapting as needed by UI.
}

export interface TiffinDetail extends Tiffin {
    description?: string;
    menu?: string[];
    contact?: string;
}
