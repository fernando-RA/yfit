// TODO Incomplete
export interface Author {
    id: number;
    bio: string;
    email: string;
    first_name: string;
    last_name: string;
    stripe_account_id: string;
    stripe_customer_id: string;
}

export interface Location {
    lat: number;
    lng: number;
    location_name: string;
}

export interface Event {
    id: number;
    attend_limit_count: number;
    author: Author;
    clients: number;
    featured_photo: string | null; // url
    is_attendee_limit: boolean;
    name: string;
    slug: string;
    start_time: string; // datetime
    canceled: boolean;
    free: boolean;
    price: string; // String in dollars
    location: Location;
    duration: number;
    tags: string[];
}
