import React from "react";
import TempFooter from "../components/TempFooter";

import { Navbar, CONTAINER_CLASSNAME } from "../components/Navbar";

const ContactUs = () => {
    return (
        <div className="wrapper">
            <Navbar />
            <div className={`${CONTAINER_CLASSNAME} h-screen`}>
                <p className="mt-24 text-xl">
                    For all questions about Rec and inquiries about becoming a
                    trainer on our platform, please email us:{" "}
                    <a
                        href="mailto:hi@getrec.com"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold"
                    >
                        hi@getrec.com
                    </a>
                </p>
                <div className="mt-24">
                    <TempFooter></TempFooter>
                </div>
            </div>
        </div>
    );
};
export default ContactUs;
