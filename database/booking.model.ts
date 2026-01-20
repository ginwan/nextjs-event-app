import { Schema, model, models, Document, Types } from "mongoose";
import Event from "./event.model";

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true, // Index for faster queries
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to verify that the referenced event exists
bookingSchema.pre("save", async function () {
  if (this.isModified("eventId")) {
    const eventExists = await Event.findById(this.eventId);
    if (!eventExists) {
      throw new Error("Referenced event does not exist");
    }
  }
});

const Booking = models.Booking || model<IBooking>("Booking", bookingSchema);

export default Booking;
