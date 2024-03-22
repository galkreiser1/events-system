import * as mongoose from "mongoose";

interface userCouponsType {
  code: string;
  user_id: string;
}

const userCouponsSchema = new mongoose.Schema<userCouponsType>({
  code: { type: String, required: true },
  user_id: { type: String, required: true },
});
