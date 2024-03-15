import * as mongoose from "mongoose";

interface couponType {
  code: string;
  discount: number;
}

const couponSchema = new mongoose.Schema<couponType>({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true, min: 0 },
});
