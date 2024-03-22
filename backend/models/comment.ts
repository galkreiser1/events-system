import * as mongoose from "mongoose";

interface commentType {
  username: string;
  comment: string;
  date: Date;
}

const commentSchema = new mongoose.Schema<commentType>({
  username: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, required: true },
});
