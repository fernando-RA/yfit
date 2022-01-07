import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";

import * as gtag from "../utils/gtag";
import { wrapper } from "../redux/store";
import { QueryParamProvider } from "../components/QueryParamProvider";
import "../styles/global.scss";

const queryClient = new QueryClient();

function FacebookPixel() {
    React.useEffect(() => {
        const {
            env: { NEXT_PUBLIC_PIXEL_ID },
        } = process;
        if (NEXT_PUBLIC_PIXEL_ID !== undefined) {
            import("react-facebook-pixel")
                .then((x) => x.default)
                .then((ReactPixel) => {
                    ReactPixel.init(NEXT_PUBLIC_PIXEL_ID);
                });
        }
    }, []);

    return null;
}

function App({ Component, pageProps }: { Component: any; pageProps: object }) {
    const router = useRouter();

    React.useEffect(() => {
        const handleRouteChange = (url: string) => {
            gtag.pageview(url);
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);

    return (
        <QueryParamProvider>
            <QueryClientProvider client={queryClient}>
                <Head>
                    <title>Rec</title>
                    <link rel="icon" href="/static/favicon.ico" />
                    <link
                        rel="apple-touch-icon"
                        href="/static/apple-touch-icon.png"
                    />
                </Head>
                <FacebookPixel />
                <Component {...pageProps} />
            </QueryClientProvider>
        </QueryParamProvider>
    );
}

export default wrapper.withRedux(App);
