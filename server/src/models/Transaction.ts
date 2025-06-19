import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  type: "Income" | "Expense";
  amount: number;
  date: Date;
  category?: string; // new optional field
}

const TransactionSchema = new Schema<ITransaction>({
  type: { type: String, required: true, enum: ["Income", "Expense"] },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: {
    type: String,
    required: function () {
      return this.type === "Expense";
    },
  },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
