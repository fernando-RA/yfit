import React from "react";
import { useSelector } from "react-redux";

import { AdditionalClasses } from "../../../AdditionalClasses";
import Description from "./components/Description";

const Main = () => {
    const data = useSelector((RXState) => RXState.classData);
    const { classData, trainerData } = data ?? {};

    return (
        <>
            <Description classData={classData} />
            <AdditionalClasses events={trainerData?.trainerClasses} />
        </>
    );
};

export default Main;
