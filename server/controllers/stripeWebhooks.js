// import stripe from "stripe";
// import Booking from "../models/Booking.js";

// export const stripeWebhooks = async (request, response) => {

//   const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
//   const sig = request.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripeInstance.webhooks.constructEvent(
//       request.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return response.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "payment_intent.succeeded") {
//     const paymentIntent = event.data.object;
//     const paymentIntentId = paymentIntent.id;

    
//     const session = await stripeInstance.checkout.sessions.list({
//       payment_intent: paymentIntentId,
//     });



//     const { bookingId } = session.data[0].metadata;

//       await Booking.findByIdAndUpdate(
//       bookingId,
//       { isPaid: true, paymentMethod: "Stripe" }
//     );
      
//   } else {
//     console.log("Unhandled event type:", event.type);
//   }

   
//   response.json({ received: true });
// };

import Stripe from "stripe";
import Booking from "../models/Booking.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔔 Webhook event received:", event.type);

  if (event.type === "checkout.session.completed") {
    const paymentIntent = event.data.object;
    const paymentId = paymentIntent.id;

    // Because metadata is stored in the checkout session, not payment_intent
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentId,
      limit: 1
    });

    if (!sessions.data.length) {
      console.log("❌ No session found for paymentIntent");
      return res.json({ received: true });
    }

    const session = sessions.data[0];
    const bookingId = session.metadata.bookingId;

    console.log("📌 Found booking:", bookingId);

    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "Stripe",
    });

    console.log("✅ Booking updated successfully");
  }

  res.json({ received: true });
};

