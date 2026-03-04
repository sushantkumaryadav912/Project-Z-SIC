# API map

This document captures the Takeaway, Tiffin, and Events endpoints used by the app and the hooks that map to them.

## Base

- Base URL is configured in [src/core/api/axios.ts](src/core/api/axios.ts).

## Takeaway (restaurants)

Listing and search
- GET /firm/getnearbyrest (use `feature=Takeaway` by default; optional filter params)
- GET /firm/getnearbyrest?cuisines=Vegetarian
- GET /search
- GET /firm/getrecently-viewed
- POST /firm/recently-viewed/:firmId

Details and menu
- GET /firm/getOne/:firmId
- GET /firm/restaurants/menu-sections-items/:firmId

Favorites
- POST /firm/fav/:firmId
- GET /firm/favCheck/:firmId
- POST /firm/favRemove/:firmId
- POST /firm/users/:firmId/liked
- GET /firm/user/liked-restaurants
- GET /firm/user/:firmId/islike

Orders
- GET /api/orders/menu/user?page=&limit=
- POST /api/create
- GET /api/orderFav?page=&limit=&type=Firm
- PUT /api/orderFav/:orderId

Offers and notifications
- GET /api/offers/takeaway/cart/apply-offers?firmId=&productIds=&categoryId=&subcategoryIds=
- GET /api/getnotifications
- POST /api/postNotificationsInfo

Hooks
- useRestaurants (listing)
- useRestaurantDetail (detail)
- useRestaurantMenuSections
- useTakeawayRecentlyViewed / useTrackTakeawayRecentlyViewed
- useTakeawayFavorites / useTakeawayFavoriteStatus / useTakeawayLikeStatus
- useAddTakeawayFavorite / useRemoveTakeawayFavorite / useLikeTakeaway
- useTakeawayOrders / useCreateTakeawayOrder
- useTakeawayFavoriteOrders / useToggleTakeawayOrderFavorite
- useTakeawayOffers
- useTakeawayNotifications / useUpdateTakeawayNotifications

## Tiffin

Listing and filters
- GET /api/tiffin/tiffins/filter
- GET /api/tiffin/tiffins/open-now
- GET /api/tiffin/tiffins/high-rated
- GET /api/tiffin/tiffins/filter?category=veg
- GET /api/tiffin/tiffins/filter?kitchenName=

Details and offers
- GET /api/get-tiffin/:tiffinId
- GET /api/tiffin/offers/:tiffinId

Favorites and orders
- GET /api/tiffins/liked
- GET /api/orderFav?page=&limit=&type=Tiffin
- PUT /api/orderFav/:orderId

Recently viewed and search
- GET /firm/getrecently-viewed
- POST /firm/recently-viewed/:tiffinId
- GET /search

Hooks
- useTiffins / useTiffinsOpenNow / useTiffinsHighRated / useTiffinsByKitchenName
- useTiffinDetail / useTiffinOffers
- useTiffinFavorites
- useTiffinFavoriteOrders / useToggleTiffinOrderFavorite
- useTiffinRecentlyViewed / useTrackTiffinRecentlyViewed

## Events

Listing and details
- GET /api/events
- GET /api/events/:id

Defined in API map
- GET /api/events/featured
- GET /api/events/search

Hooks
- useEvents / useEventDetail
- useEventFeatured / useEventSearch
