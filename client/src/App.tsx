import React, { useEffect, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import CategoryChart from "./components/CategoryChart";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  date: string;
  category?: string;
}

const App = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = () => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then(setTransactions)
      .catch(console.error);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const balance = transactions.reduce((total, t) => {
    return t.type === "Income" ? total + t.amount : total - t.amount;
  }, 0);

  return (
    <div>
      <h1>Budget Tracker</h1>
      <h2>Current Balance: ${balance.toFixed(2)}</h2>

      <TransactionForm onAdd={fetchTransactions} />

      <ul>
        {transactions.map((t) => (
          <li key={t._id}>
            {t.type} - ${t.amount.toFixed(2)} -{" "}
            {new Date(t.date).toLocaleDateString()}
            {t.category ? ` - Category: ${t.category}` : null}
          </li>
        ))}
      </ul>
      <CategoryChart transactions={transactions} />
    </div>
  );
};

export default App;
