import React from "react";

import Account from "../../Details/components/Header/components/Account";

import moment from "moment-timezone";
import makeStyles from "@material-ui/core/styles/makeStyles";
const useStyles = makeStyles({
    paddingInvite: {
        paddingBottom: "10px",
        paddingTop: "10px",
    },
});

const Main = (props) => {
    const classes = useStyles();
    const classData = props.classData.classData;

    const timeZone = moment.tz
        .zone(moment.tz.guess())
        .abbr(new Date().getTimezoneOffset());

    return (
        <div className={"trainer-class-body text-white"}>
            <div className="class-body-top-container">
                <p className="mb-3 mt-6">Get ready for</p>
                <h2 className="my-3 text-2xl font-bold">{classData.name}</h2>
                <p className="my-3 text-lg">
                    {`${moment(classData.start_time).format(
                        "ddd, MMM DD - hh:mma",
                    )} ${timeZone}`}
                    ,{` ${classData.duration}min`}
                </p>
            </div>

            <Account
                image={classData.author.profile_picture}
                firstName={classData.author.first_name}
                lastName={classData.author.last_name}
                workoutTypes={classData.author.workout_types}
            />
            <div className="info-container">
                <h6 className={classes.paddingInvite}>
                    Reservation details sent to:
                </h6>
                <p>{props.emailAddress}</p>
                <h6 className={classes.paddingInvite}>What happens now?</h6>
                <p>
                    Your spot details have been sent to your email and you will
                    receive a reminder email 12 hours before class. Please show
                    up 5-10 minutes before the class.
                </p>
                {/* <h6>Cancelation policy</h6>
        <p>
          You can cancel up to 24 hours before class for a full refund.
          Cancellations within 24 hours of a class will receive a 50% refund.
        </p> */}
            </div>

            {/* <div className="find-more-classes">
        <h6>Create an Undercard account</h6>
        <p>Find more classes and check out faster</p>
        <button className="find-more-classes-button">
          Sign in with Google
        </button>
      </div> */}

            <div className="invite-link-container class-body-top-container">
                <h6 className={classes.paddingInvite}>Invite your friends</h6>
                <div className="invite-friends-form-container">
                    <input
                        type="text"
                        className="invite-friends-input"
                        value={`${classData.class_link}`}
                        disabled
                    />
                    <button
                        className={"invite-copy"}
                        onClick={() =>
                            navigator.clipboard.writeText(
                                `${classData.class_link}`,
                            )
                        }
                    >
                        Copy
                    </button>
                </div>
                {/* <p>Find more classes and check out faster</p> */}
                {/* <button className="find-more-classes-button">Sign in with Google</button> */}
                {/* <div className="social-media-icon-container">
          <img src={insagramIcon} alt="" />
          <img src={facebookIcon} alt="" />
          <img src={twitterIcon} alt="" />
        </div> */}
            </div>
        </div>
    );
};

export default Main;
