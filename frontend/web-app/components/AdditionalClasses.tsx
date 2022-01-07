import React from "react";

import { EventCard } from "./EventCard";
import type { Event } from "../types/event.types";

export const AdditionalClasses = ({ events }: { events: Event[] }) => {
    if (events === undefined || events?.length === 0) {
        return <div />;
    }

    return (
        <div className="mx-3">
            <h2 className="text-gray-400 uppercase text-sm font-bold mb-3 tracking-wide">
                More Classes from {events[0]?.author?.first_name}
            </h2>
            {events.map((event: Event) => (
                <EventCard variant="dark" event={event} key={event.id} />
            ))}
        </div>
    );
};
