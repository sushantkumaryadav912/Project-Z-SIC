export const ENDPOINTS = {
    tiffins: '/tiffin',
    tiffinDetail: (id: string) => `/get-tiffin/${id}`,
    activeCollections: '/active',
    collectionBySlug: (slug: string) => `/by-slug/${slug}`,
};
