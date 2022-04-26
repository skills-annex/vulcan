import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import stripejs, { StripeCardElementChangeEvent, StripeElementLocale } from "@stripe/stripe-js";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import React, { SyntheticEvent, useEffect, useState } from "react";
import reactHtmlParser from "react-html-parser";

import { PaymentData } from "@ee/lib/stripe/server";
import { PaymentPageProps } from "@ee/pages/payment/[uid]";

// import useDarkMode from "@lib/core/browser/useDarkMode";
import { useLocale } from "@lib/hooks/useLocale";

import Button from "@components/ui/Button";

const CARD_OPTIONS: stripejs.StripeCardElementOptions = {
  iconStyle: "solid" as const,
  classes: {
    base: "block p-2 w-full border-solid border-2 border-gray-300 rounded-md shadow-sm dark:bg-black dark:text-white dark:border-black focus-within:ring-black focus-within:border-black sm:text-sm",
  },
  style: {
    base: {
      color: "#000",
      iconColor: "#000",
      fontFamily: "ui-sans-serif, system-ui",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#888888",
      },
    },
  },
} as const;

type Props = {
  attendees: PaymentPageProps["booking"]["attendees"];
  eventType: { id: number; title: string; length: number; price: number; slug: string };
  location: string;
  payment: {
    data: PaymentData;
  };
  startTime: dayjs.Dayjs;
  user: { username: string | null; name: string | null };
};

type States =
  | { status: "idle" }
  | { status: "processing" }
  | { status: "error"; error: Error }
  | { status: "ok" };

export default function PaymentComponent(props: Props) {
  const { t, i18n } = useLocale();
  const router = useRouter();
  const { name, date } = router.query;
  const [state, setState] = useState<States>({ status: "idle" });
  const stripe = useStripe();
  const elements = useElements();

  // const { isDarkMode } = useDarkMode();

  useEffect(() => {
    elements?.update({ locale: i18n.language as StripeElementLocale });
  }, [elements, i18n.language]);

  /*   if (isDarkMode) {
    CARD_OPTIONS.style!.base!.color = "#fff";
    CARD_OPTIONS.style!.base!.iconColor = "#fff";
    CARD_OPTIONS.style!.base!["::placeholder"]!.color = "#fff";
  } */

  const handleChange = async (event: StripeCardElementChangeEvent) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setState({ status: "idle" });
    if (event.error)
      setState({ status: "error", error: new Error(event.error?.message || t("missing_card_fields")) });
  };

  const handleSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();

    //check if time slot has been taken before completing purchase.
    const alreadyBooked = await fetch("/api/bookings/find-booked-timeslot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventTypeId: props.eventType.id,
        startTime: props.startTime,
        username: props.user.username,
      }),
    });
    const response = await alreadyBooked.json();

    if (response.isBooked) {
      setState({
        status: "error",
        error: {
          name: "",
          message: t("slot_already_booked", {
            returnLink: `/${props.user.username}/${props.eventType.slug}`,
          }),
        },
      });
    } else {
      if (typeof window !== "undefined" && window.heap) {
        window.heap.track("Purchase", {
          productType: "1-on-1",
          instructorProfile: props.user.name,
          instructorName: props.user.name,
          amount: props.eventType.price,
          eventTypeTitle: props.eventType.title,
          eventTypeLength: props.eventType.length,
          eventTypePrice: props.eventType.price,
        });
      }

      if (!stripe || !elements) return;
      const card = elements.getElement(CardElement);
      if (!card) return;
      setState({ status: "processing" });
      const payload = await stripe.confirmCardPayment(props.payment.data.client_secret!, {
        payment_method: {
          card,
        },
      });
      if (payload.error) {
        setState({
          status: "error",
          error: new Error(`Payment failed: ${payload.error.message}`),
        });
      } else {
        await fetch("/api/integrations/thetis/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ attendees: props.attendees }),
        });

        const params: { [k: string]: any } = {
          date,
          type: props.eventType.id,
          user: props.user.username,
          name,
        };

        if (props.location) {
          if (props.location.includes("integration")) {
            params.location = t("web_conferencing_details_to_follow");
          } else {
            params.location = props.location;
          }
        }

        const query = stringify(params);
        const successUrl = `/success?${query}`;

        await router.push(successUrl);
      }
    }
  };
  return (
    <form id="payment-form" className="mt-4" onSubmit={handleSubmit}>
      <CardElement id="card-element" options={CARD_OPTIONS} onChange={handleChange} />
      <div className="flex justify-center mt-2">
        <Button
          type="submit"
          disabled={["processing", "error"].includes(state.status)}
          loading={state.status === "processing"}
          id="submit">
          <span id="button-text">
            {state.status === "processing" ? <div className="spinner" id="spinner" /> : t("pay_now")}
          </span>
        </Button>
      </div>
      {state.status === "error" && (
        <div className="mt-4 text-center text-red-600" role="alert">
          {reactHtmlParser(state.error.message)}
        </div>
      )}
    </form>
  );
}
