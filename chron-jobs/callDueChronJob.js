import cron from "node-cron";
import Task from "../models/Tasks.js";
import twilio from "twilio";
import dotenv from "dotenv";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse.js";

dotenv.config();

// Twilio credentials
const accountSid = process.env.TWILLO_ACCOUNT_SID;
const authToken = process.env.TWILLO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Keep track of the last call time for each user
const lastCallTimes = {};

// Define the cron job to run every hour
export default cron.schedule("0 * * * *", async () => {
  try {
    // Find all tasks that are not soft-deleted and overdue
    const overdueTasks = await Task.find({
      deleted_at: null,
      status: { $in: ["TODO", "IN_PROGRESS"] },
      due_date: { $lt: new Date() },
    }).populate("user_id");

    // Sort overdue tasks by priority and due_date
    overdueTasks.sort((a, b) => {
      if (a.user_id.priority !== b.user_id.priority) {
        return a.user_id.priority - b.user_id.priority;
      }
      return a.due_date - b.due_date;
    });

    // Call users based on priority
    for (const task of overdueTasks) {
      const { user_id, title } = task;
      const phoneNumber = user_id.phone_number;

      // Check if the user was called in the last 24 hours
      const lastCallTime = lastCallTimes[user_id._id] || 0;
      const currentTime = Date.now();

      if (currentTime - lastCallTime > 24 * 60 * 60 * 1000) {
        const message = new VoiceResponse();
        await message.say(
          `Dear User, Your task ${title} is due please complete it as soon as possible!`
        );
        // Call the user using Twilio
        const call = await client.calls.create({
          to: `+${phoneNumber}`,
          from: "+18149759170",
          twiml: message.toString(),
        });

        console.log(
          `Calling user with priority ${user_id.priority} for task: ${title}`
        );

        // Wait for a few seconds before calling the next user
        await new Promise((resolve) => setTimeout(resolve, 20000));
        // Check the call status
        const callStatus = await client
          .calls(call.sid)
          .fetch()
          .then((call) => call.status);

        if (callStatus !== "completed") {
          // Update the last call time for the user
          console.log(
            `User with priority ${user_id.priority} did not attend the call. Trying the next user.`
          );
        } else {
          lastCallTimes[user_id._id] = currentTime;
          console.log(
            `User with priority ${user_id.priority} attended the call. Calling the next user.`
          );
        }
      } else {
        console.log(
          `User with priority ${user_id.priority} was called in the last 24 hours. Skipping.`
        );
      }
    }

    console.log("Voice calling cron job completed.");
  } catch (error) {
    console.error("Error in voice calling cron job:", error);
  }
});
