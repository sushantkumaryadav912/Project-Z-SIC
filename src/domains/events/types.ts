export interface EventLocation {
    lat?: number;
    lng?: number;
    address?: string;
}

export interface Event {
    _id: string;
    name?: string;
    title?: string;
    description?: string;
    date?: string;
    category?: string;
    venue?: string;
    priceInfo?: string;
    price?: number | string;
    images?: string[];
    imageUrl?: string;
    location?: EventLocation;
}
