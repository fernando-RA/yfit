import React, { useState } from "react";

const Form = ({ setFormSuccessFill = (f) => f }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleOnsbumit = (e) => {
        e.preventDefault();
        if (
            firstName === "" ||
            firstName.length < 2 ||
            firstName.trim() === ""
        ) {
            window.alert("Please enter valid First Name");
            return;
        }
        if (lastName === "" || lastName.length < 2 || lastName.trim() === "") {
            window.alert("Please enter valid Last Name");
            return;
        }
        if (!String(email).includes("@", 0)) {
            window.alert("Please enter valid Email");
            return;
        }
        if (phoneNumber.length < 6) {
            window.alert("Please enter Phone Number");
            return;
        }

        try {
            const sendData = async () => {
                try {
                    await fetch(
                        "https://undercard-staging.herokuapp.com/api/v1/landing_page/create_ambassador/",
                        {
                            method: "POST",
                            body: JSON.stringify({
                                first_name: firstName,
                                last_name: lastName,
                                email,
                                phone_number: phoneNumber,
                            }),
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                        },
                    );
                    setFormSuccessFill(true);

                    window.alert("Submitted successfully.");
                } catch (error) {
                    console.error(error);
                    window.alert(
                        "Error submitting your responses. Please check your connection and try again...",
                    );
                }
            };
            sendData();
        } catch (error) {
            console.error(error);
            window.alert(
                "Error submitting your responses. Please check your connection and try again...",
            );
        }
    };

    return (
        <div id="signup" className="rec-center-wrapper">
            <div className="rec-center">
                <div className="rec-center-intro">
                    <h1>Join Rec Center</h1>
                </div>
                <div className="rec-center-content">
                    <div className="rec-center-introlargescreen">
                        <h1>Join Rec</h1>
                    </div>
                    <p style={{ color: "#fff" }}>
                        As an ambassador, you’ll trailblaze the Rec community
                        and help pilot our app. In return, you’ll get full
                        support from our team, including:{" "}
                    </p>
                    <ul>
                        <li>Personal brand development</li>
                        <li>Professional headshots </li>
                        <li>Community growth coaching</li>
                        <li>No processing fees</li>
                        <li>Access to indoor training spaces</li>
                    </ul>
                </div>
                <div className="rec-center-form">
                    <form onSubmit={(e) => handleOnsbumit(e)}>
                        <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            type="text"
                            name=""
                            id=""
                            placeholder="First name"
                        />
                        <input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            type="text"
                            name=""
                            id=""
                            placeholder="Last name"
                        />
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            name=""
                            id=""
                            placeholder="Email address"
                            required
                        />
                        <input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            type="text"
                            name=""
                            id=""
                            placeholder="Phone Number"
                        />
                        <button>Apply</button>
                    </form>
                </div>
                <p className="center-word">Built by trainers, for trainers.</p>
            </div>
        </div>
    );
};

export default Form;
