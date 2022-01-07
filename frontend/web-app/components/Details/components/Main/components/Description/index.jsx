import React from "react";
import Map from "./components/Map";
import moment from "moment-timezone";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    paddingInvite: {
        paddingBottom: "15px",
        paddingTop: "20px",
    },
});

export const POLICY = [
    {
        value: "flexible",
        text1: "Full refund up to 12 hours before class.",
        text2: "50% refund after 12 hours before class.",
    },
    {
        value: "moderate",
        text1: "Full refund up to 24 hours before class.",
        text2: "50% refund after 24 hours before class.",
    },
    {
        value: "strict",
        text1: "Full refund up to 24 hours before class.",
        text2: "No refund after 24 hours before class.",
    },
];

const SpotsRemaining = ({
    event: {
        is_attendee_limit,
        attend_limit_count,
        clients,
        canceled,
        start_time,
    },
}) => {
    const isSoldout = is_attendee_limit && attend_limit_count - clients === 0;
    const isExpired = moment().isAfter(moment(start_time));
    const isCanceled = canceled;

    if (isCanceled || isSoldout || isExpired) {
        return (
            <span className="ml-5">
                {isCanceled && "Canceled"}
                {isSoldout && "Sold out"}
                {isExpired && "Class closed"}
            </span>
        );
    }

    /* TODO Refactor all the possible states below; very confusing atm */
    return (
        <React.Fragment>
            <span className="ml-5">
                {!is_attendee_limit && (
                    <span className="text-green-400 font-bold">
                        {" "}
                        Spots remaining{" "}
                    </span>
                )}
                {is_attendee_limit &&
                    attend_limit_count - clients >= 4 &&
                    `${attend_limit_count - clients} spots remaining`}
            </span>
            {is_attendee_limit &&
                attend_limit_count - clients < 4 &&
                attend_limit_count - clients > 0 && (
                    <span className="text-green-400 font-bold">
                        {attend_limit_count - clients > 0
                            ? attend_limit_count - clients
                            : null}{" "}
                        {attend_limit_count - clients === 1
                            ? " spot remaining!"
                            : " spots remaining!"}
                    </span>
                )}
        </React.Fragment>
    );
};

const Description = (props) => {
    const classes = useStyles();
    const { classData } = props;
    const [showMore, setShowMore] = React.useState(false);

    const timeZone = moment.tz
        .zone(moment.tz.guess())
        .abbr(new Date().getTimezoneOffset());

    return (
        <>
            <div className="description-container">
                <div className="place-info-container">
                    <div className="location">
                        <img
                            src="/static/img/pin.svg"
                            alt="Location pin drop"
                            width="20"
                            height="20"
                        />
                        <span className="ml-5">
                            {classData?.location?.location_name
                                ? classData.location.location_name
                                : "Virtual"}
                        </span>
                    </div>
                    <div className="booked">
                        <img
                            src="/static/img/person.svg"
                            alt="person"
                            width="20"
                            height="20"
                        />
                        <SpotsRemaining event={classData} />
                    </div>
                    <div className="time">
                        <img
                            src={"/static/img/calendar.svg"}
                            alt="duration"
                            width="20"
                            height="20"
                        />
                        <span className="ml-5">
                            {`${moment(classData.start_time).format(
                                "ddd, MMM DD - hh:mma",
                            )} ${timeZone}`}
                            ,{` ${classData.duration}min`}
                        </span>
                    </div>
                </div>
                <h3 className="title">Equipment</h3>
                <p className="text">{classData.equipment}</p>
                <h3 className="title">Class Type</h3>
                <p className="text">{classData.tags.join(", ")}</p>
            </div>
            <div className="descr-container">
                <p className="text">
                    {showMore
                        ? classData.details
                        : `${classData.details.slice(0, 150)}${
                              classData.details.length > 150 ? "..." : ""
                          }`}
                </p>
                {classData.details.length > 150 && (
                    <button
                        className="link show-more-btn"
                        onClick={() =>
                            showMore ? setShowMore(false) : setShowMore(true)
                        }
                    >
                        {showMore ? "Hide" : "Show more"}
                    </button>
                )}
            </div>
            {classData.type === "virtual" ? (
                <div className="virtual-class-container">
                    <h3 className="title">Location</h3>
                    <p className="text">Virtual class</p>
                    <p className="text">
                        You will receive an email 6 hours before class with a
                        with virtual class details. If you sign up within the 6
                        hour window you will receive the email immediately.
                    </p>
                </div>
            ) : (
                <Map classData={classData} />
            )}

            <div className="container">
                <h6 className="title">Cancellation policy</h6>
                <p className="text">
                    {/* {POLICY.find(
            (policy) => policy.value === classData.cancellation_policy
          )?.text1 || POLICY[0].text1} */}
                    Speak with your trainer before class.
                </p>
            </div>
            {classData.type === "virtual" ? (
                ""
            ) : (
                <div className="container">
                    <h6 className="title">Health & Safety</h6>
                    <p className="text">{classData.safety_protocol}</p>
                </div>
            )}

            <div className="invite-link-container class-body-top-container">
                <h6 className={classes.paddingInvite}>Invite your friends</h6>
                <div className="invite-friends-form-container">
                    <input
                        type="text"
                        className="invite-friends-input"
                        value={`${classData.class_link}`}
                        disabled
                    />
                    <div
                        variant="outlined"
                        className={"invite-copy"}
                        onClick={() =>
                            navigator.clipboard.writeText(
                                `${classData.class_link}`,
                            )
                        }
                    >
                        Copy
                    </div>
                </div>
            </div>
        </>
    );
};

export default Description;
