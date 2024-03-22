import * as mongoose from "mongoose";

export interface orderType {
  checkout_date: Date;
  ticket_type: string;
  quantity: number;
  event_id: string;
  user_id: string;
}

const orderSchema = new mongoose.Schema<orderType>({
  checkout_date: { type: Date, required: true },
  ticket_type: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  event_id: { type: String, required: true },
  user_id: { type: String, required: true },
});
