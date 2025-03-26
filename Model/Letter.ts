import mongoose, { Document, Schema } from "mongoose";

interface ILetter extends Document {
  title: string;
  content: string;
  userId: string;
}

const letterSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true }
});

export default mongoose.model<ILetter>("Letter", letterSchema);
