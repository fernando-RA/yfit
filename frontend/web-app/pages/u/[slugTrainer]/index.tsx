import React from "react";
import Grid from "@material-ui/core/Grid";
import Image from "next/image";
import InstagramIcon from "@material-ui/icons/Instagram";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

import ErrorComponent from "../../../components/ErrorComponent";
import Footer from "../../../components/Details/components/Footer";
import Metadata from "../../../components/Profile/metadata";
import { EventCard } from "../../../components/EventCard";
import { Spinner } from "../../../components/Spinner";
import { getTrainer, getTrainerEvents } from "../../../api/http";
import type { Event } from "../../../types/event.types";

const useClasses = makeStyles(() => ({
    wrapper: (trainerEvents: Event[]) => ({
        background: "#f7f7f7",
        height: trainerEvents.length > 0 ? "unset" : "100vh",
    }),
    root: {
        fontSize: 16,
        fontFamily: "Inter",
        color: "#000",
    },
    container: {
        background: "#FFFFFF",
        padding: "0 16px",
        maxWidth: 375,
        margin: "0 auto",
    },
    name: {
        fontWeight: "bold",
        fontSize: 24,
        marginBottom: 8,
    },
    instagram: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 8,
    },
    instagramLink: {
        marginLeft: 5,
        fontStyle: "normal",
        fontWeight: "normal",
        textDecoration: "underline",
        fontSize: 16,
        color: "#000",
    },
    tagsText: {
        fontSize: 16,
    },
    aboutTitle: {
        marginTop: 24,
        color: "#333",

        fontSize: 12,
        fontWeight: "bold",
    },
    bio: {
        fontSize: 20,
        color: "#000",
    },
    moreClassesContainer: {
        marginTop: 32,
    },
    moreClasses: {
        textTransform: "uppercase",
        fontSize: 12,
        letterSpacing: "0.04rem",
        fontWeight: 600,
    },
    imageContainer: {
        margin: "0 -16px 18px",
    },
    footerWrapper: {
        margin: "0 -15px",
    },
    imgPlaceholder: {
        height: 290,
        width: "100%",
    },
}));

function Profile() {
    const router = useRouter();
    const { slugTrainer } = router.query;

    const isTrainerDataFetchable =
        slugTrainer !== undefined && slugTrainer !== "";
    const {
        data: trainerData,
        isFetching: isFetchingTrainerData,
        error,
        refetch: refetchTrainerData,
    } = useQuery(
        ["trainer", slugTrainer],
        () => getTrainer(slugTrainer as string),
        { enabled: isTrainerDataFetchable },
    );

    const { data: trainerEvents, isFetching: isFetchingTrainerEvents } =
        useQuery(
            ["events", trainerData?.id],
            () => getTrainerEvents(trainerData!.id),
            {
                enabled: trainerData?.id !== undefined,
            },
        );

    const classes = useClasses(trainerEvents ?? []);

    const isFetching = isFetchingTrainerData || isFetchingTrainerEvents;
    if (isFetching || !isTrainerDataFetchable) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <ErrorComponent
                loading={isFetching}
                disabled={isFetching}
                onPress={() => refetchTrainerData()}
            />
        );
    }

    const tags = `${trainerData.workout_types.map(
        (e: any, i: number, arr: any[]) =>
            e.workout_type + i === arr.length - 1 ? "" : " " + e.workout_type,
    )}`;

    const name = `${trainerData.first_name} ${trainerData.last_name}`;
    const desc = `${trainerData.first_name} ${trainerData.last_name} ${
        tags.length === 0 ? "" : ` - ${tags}`
    }`;

    return (
        <>
            <Metadata
                name={name}
                photo={
                    trainerData.profile_picture ||
                    trainerData.social_profile_url
                }
                desc={desc}
                link={trainerData.link}
            />
            <div className={classes.wrapper}>
                <div className={classes.root}>
                    <Grid container className={classes.container}>
                        <Grid item xs={12}>
                            <div
                                className={
                                    "image-container " + classes.imageContainer
                                }
                            >
                                {trainerData.profile_picture ||
                                trainerData.social_profile_url ? (
                                    <Image
                                        src={
                                            trainerData.profile_picture ||
                                            trainerData.social_profile_url
                                        }
                                        width="375"
                                        height="300"
                                        layout="responsive"
                                        objectFit="cover"
                                        className={"image"}
                                    />
                                ) : (
                                    <div
                                        className={`${classes.imgPlaceholder} bg-gray-400`}
                                    />
                                )}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h1" className={classes.name}>
                                {name}
                            </Typography>
                        </Grid>
                        {trainerData.instagram_link && (
                            <Grid item xs={12} className={classes.instagram}>
                                <InstagramIcon fontSize="small" />
                                <Typography variant="body1">
                                    <a
                                        className={classes.instagramLink}
                                        href={trainerData.instagram_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >{`@${trainerData.instagram_link
                                        .split("/")
                                        .slice(-1)}`}</a>
                                </Typography>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Typography
                                variant="body1"
                                className={classes.tagsText}
                            >
                                {trainerData.workout_types.map(
                                    (e: any, i: number, arr: any[]) => (
                                        <span key={e.workout_type}>
                                            {e.workout_type}
                                            {i === arr.length - 1 ? "" : ", "}
                                        </span>
                                    ),
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                variant="body1"
                                className={classes.aboutTitle}
                            >
                                ABOUT
                            </Typography>
                            <Typography
                                variant="inherit"
                                className={classes.bio}
                            >
                                {trainerData.bio}
                            </Typography>
                        </Grid>
                        {(trainerEvents || []).length > 0 && (
                            <>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.moreClassesContainer}
                                >
                                    <Typography
                                        variant="body1"
                                        className={classes.moreClasses}
                                    >
                                        Upcoming classes from{" "}
                                        {`${trainerData.first_name} ${trainerData.last_name}`}
                                    </Typography>
                                </Grid>
                                {/* HACK until refactor out makeStyles */}
                                <div className="w-full h-3" />
                                <Grid item xs={12}>
                                    {(trainerEvents ?? []).map((e: Event) => (
                                        <EventCard
                                            variant="light"
                                            event={e}
                                            key={e.id}
                                        />
                                    ))}
                                </Grid>
                            </>
                        )}
                        <div className={classes.footerWrapper}>
                            <Footer />
                        </div>
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default Profile;
