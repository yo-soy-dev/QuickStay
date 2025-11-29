import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    await whook.verify(JSON.stringify(req.body), headers);
    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " +  data.last_name,
      image: data.image_url,
    }
    await User.create(userData);
    break;
      }
      case "user.updated": {
        const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " +  data.last_name,
      image: data.image_url,
    }
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }
      default:
        break;
    }

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;


// import User from "../models/User.js";
// import { Webhook } from "svix";

// const clerkWebhooks = async (req, res) => {
//   try {
//     // Convert raw buffer to string
//     const payload = req.body.toString("utf8");

//     const headers = {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     };

//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     const event = whook.verify(payload, headers);
//     const { data, type } = event;

//     if (type === "user.created") {
//       await User.create({
//         _id: data.id,
//         email: data.email_addresses[0].email_address,
//         username: `${data.first_name} ${data.last_name}`,
//         image: data.image_url,
//       });
//     }

//     if (type === "user.updated") {
//       await User.findByIdAndUpdate(data.id, {
//         email: data.email_addresses[0].email_address,
//         username: `${data.first_name} ${data.last_name}`,
//         image: data.image_url,
//       });
//     }

//     if (type === "user.deleted") {
//       await User.findByIdAndDelete(data.id);
//     }

//     res.status(200).send("Webhook received");
//   } catch (error) {
//     console.error("Webhook Error:", error.message);
//     res.status(400).send("Webhook Error: " + error.message);
//   }
// };

// export default clerkWebhooks;
