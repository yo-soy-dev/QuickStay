import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (request, response) => {

  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    
    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });



    const { bookingId } = session.data[0].metadata;

      await Booking.findByIdAndUpdate(
      bookingId,
      { isPaid: true, paymentMethod: "Stripe" }
    );
  }

  response.json({ received: true });
};





// import stripe from "stripe";
// import Booking from "../models/Booking.js";

// export const stripeWebhooks = async (request, response) => {
//   const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
//   const sig = request.headers["stripe-signature"];
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

//   // if (event.type === "checkout.session.completed") {
//   //   const session = event.data.object;

//   //   const bookingId = session.metadata?.bookingId;
//   //   if (!bookingId) {
//   //     console.log("⚠️ No bookingId in metadata");
//   //     return response.json({ received: true });
//   //   }

//   //   await Booking.findByIdAndUpdate(bookingId, {
//   //     isPaid: true,
//   //     paymentMethod: "Stripe",
//   //   });

//   //   console.log("✅ Booking marked as paid:", bookingId);
//   // } else {
//   //   console.log("Unhandled event type:", event.type);
//   // }

//     if (event.type === "checkout.session.completed") {
//   const session = event.data.object;

//   console.log("🚀 WEBHOOK HIT HO GAYA");
//   console.log("Webhook metadata:", session.metadata);

//   const bookingId = session.metadata?.bookingId;
//   console.log("BookingId received:", bookingId);

//   await Booking.findByIdAndUpdate(
//     bookingId,
//     { isPaid: true, paymentMethod: "Stripe" }
//   );

//   const updatedBooking = await Booking.findById(bookingId);
//   console.log("Updated booking in DB:", updatedBooking);
// }


//   response.json({ received: true });
// };
