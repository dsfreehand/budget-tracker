import { Router, Request, Response } from "express";
import Transaction, { ITransaction } from "../models/Transaction";

const router = Router();

// GET all transactions
router.get("/", async (_req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error fetching transactions" });
  }
});

// POST create a new transaction
router.post("/", async (req: Request, res: Response) => {
  try {
    const { type, amount, date, category } = req.body;

    // Basic validation
    if (!type || !["Income", "Expense"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Type must be Income or Expense" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "Invalid or missing date" });
    }

    if (
      type === "Expense" &&
      (!category || typeof category !== "string" || category.trim() === "")
    ) {
      return res
        .status(400)
        .json({ message: "Category is required for expenses" });
    }

    const newTransaction: Partial<ITransaction> = {
      type,
      amount,
      date: new Date(date),
      category: category ? category.trim() : undefined,
    };

    const transaction = new Transaction(newTransaction);
    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Server error creating transaction" });
  }
});

export default router;
