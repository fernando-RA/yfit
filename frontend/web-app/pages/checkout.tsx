import React from "react";
import { StringParam, useQueryParam } from "use-query-params";
import { useQuery } from "react-query";
import dynamic from "next/dynamic";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Spinner } from "../components/Spinner";
import { Navbar, CONTAINER_CLASSNAME } from "../components/Navbar";
import { CheckoutForm } from "../components/CheckoutForm";
import { getEvent } from "../api/http";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE ?? "");

const Checkout: React.FC = () => {
    // NOTE Class slug used to fetch the necessary metadata about the event
    const [slug] = useQueryParam("slug", StringParam);

    const { data, isLoading } = useQuery(slug!, () => getEvent(slug!), {
        enabled: slug !== undefined || slug !== null,
    });

    if (slug === undefined || slug === null) {
        return <div>No class found</div>;
    }

    if (isLoading || data === undefined) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <Spinner />
            </div>
        );
    }

    // TODO Handle a 404 from a bad slug

    return (
        <Elements
            stripe={stripePromise}
            options={{
                fonts: [
                    {
                        family: "Inter",
                        src: 'url("/fonts/Inter/Inter-Regular.ttf")',
                        weight: "400",
                    },
                ],
            }}
        >
            <Navbar backUrl={`/e/${slug}`} />
            <div className={CONTAINER_CLASSNAME}>
                <CheckoutForm event={data} />
            </div>
        </Elements>
    );
};

export default dynamic(() => Promise.resolve(Checkout), { ssr: false });
