import React from "react";
import { CircularProgress } from "@material-ui/core";

const ErrorComponent = (props) => {
    return (
        <div className="error-container">
            <span className="error-text">SOMETHING GOING WRONG...</span>
            <button
                disabled={props.disabled}
                className="error-button"
                onClick={props.onPress}
            >
                {props.loading ? (
                    <CircularProgress color="inherit" size={18} />
                ) : (
                    "TRY AGAIN"
                )}
            </button>
        </div>
    );
};

export default ErrorComponent;
