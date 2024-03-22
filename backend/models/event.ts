import * as mongoose from "mongoose";

interface ticketType {
  type: string;
  quantity: number;
  price: number;
}

interface eventType {
  title: string;
  category: string;
  description: string;
  organizer: string;
  start_date: Date;
  end_date: Date;
  location: string;
  tickets: ticketType[];
  image: string;
}

const eventSchema = new mongoose.Schema<eventType>({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "Charity Event",
      "Concert",
      "Conference",
      "Convention",
      "Exhibition",
      "Festival",
      "Product Launch",
      "Sports Event",
    ],
    required: true,
  },
  description: { type: String, required: true },
  organizer: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.start_date;
      },
      message: "End date must be after start date",
    },
  },
  location: { type: String, required: true },
  tickets: {
    type: [
      {
        type: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    required: true,
    validate: {
      validator: function (tickets) {
        return tickets.length > 0;
      },
      message: "At least one ticket must be provided",
    },
  },
  image: { type: String },
});

export default mongoose.model("Event", eventSchema);
