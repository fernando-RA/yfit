/* eslint-disable react/no-children-prop */
import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.InputHTMLAttributes<HTMLButtonElement> {
    as?: React.ElementType;
}

export const Button: React.FC<ButtonProps> = ({
    as = "button",
    className = "",
    children,
    ...props
}) => {
    return React.createElement(as, {
        className: classNames(
            `${className} focus:outline-none text-black py-2.5 px-7 rounded-full font-semibold`,
            {
                "bg-green-400 hover:bg-green-600 cursor-pointer hover:shadow":
                    !props.disabled,
                "bg-gray-400 cursor-not-allowed": props.disabled,
            },
        ),
        ...props,
        children,
    });
};
