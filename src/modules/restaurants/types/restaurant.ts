export interface RestaurantLocation {
    lat?: number;
    lng?: number;
    address?: string;
}

export interface RestaurantMenuItem {
    name: string;
    description?: string;
    price?: number | string;
}

export interface RestaurantMenuSection {
    title: string;
    items: RestaurantMenuItem[];
}

export interface Restaurant {
    _id: string;
    name?: string;
    description?: string;
    cuisineTags?: string[];
    cuisines?: string[] | string;
    priceRange?: string | number;
    badges?: string[];
    serviceTypes?: string[];
    vegOnly?: boolean;
    isVeg?: boolean;
    images?: string[];
    imageUrl?: string;
    location?: RestaurantLocation;
    address?: string;
}

export interface RestaurantDetail extends Restaurant {
    menu?: RestaurantMenuItem[] | string[];
    menuSections?: {
        title?: string;
        name?: string;
        items?: RestaurantMenuItem[] | string[];
    }[];
    openingHours?: string | string[];
    hours?: string | string[];
    contact?: {
        phone?: string;
        email?: string;
    };
    phone?: string;
    email?: string;
}
