import axios from "axios";

import { httpConfig } from "../constants/httpConfig";
import type { Event } from "../types/event.types";

export const request = axios.create({
    baseURL: httpConfig.baseURL,
    timeout: httpConfig.defaultTimeout,
});

export const getEvent = async (slug: string): Promise<Event | undefined> => {
    const { data } = await request.get(`api/v1/trainer-classes/${slug}`);
    return data as Event;
};

export const getTrainerEvents = async (id: number): Promise<Event[]> => {
    const { data } = await request.get(
        "/api/v1/trainer-classes-upcoming-page/",
        {
            params: {
                trainer_id: id,
            },
        },
    );
    return data.results;
};

// TODO
type Trainer = any;
export const getTrainer = async (
    slug: string,
): Promise<Trainer | undefined> => {
    const { data } = await request.get(`api/v1/trainer/${slug}`);
    return data;
};
