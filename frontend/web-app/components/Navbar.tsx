import React from "react";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";

import Logo from "../public/static/img/Vector.svg";

// TODO Abstract into a container component?
export const CONTAINER_CLASSNAME = "max-w-screen-xl mx-auto px-3";

export const Navbar: React.FC<{ backUrl?: string }> = ({ backUrl }) => (
    <div className="w-full border-b border-gray-300">
        <div className={`${CONTAINER_CLASSNAME} flex justify-center`}>
            <div className="w-full relative flex justify-between items-center py-5">
                {backUrl !== undefined && (
                    <Link href={backUrl}>
                        <div className="flex items-center hover:underline cursor-pointer">
                            <HiOutlineArrowNarrowLeft className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold ml-2">Back</span>
                        </div>
                    </Link>
                )}
                <Link href="/">
                    <Image src={Logo} className="cursor-pointer" />
                </Link>
            </div>
        </div>
    </div>
);
