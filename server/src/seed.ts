import mongoose from "mongoose";
import dotenv from "dotenv";
import Transaction from "./models/Transaction";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/budget-tracker";

const testData = [
  // Sample transactions for seeding with random dates between 2025-01-01 and today's date

  {
    type: "Income",
    amount: 2000,
    date: new Date("2025-01-15"),
    category: "Salary",
  },
  {
    type: "Expense",
    amount: 150,
    date: new Date("2025-01-20"),
    category: "Groceries",
  },
  {
    type: "Expense",
    amount: 120,
    date: new Date("2025-02-05"),
    category: "Utilities",
  },
  {
    type: "Expense",
    amount: 250,
    date: new Date("2025-02-15"),
    category: "Entertainment",
  },
  {
    type: "Expense",
    amount: 180,
    date: new Date("2025-03-05"),
    category: "Dining",
  },
  {
    type: "Expense",
    amount: 220,
    date: new Date("2025-03-15"),
    category: "Shopping",
  },
];

const seedTransactions = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    await Transaction.deleteMany();

    // const result = await Transaction.insertMany(testData);
    // console.log("✅ Seeded transactions:", result);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedTransactions();
