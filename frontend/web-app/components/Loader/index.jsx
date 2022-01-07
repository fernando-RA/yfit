import React from "react";
import { CircularProgress } from "@material-ui/core";

const Loader = () => {
    return (
        <div className="loader-container">
            <CircularProgress color="inherit" size={40} />
        </div>
    );
};

export default Loader;
