export const ENDPOINTS = {
    config: '/api/config',
    restaurants: {
        list: '/firm/get-all/restaurants',
        detail: (id: string) => `/firm/getOne/${id}`,
    },
    tiffins: {
        list: '/api/tiffin',
        detail: (id: string) => `/api/tiffin/${id}`,
    },
    events: {
        list: '/api/events',
        detail: (id: string) => `/api/events/${id}`,
    },
};
