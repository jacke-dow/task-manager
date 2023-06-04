import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("https://mcs-task-api.onrender.com/api/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTasks(); // Call the fetchTasks function

    // Add a return statement to handle the cleanup of the useEffect hook
    return () => {
      // Perform any necessary cleanup here
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://mcs-task-api.onrender.com/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setTasks([data, ...tasks]);
        setFormData({ title: "", description: "", status: "" });
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async (taskId, updatedStatus) => {
    try {
      const response = await fetch(
        `https://mcs-task-api.onrender.com/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: updatedStatus }),
        }
      );

      if (response.ok) {
        const updatedTasks = tasks.map((task) =>
          task._id === taskId ? { ...task, status: updatedStatus } : task
        );
        setTasks(updatedTasks);
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(
        `https://mcs-task-api.onrender.com/api/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedTasks = tasks.filter((task) => task._id !== taskId);
        setTasks(updatedTasks);
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <input
            type="text"
            name="status"
            id="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              backgroundColor:
                task.status === "completed"
                  ? "lightcoral"
                  : task.status === "in progress"
                  ? "lightyellow"
                  : "lightgreen",
            }}
          >
            <div className="task-content">
              <h3>Title: {task.title}</h3>
              <p>Description: {task.description}</p>
              <p className="status">Status: {task.status}</p>
            </div>
            <div className="button-row">
              <button
                onClick={() => handleUpdate(task._id, "completed")}
                disabled={task.status === "completed"}
              >
                Mark as Completed
              </button>
              <button
                onClick={() => handleUpdate(task._id, "in progress")}
                disabled={task.status === "in progress"}
              >
                Mark as In Progress
              </button>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
