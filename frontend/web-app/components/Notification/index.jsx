import React from "react";
import checkIcon from "../../static/img/check_icon.png";

const Notification = (props) => {
    return (
        <div className="success-notificantion">
            <div className="success-text-notification">
                <img src={checkIcon} alt="" /> Your reservation has been
                cancelled
            </div>
        </div>
    );
};

export default Notification;
