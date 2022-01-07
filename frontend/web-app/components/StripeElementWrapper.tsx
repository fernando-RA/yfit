import styles from "./input.module.css";

import React from "react";

const STRIPE_ELEMENT_OPTIONS = {
    style: {
        base: {
            "::placeholder": {
                color: "transparent",
            },
            ":-webkit-autofill": {
                backgroundColor: "transparent",
            },
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 400,
        },
        invalid: {
            color: "#111827", // Gray-900
        },
    },
    classes: {
        base: styles.base,
        focus: styles.focused,
        empty: styles.empty,
        invalid: styles.invalid,
    },
};

export const StripeElementWrapper = ({
    Element,
    label,
    onChange,
}: {
    // TODO Update types
    Element: any;
    label: string;
    onChange: (e: any) => void;
}) => {
    return (
        <div className={styles.container}>
            <Element options={STRIPE_ELEMENT_OPTIONS} onChange={onChange} />
            <label className={styles.label}>{label}</label>
        </div>
    );
};
