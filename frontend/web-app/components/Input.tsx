/* eslint-disable react/display-name */
import styles from "./input.module.css";

import React, { InputHTMLAttributes } from "react";
import classNames from "classnames";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    // Custom
    label: string;
    isInvalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            label,
            isInvalid = false,
            name,
            id,
            type = "text",
            onBlur,
            ...props
        },
        ref,
    ) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const inputRef = React.useRef<HTMLInputElement | null>(null);
        const isEmpty =
            inputRef?.current?.value === undefined ||
            inputRef?.current?.value === "" ||
            inputRef?.current?.value === null;

        return (
            <div className={styles.container}>
                <input
                    id={id}
                    type={type}
                    name={name}
                    className={classNames(styles.base, {
                        [styles.empty]: isEmpty,
                        [styles.invalid]: isInvalid && !isFocused,
                        [styles.focused]: isFocused,
                    })}
                    ref={(e) => {
                        inputRef.current = e;
                        return ref;
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        setIsFocused(false);
                        // NOTE Trigger onBlur from react-hook-form, if one
                        if (onBlur !== undefined) {
                            onBlur(e);
                        }
                    }}
                    {...props}
                />
                <label className={styles.label}>{label}</label>
            </div>
        );
    },
);
