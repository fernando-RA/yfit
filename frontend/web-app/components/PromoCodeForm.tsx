import React from "react";

import { Input } from "./Input";

export const PromoCodeForm: React.FC<{ onValidSubmit: (data: any) => void }> =
    ({ onValidSubmit }) => {
        const [promoCode, setPromoCode] = React.useState("");
        const [isSubmitting, setIsSubmitting] = React.useState(false);

        const onSubmit = React.useCallback(async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            console.log(`Submitting ${promoCode}`);
            await new Promise((r) =>
                setTimeout(() => {
                    r("Fake promise");
                }, 3000),
            );

            setIsSubmitting(false);

            // TODO if a valid promo, apply the callback onValidSubmit
        }, []);

        // HACK Not a form element because used with in another form
        // TODO Is there a better solution? Hack right now
        // TODO Add invalid and valid states after promo submission
        return (
            <div className="flex gap-2">
                <Input
                    label="Promo code"
                    name="promo_code"
                    id="promo_code"
                    value={promoCode}
                    onChange={(e) => {
                        setPromoCode(e.target.value);
                    }}
                />
                {isSubmitting ? (
                    <span className="font-light">Applying...</span>
                ) : (
                    <button
                        className="underline bg-transparent font-light"
                        onClick={onSubmit}
                        disabled={promoCode === ""}
                    >
                        Apply code
                    </button>
                )}
            </div>
        );
    };
