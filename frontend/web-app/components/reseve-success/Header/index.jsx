import React, { Component } from "react";
import Image from "next/image";

const Header = () => (
    <>
        <div className="class-header">
            <div className="header-container">
                <Image
                    src={"/static/img/check_green.png"}
                    width="111"
                    height="111"
                    alt="done"
                />
                <h1 className={"class-trainer-title"}>You’re in!</h1>
            </div>
        </div>
    </>
);

export default Header;
