import React, { useState } from "react";

interface TransactionFormProps {
  onAdd: () => void; // callback to refresh transactions after adding
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [type, setType] = useState<"Income" | "Expense">("Income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: category required for Expenses
    if (type === "Expense" && category.trim() === "") {
      alert("Category is required for expenses.");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    const newTransaction = {
      type,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      category: category.trim() || undefined,
    };

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(
          "Failed to add transaction: " + (errData.message || res.statusText)
        );
        return;
      }

      setAmount("");
      setCategory("");
      setType("Income");
      onAdd(); // refresh transactions list
    } catch (error) {
      alert("Error submitting transaction");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
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
