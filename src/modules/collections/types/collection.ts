export interface Collection {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    bannerImage?: string;
}

export interface CollectionDetail extends Collection {
    items: any[]; // Depending on what a collection holds (mixed items)
}
