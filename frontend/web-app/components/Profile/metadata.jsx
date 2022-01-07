import React from "react";
import Head from "next/head";

function Metadata(props) {
    const { name, link, desc, photo } = props;
    return (
        <Head>
            <title>{name}</title>
            <meta name="title" content={link} />
            <meta name="description" content={desc} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={link} />
            <meta property="og:title" content={name} />
            <meta property="og:description" content={desc} />
            <meta property="og:image" content={photo} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={link} />
            <meta property="twitter:title" content={name} />
            <meta property="twitter:description" content={desc} />
            <meta property="twitter:image" content={photo} />
        </Head>
    );
}

export default Metadata;
