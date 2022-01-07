import React from "react";
import Image from "next/image";

const Footer = () => (
    <div className="footer-container bg-white pb-32">
        <div className="border-b-none mx-4">
            <h3 className="title">What is Rec?</h3>
            <p className="descr">
                Rec connects you to the best trainers in your area – no gym
                membership required. Find online or in-person classes and start
                training today.
            </p>
            <p className="sub-descr">
                Find classes near you that fit your schedule in our app.
            </p>
            <div className="footer-button-container">
                <a
                    className="footer-button"
                    href="https://apps.apple.com/by/app/undercard/id1550884834"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Image
                        src={"/static/img/apple.png"}
                        alt="apple icon"
                        width="18"
                        height="22"
                    />
                    <span>App Store</span>
                </a>
                <a
                    className="footer-button"
                    href="https://play.google.com/store/apps/details?id=com.undercard_18898"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Image
                        src={"/static/img/android.png"}
                        alt="android icon"
                        width="18"
                        height="22"
                    />{" "}
                    <span>Google Play</span>
                </a>
            </div>
        </div>
    </div>
);

export default Footer;
