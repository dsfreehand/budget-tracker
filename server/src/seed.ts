import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Transaction from "./models/Transaction";
import User from "./models/User";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/budget-tracker";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Transaction.deleteMany();
    await User.deleteMany();

    // Create dev user
    const email = "e@mail.com";
    const plainPassword = "email";
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const devUser = await User.create({
      email,
      passwordHash,
    });

    console.log("👤 Development user created:", devUser.email);

    // Sample transactions
    const transactions = [
      {
        userId: devUser._id,
        description: "Groceries",
        amount: 50,
        date: new Date("2023-10-01"),
      },
      {
        userId: devUser._id,
        description: "Salary",
        amount: 2000,
        date: new Date("2023-10-02"),
      },
      {        userId: devUser._id,
        description: "Utilities",
        amount: 150,
        date: new Date("2023-10-03"),
      },
      {        userId: devUser._id,
        description: "Dining Out",
        amount: 75,
        date: new Date("2023-10-04"),
      },
      {        userId: devUser._id,
        description: "Gym Membership",
        amount: 30,
        date: new Date("2023-10-05"),
      },
    ];


    console.log("💸 Sample transactions added");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
