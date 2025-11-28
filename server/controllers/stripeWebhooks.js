import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (request, response) => {
  console.log("Webhook hit:", event.type);

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
      
  } else {
    console.log("Unhandled event type:", event.type);
  }

   
  response.json({ received: true });
};

// import Stripe from "stripe";
// import Booking from "../models/Booking.js";

// export const stripeWebhooks = async (req, res) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//   const sig = req.headers["stripe-signature"];
//   let event;

//   // Step 1: Verify webhook
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//     console.log("✅ Webhook verified successfully");
//   } catch (err) {
//     console.error("❌ Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   console.log("📌 Webhook event type:", event.type);

//   // Step 2: Handle checkout.session.completed
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const bookingId = session.metadata.bookingId;

//     console.log("💡 Booking ID from metadata:", bookingId);
//     console.log("🔹 Full session object:", session);

//     try {
//       const updatedBooking = await Booking.findByIdAndUpdate(
//         bookingId,
//         { isPaid: true, paymentMethod: "Stripe" },
//         { new: true }
//       );

//       if (updatedBooking) {
//         console.log(`✅ Booking ${bookingId} marked as paid`);
//       } else {
//         console.warn(`⚠️ Booking ${bookingId} not found in MongoDB`);
//       }
//     } catch (err) {
//       console.error("❌ Failed to update booking:", err.message);
//     }
//   } else {
//     console.log("⚠️ Unhandled event type:", event.type);
//   }

//   res.json({ received: true });
// };
