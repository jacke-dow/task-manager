const express = require("express");
const db = require("./db");
const taskRoutes = require("./routes/tasks");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
