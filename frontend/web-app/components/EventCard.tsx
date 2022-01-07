import React from "react";
import Image from "next/image";
import moment from "moment-timezone";
import Link from "next/link";
import classNames from "classnames";

import type { Event } from "../types/event.types";

export const EventCard = ({
    variant = "light",
    event: { featured_photo, name, location, start_time, duration, tags, slug },
}: {
    variant: "light" | "dark";
    event: Event;
}) => {
    const startTime = moment(new Date(start_time)).format("h:mma");
    const isDarkMode = variant === "dark";

    return (
        <Link href={`/e/${slug}`}>
            <div
                className={classNames("border rounded mb-5 cursor-pointer", {
                    "text-white border-gray-600": isDarkMode,
                    "border-gray-400": !isDarkMode,
                })}
            >
                {featured_photo ? (
                    <Image
                        src={featured_photo}
                        width="330"
                        height="330"
                        layout="responsive"
                        objectFit="cover"
                        className="rounded-t"
                    />
                ) : (
                    <div
                        style={{ height: "330px" }}
                        className={`w-full bg-gray-400`}
                    />
                )}
                <div className="m-3">
                    <h2 className="font-bold mb-2 text-xl">{name}</h2>
                    <p>{location.location_name}</p>
                    <p>
                        {`${moment(new Date(start_time)).format(
                            "MMM DD",
                        )} \u2014 ${startTime}, ${duration}min`}
                    </p>
                    <p
                        className={classNames("", {
                            "text-gray-300": isDarkMode,
                            "text-gray-700": !isDarkMode,
                        })}
                    >
                        {tags.join(", ")}
                    </p>
                </div>
            </div>
        </Link>
    );
};
