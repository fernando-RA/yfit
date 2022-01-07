import React from "react";

import Link from "next/link";

const Account = (props) => {
    return (
        <div className="account">
            <img src={props.image} alt="avatar image" className="avatar" />
            <div className="account-info-container">
                <a className="name" href={`${props.profileLink}`}>
                    {props.firstName} {props.lastName}
                </a>

                <p className="description">
                    {props.workoutTypes
                        .map((type) => type.workout_type)
                        .join(" + ")}
                </p>
            </div>
        </div>
    );
};

export default Account;
