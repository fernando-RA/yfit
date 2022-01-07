/* eslint-disable react/display-name */
import React from "react";
import classNames from "classnames";
import { HiCheck } from "react-icons/hi";

type CheckboxInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const CheckboxInput = React.forwardRef<
    HTMLInputElement,
    CheckboxInputProps
>(({ children, onChange, value, className = "", ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(false);

    return (
        <label className={`${className} flex justify-start gap-3`}>
            <span
                className={classNames(
                    "h-7 w-7 border rounded border-blue-600 relative flex-shrink-0 flex-grow-0",
                    {
                        "bg-blue-600": isChecked,
                    },
                )}
            >
                {isChecked && (
                    <HiCheck className="text-white inline absolute h-6 w-6 top-0 left-0 right-0 bottom-0" />
                )}
            </span>
            <span className="font-light text-sm text-gray-500">{children}</span>
            <input
                className="hidden"
                type="checkbox"
                value={value}
                onChange={(e) => {
                    setIsChecked(e.target.checked);
                    if (onChange) {
                        onChange(e);
                    }
                }}
                ref={ref}
                {...props}
            />
        </label>
    );
});
