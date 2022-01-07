import React from "react";
import Image from "next/image";
import Link from "next/link";

import Grid from "@material-ui/core/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";

const useClasses = makeStyles((theme) => ({
    root: {
        backgroundColor: "#F7F7F7",
        fontFamily: "Inter",
        fontStyle: "normal",
    },
    header: {
        padding: 10,
        backgroundColor: "#002116",
        fontWeight: 600,
        fontSize: 12,
        lineHeight: "120%",
        textAlign: "center",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        height: 34,
    },
    body: {
        padding: "45px 25px 25px",
    },
    logoContainer: {
        marginBottom: 25,
    },
    logo: {
        // [theme.breakpoints.up("md")]: {
        //   transform: "scale(1.3)",
        // },
    },
    footer: {
        backgroundColor: "#002116",
        padding: 25,
    },
    link: {
        fontWeight: 300,
        fontSize: 16,
        lineHeight: "120%",
        textAlign: "center",
        textDecorationLine: "underline",
        color: "#fff",
        alignSelf: "center",
    },
    downloadButton: {
        // margin: "0 auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 13,
        background: "#000000",
        borderRadius: 24,
        marginBottom: 24,
        width: 290,
        textDecoration: "none",
        [theme.breakpoints.up("md")]: {
            margin: "0 10px 0",
        },
    },
    downloadButtonContainer: {},
    downloadButtonText: {
        fontWeight: 600,
        fontSize: 16,
        /* or 19px */
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        color: "#FFFFFF",
        marginLeft: 8,
    },
    pictureContainer: {
        marginTop: 10,
        overflow: "hidden",
        margin: "0 -25px",
        flexBasis: "unset",
        maxWidth: "unset",
        width: "100vw",
        display: "flex",
    },
    picture: {
        position: "relative",
        width: 548,
        margin: "0 auto",
        [theme.breakpoints.up("md")]: {
            marginTop: 20,
            width: 756,
        },
    },
    footerIcon: {
        margin: 8,
    },
    footerLink: {
        margin: 8,
    },
    footerIconContainer: {
        display: "flex",
        justifyContent: "center",
    },
}));

const Index = () => {
    const classes = useClasses();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} className={`${classes.header} text-green-400`}>
                Undercard is now Rec
            </Grid>
            <Grid item container className={classes.body} xs={12}>
                <Grid
                    item
                    xs={12}
                    className={classes.logoContainer}
                    container
                    justify="center"
                >
                    <Image
                        src="/static/img/Vector.svg"
                        width={isMobile ? 75 : 97}
                        height={isMobile ? 28 : 36}
                        className={classes.logo}
                    />
                </Grid>
                <Grid item xs={12} className="flex justify-center">
                    <h1 className="text-6xl sm:text-7xl max-w-lg text-center mb-10 font-bold">
                        Find your next group class
                    </h1>
                </Grid>
                <Grid item xs={12} className="flex justify-center">
                    <p className="mb-10 text-xl max-w-lg text-center">
                        Workout directly with trainers in your area, no
                        memberships required.
                    </p>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    container
                    justify={isMobile ? "center" : "flex-end"}
                    className={classes.downloadButtonContainer}
                >
                    <Grid item>
                        <a
                            href="https://apps.apple.com/us/app/undercard/id1550884834"
                            className={classes.downloadButton}
                        >
                            <Image
                                src="/static/img/apple.svg"
                                height="20"
                                width="22"
                            />
                            <span className={classes.downloadButtonText}>
                                Download on the App Store
                            </span>
                        </a>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    container
                    justify={isMobile ? "center" : "flex-start"}
                >
                    <Grid item>
                        <a
                            href="https://play.google.com/store/apps/details?id=com.undercard_18898"
                            className={classes.downloadButton}
                        >
                            <Image
                                src="/static/img/google.svg"
                                height="20"
                                width="22"
                            />
                            <span className={classes.downloadButtonText}>
                                Get it on Google Play
                            </span>
                        </a>
                    </Grid>
                </Grid>

                <Grid item className={classes.pictureContainer} xs={12}>
                    <div className={classes.picture}>
                        <Image
                            src="/static/img/Rec-heroimage.jpg"
                            width={756}
                            height={500}
                            layout="responsive"
                            objectFit="cover"
                            objectPosition="center center"
                        />
                    </div>
                </Grid>
            </Grid>
            <Grid
                item
                container
                className={classes.footer}
                justify="center"
                alignContent="center"
            >
                <Grid
                    item
                    container
                    xs={12}
                    justify="center"
                    alignContent="center"
                    direction={isMobile ? "column" : "row"}
                >
                    <div className={classes.footerIconContainer}>
                        <a
                            href="https://www.instagram.com/recesswithrec"
                            className={classes.footerIcon}
                        >
                            <Image
                                src="/static/img/instagram_icon.svg"
                                width="20"
                                height="20"
                            />
                        </a>
                        <a
                            href="https://www.twitter.com/recesswithrec"
                            className={classes.footerIcon}
                        >
                            <Image
                                src="/static/img/twitter_icon.svg"
                                width="20"
                                height="20"
                                className={classes.footerIcon}
                            />
                        </a>
                    </div>

                    <Link href="/privacy-policy">
                        <a className={`${classes.link} ${classes.footerLink}`}>
                            Privacy Policy
                        </a>
                    </Link>
                    <Link href="/contact-us">
                        <a className={`${classes.link} ${classes.footerLink}`}>
                            Contact Us
                        </a>
                    </Link>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Index;
