import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles/index.css";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  date: string;
  category?: string;
}

interface CategoryChartProps {
  transactions: Transaction[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ transactions }) => {
  // Filter only expenses with a category
  const expenses = transactions.filter(
    (t) => t.type === "Expense" && t.category
  );

  // Aggregate amounts by category
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category!] = (acc[t.category!] || 0) + t.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Expenses by Category</h2>
      {expenses.length ? (
        <Doughnut data={data} />
      ) : (
        <p>No expense data available</p>
      )}
    </div>
  );
};

export default CategoryChart;
