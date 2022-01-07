/* eslint-disable react/display-name */
import styles from "./select.module.css";

import React from "react";
import classNames from "classnames";

const DEFAULT_STYLES =
    "block appearance-none px-3 py-2 text-black relative bg-transparent rounded border border-gray-400 hover:border-gray-700 focus:border-gray-700 outline-none focus:outline-none w-full";

export const Select = React.forwardRef<
    HTMLSelectElement,
    {
        value?: string | number;
        options: Array<{ label: string; value: string | number }>;
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
        name: string;
        placeholder?: string;
        className?: string;
    }
>(
    (
        {
            value,
            options,
            onChange,
            name,
            placeholder = "Select value...",
            className = "",
        },
        ref,
    ) => {
        return (
            <div className={styles.select}>
                <select
                    name={name}
                    className={classNames(`${DEFAULT_STYLES} ${className}`, {
                        "text-gray-400": value === null,
                    })}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                >
                    {/* @ts-ignore */}
                    <option disabled hidden value={value === null}>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    },
);
