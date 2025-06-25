import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Transaction from "../models/Transaction";
import User from "../models/User";

type IResolvers = Record<string, any>;

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const resolvers: IResolvers = {
  Query: {
    transactions: async (_parent: any, _args: any, context: { user: { id: any; }; }) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        return await Transaction.find({ userId: context.user.id }).sort({ date: -1 });
      } catch (error) {
        throw new Error("Error fetching transactions");
      }
    },
  },

  Mutation: {
    register: async (_parent: any, { email, password }: any) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already in use");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await new User({ email, passwordHash }).save();

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return { token, user };
    },

    login: async (_parent: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return { token, user };
    },

    addTransaction: async (_parent: any, { type, amount, date, category }: any, context: { user: { id: any; }; }) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      if (!["Income", "Expense"].includes(type)) {
        throw new Error("Type must be Income or Expense");
      }

      if (typeof amount !== "number" || amount <= 0) {
        throw new Error("Amount must be a positive number");
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      if (type === "Expense" && (!category || category.trim() === "")) {
        throw new Error("Category is required for expenses");
      }

      const transaction = new Transaction({
        type,
        amount,
        date: parsedDate,
        category: category?.trim(),
        userId: context.user.id,
      });
      console.log("✅ Transaction saved:", transaction);
      return await transaction.save();


    },

    deleteTransaction: async (_parent: any, { id }: any, context: { user: { id: any; }; }) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      try {
        const transaction = await Transaction.findOne({
          _id: id,
          userId: context.user.id,
        });

        if (!transaction) {
          return false;
        }

        await transaction.deleteOne();
        return true;
      } catch (error) {
        console.error("Delete error:", error);
        return false;
      }
    },
  },

  Transaction: {
    id: (parent: { _id: { toString: () => any; }; }) => parent._id?.toString?.(),
    date: (parent: { date: string | number | Date; }) => new Date(parent.date).toISOString(),
  },

  User: {
    id: (parent: { _id: { toString: () => any; }; }) => parent._id?.toString?.(),
  },
};

export default resolvers;
