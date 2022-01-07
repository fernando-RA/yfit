import React from "react";
import { Helmet } from "react-helmet";

function Head() {
    return (
        <div>
            <Helmet>
                <title>Rec</title>
                <meta name="title" content="Rec" />
                <meta
                    name="description"
                    content={`Work out with professional trainers in your area. With Rec, getting a good workout has never been easier, safer or more fun. Boxing, yoga, HIIT, strength training and more – Undercard connects you to New York City’s best trainers. Download the app for free and get started.

• Easily find and book training sessions with professional trainers in your neighborhood

• Choose the location that’s best and safest for you: outside, rooftop, private gym space, etc

• Different types of training sessions allow you to work within you budget

• Message trainers, schedule sessions and pay directly within the app

• Save on monthly subscriptions with your favorite trainers• Explore new workouts in your area every time you open the app

Rec is available in New York City and growing. Download the app and book your next workout today.`}
                />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://undercard.app/" />
                <meta property="og:title" content="Rec" />
                <meta
                    property="og:description"
                    content={`Work out with professional trainers in your area. With Rec, getting a good workout has never been easier, safer or more fun. Boxing, yoga, HIIT, strength training and more – Undercard connects you to New York City’s best trainers. Download the app for free and get started.

• Easily find and book training sessions with professional trainers in your neighborhood

• Choose the location that’s best and safest for you: outside, rooftop, private gym space, etc

• Different types of training sessions allow you to work within you budget

• Message trainers, schedule sessions and pay directly within the app

• Save on monthly subscriptions with your favorite trainers• Explore new workouts in your area every time you open the app

Rec is available in New York City and growing. Download the app and book your next workout today.`}
                />
                <meta
                    property="og:image"
                    content={process.env.PUBLIC_URL + "/header.png"}
                />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://undercard.app/" />
                <meta property="twitter:title" content="Rec" />
                <meta
                    property="twitter:description"
                    content={`Work out with professional trainers in your area. With Rec, getting a good workout has never been easier, safer or more fun. Boxing, yoga, HIIT, strength training and more – Undercard connects you to New York City’s best trainers. Download the app for free and get started.

• Easily find and book training sessions with professional trainers in your neighborhood

• Choose the location that’s best and safest for you: outside, rooftop, private gym space, etc

• Different types of training sessions allow you to work within you budget

• Message trainers, schedule sessions and pay directly within the app

• Save on monthly subscriptions with your favorite trainers• Explore new workouts in your area every time you open the app

Rec is available in New York City and growing. Download the app and book your next workout today.`}
                />
                <meta
                    property="twitter:image"
                    content={process.env.PUBLIC_URL + "/header.png"}
                />
            </Helmet>
        </div>
    );
}

export default Head;
