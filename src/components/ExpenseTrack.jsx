import React, { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import { v4 as uid } from "uuid"; // npm i uuid
import ExpenseList from "./ExpenseList";
import ExpenseSummary from "./ExpenseSummary";
import axios from "axios";

const EXPENSES = [
  // { id: uid(), title: "Expenses 1", amount: 100 },
  // { id: uid(), title: "Expenses 2", amount: -200 },
];

export default function ExpenseTrack() {
  const [expenses, setExpenses] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    fetchData();
  }, [expenses]);

  const fetchData = async () => {
    await axios
      .get("https://expense-tracker-back-end-nxl8.onrender.com/api/")
      .then((response) => {
        setExpenses(response.data);
      })
      .catch(() => {
        console.error("Unable to Fetch");
      });
  }

  const addExpense = (title, amount, id) => {
    if (itemToEdit) {
      // Update existing expense
      axios
        .put(`https://expense-tracker-back-end-nxl8.onrender.com/api/${id}`, {
          title,
          amount
        })
        .catch((error) => console.error("Update error:", error));

        fetchData();
        console.log("edit");
        
    } else {
      // Add new expense
      axios
        .post("https://expense-tracker-back-end-nxl8.onrender.com/api/post", {
          title,
          amount: Number(amount),
        })
        .then((res) => setExpenses([...expenses, res.data]))
        .catch((error) => console.error("Add Error:", error));
    }
  };

  const handleDelete = (id) => {
    console.log(id);

    axios
      .delete(`https://expense-tracker-back-end-nxl8.onrender.com/api/${id}`)
      .then(() => setExpenses(expenses.filter((item) => item._id !== id)))
      .catch((error) => console.error("Delete Error:", error));
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
  };

  return (
    <div>
      <h2>Expense Tracker</h2>
      <ExpenseForm addExpense={addExpense} itemToEdit={itemToEdit} />
      <ExpenseList
        proexpenses={expenses}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
      <ExpenseSummary proexpenses={expenses} />
    </div>
  );
}
