import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import TransactionForm from "./components/TransactionForm";
import CategoryChart from "./components/CategoryChart";
import Navbar from "./components/Navbar";
import "./styles/DeleteModal.css";
import "./styles/Navbar.css"; 
import "./styles/TransactionList.css"; 
import "./styles/App.css";


const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      id
      type
      amount
      date
      category
    }
  }
`;

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

const App = () => {
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTIONS);
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  const transactions = data?.transactions || [];

  const balance = transactions.reduce((total: number, t: any) => {
    return t.type === "Income" ? total + t.amount : total - t.amount;
  }, 0);

  return (
    <>
      <Navbar />

      <div className="app-container">
        <div className="balance-header">
        <h1>Budget Tracker</h1>
        <h2>Current Balance: ${balance.toFixed(2)}</h2>

        <TransactionForm onAdd={() => refetch()} />

        {loading && <p>Loading transactions...</p>}
        {error && <p>Error loading transactions: {error.message}</p>}

        <ul className="transaction-list">
          {transactions.map((t: any) => (
            <li key={t.id}>
              {t.type} - ${t.amount.toFixed(2)} -{" "}
              {new Date(t.date).toLocaleDateString()}
              {t.category ? ` - Category: ${t.category}` : null}
              {" "}
              <button
                className="delete-button"
                onClick={() => setToDeleteId(t.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <CategoryChart transactions={transactions} />

        {/* Modal */}
        {toDeleteId && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Are you sure you want to delete this transaction?</p>
              <button
                onClick={async () => {
                  try {
                    await deleteTransaction({ variables: { id: toDeleteId } });
                    refetch();
                  } catch (err) {
                    alert("Failed to delete.");
                    console.error(err);
                  } finally {
                    setToDeleteId(null);
                  }
                }}
              >
                Yes, Delete
              </button>
              <button onClick={() => setToDeleteId(null)}>Cancel</button>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default App;
