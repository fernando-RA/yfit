import React from "react";
import Link from "next/link";
import Image from "next/image";

import Logo from "../public/static/img/Vector.svg";

const TempFooter = () => {
    return (
        <div className="bg-gray-200 w-full flex items-center justify-between">
            <div>
                <Link href="/contact-us">
                    <span className="underline">Contact Us</span>
                </Link>
                <Link href="/privacy-policy">
                    <span className="ml-3 underline">Privacy Policy</span>
                </Link>
            </div>
            <div>
                <Image src={Logo} />
            </div>
        </div>
    );
};

export default TempFooter;
