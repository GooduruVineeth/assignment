const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

// custome middleware
const serverResponse = require("./middlewares/serverResponse");

// routes
const routes = require("./routes/tradeRoutes");

// express app configuration
const app = express();
const PORT = process.env.PORT || 3000;


// middlewares
app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(serverResponse());

//Adding  routes
app.use("/api/trade", routes);

// connecting to MongoDB server
mongoose
.connect("mongodb+srv://root:9663639359@cluster0.x35j1.mongodb.net/smallcasedb?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => app.listen(PORT, () => console.log("server started on port :", PORT)))
  .catch(err => console.log("Error occured",err));
