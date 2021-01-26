const express = require("express");
const env = require("dotenv"); //environmental Variable-Constant
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
//initialize express
const app = express();
env.config();

//routes
const authRoutes = require("./route/auth");
const adminRoutes = require("./route/admin/auth");
const categoryRoutes = require("./route/category");
const productRoutes = require("./route/product");
const cartRoutes = require("./route/cart");
const initialDataRoute = require("./route/admin/initialData");

//mongodb connection
//mongodb+srv://<username>:<password>@cluster0.cod8b.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose
  .connect(
    `mongodb+srv://${process.env.MONOG_DB_USER}:${process.env.MONOG_DB_PASSWORD}@cluster0.cod8b.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  });

//implementation of middleware in app.
//app.use(express.json()); //parse incoming payload into json format.
app.use(bodyParser.json()); //parse incoming payload into json format.
//expose static file to browser like upload file where images are stored.
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
