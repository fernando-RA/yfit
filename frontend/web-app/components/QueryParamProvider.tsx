import React from "react";
import { useRouter } from "next/router";
import { QueryParamProvider as ContextProvider } from "use-query-params";

/* NOTE https://github.com/pbeshai/use-query-params/issues/13#issuecomment-815577849
 * In order, to get QueryParamProvider with next.js internal router, have to use
 * this wrapper
 */

export const QueryParamProviderComponent = (props: {
    children?: React.ReactNode;
}) => {
    const { children, ...rest } = props;
    const router = useRouter();
    const match = router.asPath.match(/[^?]+/);
    const pathname = match ? match[0] : router.asPath;

    const location = React.useMemo(
        () =>
            typeof window !== "undefined"
                ? window.location
                : ({
                      search: router.asPath.replace(/[^?]+/u, ""),
                  } as Location),
        [router.asPath],
    );

    const history = React.useMemo(
        () => ({
            push: ({ search }: Location) =>
                router.push(
                    { pathname: router.pathname, query: router.query },
                    { search, pathname },
                    { shallow: true, scroll: false },
                ),
            replace: ({ search }: Location) => {
                router.replace(
                    { pathname: router.pathname, query: router.query },
                    { search, pathname },
                    { shallow: true, scroll: false },
                );
            },
            location,
        }),
        [pathname, router.pathname, router.query, location.pathname],
    );

    return (
        <ContextProvider {...rest} history={history} location={location}>
            {children}
        </ContextProvider>
    );
};

export const QueryParamProvider = React.memo(QueryParamProviderComponent);
