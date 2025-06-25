import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  type: "Income" | "Expense";
  amount: number;
  date: Date;
  category?: string;
  userId: mongoose.Types.ObjectId;
}

const TransactionSchema = new Schema<ITransaction>({
  type: { type: String, required: true, enum: ["Income", "Expense"] },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: {
    type: String,
    required: function (this: any) {
      return this.type === "Expense";
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
