import React from "react";
import { useQuery } from "react-query";
import { StringParam, useQueryParam } from "use-query-params";
import dynamic from "next/dynamic";

import Header from "../../components/reseve-success/Header";
import Main from "../../components/reseve-success/Main";
import { AdditionalClasses } from "../../components/AdditionalClasses";
import { Spinner } from "../../components/Spinner";
import { getEvent, getTrainerEvents } from "../../api/http";

const ReserveSuccess = () => {
    // NOTE Class slug used to fetch the necessary metadata about the event
    const [slug] = useQueryParam("slug", StringParam);
    const [emailAddress] = useQueryParam("email_address", StringParam);

    const { data, isLoading } = useQuery(slug!, () => getEvent(slug!), {
        enabled: slug !== undefined || slug !== null,
    });

    const { data: trainerEvents } = useQuery(
        ["events", data?.author.id],
        () => getTrainerEvents(data!.author.id),
        {
            enabled: data?.author?.id !== undefined,
        },
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="w-full bg-black">
            <div className="flex justify-center">
                <div className="trainer-class max-w-sm">
                    <Header />
                    <Main
                        classData={{ classData: data ?? {} }}
                        emailAddress={emailAddress ?? ""}
                    />
                    {trainerEvents !== undefined && (
                        <AdditionalClasses events={trainerEvents} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(ReserveSuccess), { ssr: false });
