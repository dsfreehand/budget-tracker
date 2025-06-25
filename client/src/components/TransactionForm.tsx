import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "../styles/TransactionForm.css";

interface TransactionFormProps {
  onAdd: () => void;
}

const ADD_TRANSACTION = gql`
  mutation AddTransaction(
    $type: String!
    $amount: Float!
    $date: String!
    $category: String
  ) {
    addTransaction(
      type: $type
      amount: $amount
      date: $date
      category: $category
    ) {
      id
    }
  }
`;

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [type, setType] = useState<"Income" | "Expense">("Income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [addTransaction] = useMutation(ADD_TRANSACTION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "Expense" && category.trim() === "") {
      alert("Category is required for expenses.");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    const variables = {
      type,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      category: category.trim() || null,
    };

    try {
      await addTransaction({ variables });
      console.log("✅ Transaction mutation completed");

      setAmount("");
      setCategory("");
      setType("Income");
      onAdd();
    } catch (error: any) {
      alert("Error submitting transaction");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div>
        <label>
          Type:
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "Income" | "Expense")}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Amount:
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 100.00"
            required
          />
        </label>
      </div>

      <div>
        <label>
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={
              type === "Expense" ? "Required for expenses" : "Optional"
            }
            required={type === "Expense"}
          />
        </label>
      </div>

      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default TransactionForm;
