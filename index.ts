const STRIPE_KEY = "";

import express, { Request, Response } from "express";
import Stripe from "stripe";

const app = express();
app.use("/webhook", express.raw({ type: "*/*" }));
app.use(express.json());

const stripe = new Stripe(STRIPE_KEY);

app.post("/payment", async (request: Request, response: Response) => {
  try {
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ message: "Please enter a name" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2100,
      currency: "BRL",
      payment_method_types: ["card"],
      metadata: { name },
    });

    const clientSecret = paymentIntent.client_secret;

    return response.json({ message: "Payment initiated ", clientSecret });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ message: "Internal server error: " + error });
  }
});

app.post("/webhook", (request: Request, response: Response) => {
  // const sign = request.headers["stripe-signature"];
  let event;
  try {
    // console.log(request?.headers);
    event = stripe.webhooks.constructEvent(
      request.body,
      request.headers["stripe-signature"] ?? "",
      "whsec_f7ce17204288dc4845bfe4cded99c98981764e62e429881af62e2077e8c2db6b"
    );
    // console.log(JSON.stringify(event));
  } catch (error) {
    console.log(error);
    return response.status(400).json({ message: error });
  }

  // console.log(event);

  // if (event.type === "payment_intent.created") {
  //   // console.log(`${event?.data?.object?.metadata?.name} initiated payment`);
  // }
  if (event.type === "payment_intent.succeeded") {
    console.log(JSON.stringify(event?.data?.object?.metadata));
  }
});

app.listen(3333, () => console.log("Servidor iniciado"));
