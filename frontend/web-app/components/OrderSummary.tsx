import React from "react";

const REC_SERVICE_FEE = 0.1;

// TODO Improved error validation especially if price/count are missing
// NOTE Product requirements have us disabling service fee temp
export const calcNetPriceInCents = (price: string, count: number): number => {
    // const netPrice =
    //     parseFloat(price) * count * REC_SERVICE_FEE + parseFloat(price) * count;
    const netPrice = parseFloat(price) * count;
    return netPrice * 100; // Convert to cents
};

export const OrderSummary = ({
    count,
    price,
}: {
    count: number;
    price: string;
}) => {
    const localizedPrice = parseFloat(price).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

    const localizedTotalPrice = (parseFloat(price) * count).toLocaleString(
        "en-US",
        { style: "currency", currency: "USD" },
    );

    const localizedServiceFee = (
        parseFloat(price) *
        count *
        REC_SERVICE_FEE
    ).toLocaleString("en-US", { style: "currency", currency: "USD" });

    const localizedNetPrice = (
        calcNetPriceInCents(price, count) / 100
    ).toLocaleString("en-US", { style: "currency", currency: "USD" });

    return (
        <React.Fragment>
            <h4 className="font-semibold mb-2">Order Summary</h4>
            <div className="flex justify-between mb-3">
                <span>{`${localizedPrice} x ${count} adult`}</span>
                <span>{localizedTotalPrice}</span>
            </div>

            <div className="flex justify-between mb-3">
                <span>{`${REC_SERVICE_FEE * 100}% Service fee:`}</span>
                <span>{localizedServiceFee}</span>
            </div>

            <div className="flex justify-between mb-3">
                <span>Discount:</span>
                <span>{`-${localizedServiceFee}`}</span>
            </div>

            <div className="flex justify-between border-t-2 border-gray-300 mt-3 pt-3">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{localizedNetPrice}</span>
            </div>
        </React.Fragment>
    );
};
