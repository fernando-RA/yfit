import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";

import Header from "../../components/Details/components/Header";
import Main from "../../components/Details/components/Main";
import Footer from "../../components/Details/components/Footer";
import { CheckoutButton } from "../../components/Details/components/CheckoutButton";
import Loader from "../../components/Loader";
import * as actions from "../../redux/details/actions";
import ErrorComponent from "../../components/ErrorComponent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Spinner } from "../../components/Spinner";

import { wrapper } from "../../redux/store";
const useStyles = makeStyles({
    imageContainer: {
        width: "100%",
    },
    container: {
        background: "black",
        padding: "0 16px",
        width: 375,
        margin: "0 auto",
    },
});

const Details = () => {
    const classes = useStyles();
    const router = useRouter();
    const { slugClass } = router.query;
    const dispatch = useDispatch();
    const state = useSelector((RXState) => RXState.classData);

    if (state.isFetching) {
        return (
            <div className="flex w-screen h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (state.error && !state.isFetching) {
        return (
            <ErrorComponent
                loading={state.isFetching}
                disabled={state.isFetching}
                onPress={() =>
                    dispatch(actions.getClassRequest(`${slugClass}`))
                }
            />
        );
    }

    const desc = `${state.classData.author.first_name} ${state.classData.author.last_name} - ${state.classData.duration}min - ${state.classData.details}`;

    return (
        <div className="bg-black">
            <div className={classes.container}>
                {!state.isFetching && !state.error && (
                    <Head>
                        <title>{state.classData.name}</title>
                        <meta
                            name="title"
                            content={state.classData.class_link}
                        />
                        <meta name="description" content={desc} />

                        <meta property="og:type" content="website" />
                        <meta
                            property="og:url"
                            content={state.classData.class_link}
                        />
                        <meta
                            property="og:title"
                            content={state.classData.name}
                        />
                        <meta property="og:description" content={desc} />
                        <meta
                            property="og:image"
                            content={state.classData.featured_photo}
                        />

                        <meta
                            property="twitter:card"
                            content="summary_large_image"
                        />
                        <meta
                            property="twitter:url"
                            content={state.classData.class_link}
                        />
                        <meta
                            property="twitter:title"
                            content={state.classData.name}
                        />
                        <meta property="twitter:description" content={desc} />
                        <meta
                            property="twitter:image"
                            content={state.classData.featured_photo}
                        />
                    </Head>
                )}
                <div className="details">
                    {state.isFetching ? (
                        <Loader />
                    ) : (
                        <>
                            <Header />
                            <Main />
                            <Footer />
                            <CheckoutButton event={state.classData} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(
    async ({ params, store, ...rest }) => {
        const { slugClass } = params;
        if (slugClass) {
            store.dispatch(actions.getClassRequest(`${slugClass}`));
        }
        store.dispatch(END);
        await store.sagaTask.toPromise();
    },
);

export default Details;
