import React from "react";
import { useRouter } from "next/router";
import moment from "moment";

import * as gtag from "../../../utils/gtag";
import { Button } from "../../../components/Button";

import type { Event } from "../../../types/event.types";

const DEFAULT_BUTTON_CLASSNAMES = "w-80 fixed bottom-8 ml-3 text-center";

// Button "goes to checkout" if possible
export const CheckoutButton = ({ event }: { event: Event }) => {
    const router = useRouter();

    const isSoldout =
        event.is_attendee_limit &&
        event.attend_limit_count - event.clients === 0;
    const isExpired = moment().isAfter(moment(event.start_time));
    const isCanceled = event.canceled;

    const eventReserve = () => {
        gtag.event({
            action: "go_to_booking",
            category: "e-comerce",
            label: "Went to booking",
            value: "Play",
        });
    };

    if (isCanceled || isSoldout || isExpired) {
        return (
            <Button
                as="button"
                disabled={true}
                className={DEFAULT_BUTTON_CLASSNAMES}
            >
                <span>
                    {isCanceled && "Canceled"}
                    {isSoldout && "Sold out"}
                    {isExpired && "Class closed"}
                </span>
                <span className="absolute right-5 font-light">
                    {event.free ? "Free" : `$${parseInt(event.price)}`}
                </span>
            </Button>
        );
    }

    return (
        <Button
            as="a"
            className={DEFAULT_BUTTON_CLASSNAMES}
            onClick={() => {
                eventReserve();
                router.push(`/checkout?slug=${event.slug}`);
            }}
        >
            <span>Reserve</span>
            <span className="absolute right-5 font-light">
                {event.free ? "Free" : `$${parseInt(event.price)}`}
            </span>
        </Button>
    );
};
