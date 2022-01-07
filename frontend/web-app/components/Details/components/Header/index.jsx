import React, { Component } from "react";
import { useSelector } from "react-redux";

import Account from "./components/Account";

const Header = () => {
    const author = useSelector((RXState) => RXState.classData.classData.author);
    const className = useSelector(
        (RXState) => RXState.classData.classData.name,
    );
    const featured_photo = useSelector(
        (RXState) => RXState.classData.classData.featured_photo,
    );

    return (
        <div
            className={"header"}
            style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${featured_photo})`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
            }}
        >
            <h1 className="font-bold">{className}</h1>
            <Account
                image={author.profile_picture}
                firstName={author.first_name}
                lastName={author.last_name}
                workoutTypes={author.workout_types}
                profileLink={author.trainer_link}
            />
        </div>
    );
};

export default Header;
