import React from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import {
    useElements,
    useStripe,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import { useForm, Controller } from "react-hook-form";
import { Transition } from "@headlessui/react";
import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import * as Sentry from "@sentry/nextjs";

import { Button } from "../components/Button";
import { CheckboxInput } from "../components/CheckboxInput";
import { Input } from "../components/Input";
// import { PromoCodeForm } from "../components/PromoCodeForm";
import { Select } from "../components/Select";
import { StripeElementWrapper } from "./StripeElementWrapper";
import { request } from "../api/http";
import { calcNetPriceInCents, OrderSummary } from "./OrderSummary";

import type { Event } from "../types/event.types";

const postPaymentIntent = (data: {
    trainer_stripe_customer_id: string;
    amount_cents: number;
    stripe_customer_id?: string;
}): Promise<
    AxiosResponse<{
        client_secret: string;
        customer_id: string;
        ephemeral_key: string;
        payment_intent_id: string;
    }>
> => request.post("/api/v1/payment/payment_intent/", data);

const postClientRegistration = (
    eventId: Event["id"],
    data: {
        agree_to_safety_waiver: boolean;
        email_address: string;
        first_name: string;
        last_name: string;
        payment_intent_id?: string; // Can be optional if free class
        spots_count: number;
        // subscribe_to_emails: boolean;
        phone_number?: string;
        promo_code?: string;
    },
): Promise<AxiosResponse<any>> =>
    request.post(`/api/v1/client-class/${eventId}/`, data);

const ErrorMessage: React.FC<{ show: boolean; message: string }> = ({
    show,
    message,
}) => (
    <Transition
        show={show}
        enter="transition-opacity duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
    >
        <p className="text-red-600 text-xs mb-2">{message}</p>
    </Transition>
);

export const CheckoutForm: React.FC<{ event: Event }> = ({ event }) => {
    const {
        control,
        handleSubmit,
        register,
        watch,
        formState: { isDirty, isSubmitting, errors },
    } = useForm({
        defaultValues: {
            // TODO Update with actual form keys
            email_address: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            // subscribe_to_emails: false,
            agree_to_safety_waiver: false,
            spots_count: 1,
            postal_code: "",
        },
    });

    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const spotsCount = watch("spots_count");
    const [requestError, setRequestError] = React.useState("");
    const [stripeElementCompleteState, setStripeElementCompleteState] =
        React.useState({
            cardNumber: false,
            cardExpiry: false,
            cardCvc: false,
        });
    const isClassFree = React.useMemo(
        () => parseInt(event.price, 10) === 0,
        [event.price],
    );

    const onSubmitPaidClass = React.useCallback(
        async (data) => {
            console.log("Submitting for paid class", data);
            if (!stripe || !elements) {
                Sentry.captureMessage(
                    JSON.stringify({
                        formData: data,
                        error: "Stripe could not be loaded on to the webpage.",
                    }),
                );
                setRequestError(
                    "There was an error checking out for this class.",
                );
                return;
            }

            const {
                data: {
                    payment_intent_id: paymentIntentId,
                    client_secret: clientSecret,
                },
                status: paymentIntentStatus,
            } = await postPaymentIntent({
                trainer_stripe_customer_id: event.author.stripe_account_id,
                amount_cents: calcNetPriceInCents(event.price, spotsCount),
            });

            if (paymentIntentStatus !== 200) {
                Sentry.captureMessage(
                    JSON.stringify({
                        formData: data,
                        error: "There was an error processing payment.",
                    }),
                );
                setRequestError("There was an error processing payment.");
                return;
            }

            try {
                await postClientRegistration(event.id, {
                    payment_intent_id: paymentIntentId,
                    agree_to_safety_waiver: data.agree_to_safety_waiver,
                    email_address: data.email_address,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    phone_number: data.phone_number,
                    spots_count: parseInt(data.spots_count, 10),
                    // subscribe_to_emails: data.subscribe_to_emails,
                });
            } catch (e) {
                Sentry.captureMessage(
                    JSON.stringify({
                        formData: data,
                        error: e.response.data.detail,
                    }),
                );
                setRequestError(e.response.data.detail);
                return;
            }

            const { error: confirmationError } =
                await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement)!,
                        billing_details: {
                            name: `${data.first_name} ${data.last_name}`,
                            address: {
                                postal_code: data.postal_code,
                            },
                        },
                    },
                });

            if (confirmationError) {
                Sentry.captureMessage(
                    JSON.stringify({
                        formData: data,
                        error: "Stripe could not confirm payment.",
                    }),
                );
                setRequestError("There was an error confirming payment.");
                return;
            }

            // NOTE Clear out the error messages
            setRequestError("");

            router.push(
                `/reserve-success?slug=${event.slug}&email_address=${data.email_address}`,
            );
        },
        [
            stripe,
            elements,
            event.author.stripe_account_id,
            event.id,
            event.slug,
            event.price,
            spotsCount,
            setRequestError,
        ],
    );

    const onSubmitFreeClass = React.useCallback(
        async (data) => {
            console.log("Submitting for free class", data);
            try {
                await postClientRegistration(event.id, {
                    agree_to_safety_waiver: data.agree_to_safety_waiver,
                    email_address: data.email_address,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    phone_number: data.phone_number,
                    spots_count: parseInt(data.spots_count, 10),
                    // subscribe_to_emails: data.subscribe_to_emails,
                });
            } catch (e) {
                Sentry.captureMessage(
                    JSON.stringify({
                        formData: data,
                        error: e.response.data.detail,
                    }),
                );
                setRequestError(e.response.data.detail);
                return;
            }

            // NOTE Clear out the error messages
            setRequestError("");

            router.push(
                `/reserve-success?slug=${event.slug}&email_address=${data.email_address}`,
            );
        },
        [event.id, event.slug, setRequestError],
    );

    return (
        <form
            onSubmit={handleSubmit(
                isClassFree ? onSubmitFreeClass : onSubmitPaidClass,
            )}
            className="grid grid-cols-1 md:grid-cols-8 md:gap-4"
        >
            <div className="col-auto md:col-span-5 md:max-w-xl">
                <div className="py-3 md:hidden border-b border-gray-300">
                    <h1 className="font-semibold">{event.name}</h1>
                    <h2 className="font-light">{`with ${event.author.first_name} ${event.author.last_name}`}</h2>
                    <h3 className="font-light">
                        {moment(event.start_time).format("dddd, MMM D h:mm a")}
                    </h3>
                </div>
                <div className="py-3 md:py-6 border-b border-gray-300">
                    <label
                        className="mb-2 block font-semibold"
                        htmlFor="attendees"
                    >
                        Attendees
                    </label>
                    <Controller
                        render={({ field }) => (
                            <Select
                                options={[
                                    { value: 1, label: "1 attendee" },
                                    { value: 2, label: "2 attendees" },
                                    { value: 3, label: "3 attendees" },
                                ]}
                                placeholder="Select number of attendees..."
                                {...field}
                            />
                        )}
                        name="spots_count"
                        control={control}
                        rules={{ required: true }}
                    />
                    <ErrorMessage
                        show={errors.spots_count?.type === "required"}
                        message="Number of attendees is required."
                    />
                </div>

                <div className="py-3 md:py-5 border-b border-gray-300">
                    <h4 className="font-semibold mb-2 md:mb-4">Contact info</h4>
                    <Input
                        label="Email Address"
                        type="email"
                        isInvalid={errors.email_address?.type === "required"}
                        {...register("email_address", { required: true })}
                    />
                    <div className="flex gap-2 my-2 md:my-4">
                        <Input
                            label="First Name"
                            className="w-full"
                            isInvalid={errors.first_name?.type === "required"}
                            {...register("first_name", { required: true })}
                        />
                        <Input
                            label="Last Name"
                            className="w-full"
                            isInvalid={errors.last_name?.type === "required"}
                            {...register("last_name", { required: true })}
                        />
                    </div>
                    <Input
                        label="Phone number (optional)"
                        type="phone"
                        {...register("phone_number")}
                    />
                    <p className="mt-3 md:mt-5 text-xs text-gray-700 font-light">
                        This will be used for class reminders only, not spam!
                    </p>
                </div>
                {!isClassFree && (
                    <div className="py-3 md:py-5">
                        <h4 className="font-semibold mb-2 md:mb-4">
                            Payment method
                        </h4>
                        <div>
                            {/* <PaymentRequestButtonElement /> */}
                            <StripeElementWrapper
                                Element={CardNumberElement}
                                label="Card number"
                                onChange={({ complete }) => {
                                    setStripeElementCompleteState({
                                        ...stripeElementCompleteState,
                                        cardNumber: complete,
                                    });
                                }}
                            />
                            <div className="flex gap-2 my-2 md:my-4">
                                <StripeElementWrapper
                                    Element={CardExpiryElement}
                                    label="Expiration date"
                                    onChange={({ complete }) => {
                                        setStripeElementCompleteState({
                                            ...stripeElementCompleteState,
                                            cardExpiry: complete,
                                        });
                                    }}
                                />
                                <StripeElementWrapper
                                    Element={CardCvcElement}
                                    label="Security code"
                                    onChange={({ complete }) => {
                                        setStripeElementCompleteState({
                                            ...stripeElementCompleteState,
                                            cardCvc: complete,
                                        });
                                    }}
                                />
                            </div>
                            <Input
                                label="Postal Code"
                                isInvalid={
                                    errors.postal_code?.type === "required"
                                }
                                {...register("postal_code", {
                                    required: !isClassFree,
                                })}
                            />
                        </div>
                    </div>
                )}
                {!isClassFree && (
                    <div className="my-3 py-6 md:hidden bg-gray-200 -mx-3 px-3">
                        {/*
                      * NOTE Commenting out until endpoint ready for integration
                      <PromoCodeForm onValidSubmit={(_data) => {}} />
                      */}
                        <div>
                            <OrderSummary
                                count={spotsCount}
                                price={event.price}
                            />
                        </div>
                    </div>
                )}
                <div className="py-3 md:py-5">
                    {/*
                      * NOTE Commenting out due to product requirements
                        <CheckboxInput
                            className="mb-3"
                            {...register("subscribe_to_emails")}
                        >
                            <span>
                                Rec can send me emails about the best classes
                                happening nearby.
                            </span>
                        </CheckboxInput>
                    */}
                    <CheckboxInput
                        className="mb-3 md:mb-5"
                        {...register("agree_to_safety_waiver", {
                            required: true,
                        })}
                    >
                        <span>
                            I agree that Rec is not responsible for any injuries
                            that may occur during this class. I attest that I
                            have read and accept the{" "}
                            <Link href="/privacy-policy">
                                <span className="text-gray-800 cursor-pointer">
                                    {" "}
                                    Privacy Policy, Conditions of Use and
                                    Release of Liability, and Photo Release
                                </span>
                            </Link>
                            . I further agree that Rec may share my information
                            with the class organizer.
                        </span>
                    </CheckboxInput>
                    <ErrorMessage
                        show={
                            errors.agree_to_safety_waiver?.type === "required"
                        }
                        message="Agreeing to safety waiver is required."
                    />
                    {!isSubmitting && requestError && (
                        <div className="p-2 my-3 border border-red-700 bg-red-200 rounded">
                            <p>
                                <span>{requestError}</span>{" "}
                                <span>
                                    Please try again or email us at{" "}
                                    <a
                                        href="mailto:hi@getrec.com"
                                        className="underline"
                                    >
                                        hi@getrec.com
                                    </a>{" "}
                                    if you need more help!
                                </span>
                            </p>
                        </div>
                    )}
                    <Button
                        as="input"
                        type="submit"
                        className="w-full md:max-w-xs"
                        disabled={
                            !isDirty ||
                            (!isClassFree &&
                                !Object.values(
                                    stripeElementCompleteState,
                                ).every((v) => v))
                        }
                        value={
                            isSubmitting ? "Placing order..." : "Place order"
                        }
                    />
                </div>
            </div>
            <div className="hidden md:block md:col-span-3 bg-gray-200 px-5">
                <div className="py-5 hidden md:flex gap-3">
                    {event.featured_photo && (
                        <Image
                            src={event.featured_photo}
                            width={205}
                            height={205}
                            className="rounded-xl"
                            objectFit="cover"
                        />
                    )}
                    <div>
                        <h1 className="font-semibold">{event.name}</h1>
                        <h2 className="font-light text-sm">{`with ${event.author.first_name} ${event.author.last_name}`}</h2>
                        <h3 className="font-light text-sm">
                            {moment(event.start_time).format(
                                "dddd, MMM D h:mm a",
                            )}
                        </h3>
                    </div>
                </div>
                {!isClassFree && (
                    <div className="py-2">
                        {/*
                      * NOTE Commenting out until endpoint ready for integration
                      <PromoCodeForm onValidSubmit={(_data) => {}} />
                      */}
                        <div className="mt-6">
                            <OrderSummary
                                count={spotsCount}
                                price={event.price}
                            />
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
};
