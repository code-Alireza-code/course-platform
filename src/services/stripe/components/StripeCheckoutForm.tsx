"use client";

import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { stripeClientPromise } from "../stripeClient";
import { getClientSecretSession } from "../actions/stripe";

function StripeCheckoutForm({
  product,
  user,
}: {
  product: {
    priceInDollars: number;
    name: string;
    id: string;
    imageUrl: string;
    description: string;
  };
  user: {
    email: string;
    id: string;
  };
}) {
  return (
    <EmbeddedCheckoutProvider
      stripe={stripeClientPromise}
      options={{
        fetchClientSecret: getClientSecretSession.bind(null, product, user),
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}

export default StripeCheckoutForm;
