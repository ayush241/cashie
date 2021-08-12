const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();

app.use(bodyParser.json({ limit: "50mb", extended: false }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
  );
  next();
});

// Database connection
const dbConfig = require("./app/configs/database");
let connection =
  "mongodb+srv://cashie:cashiedatabase@cashie.pxphq.mongodb.net/cashie_db?retryWrites=true&w=majority";

if (process.env.NODE_ENV !== "production") {
  connection = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;
}

console.log(connection, process.env.NODE_ENV);

const db = require("./app/models");
db.mongoose
  .connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// Define Routes
require("./app/routes/user.route")(app);
require("./app/routes/auth.route")(app);
require("./app/routes/category.route")(app);
require("./app/routes/product.route")(app);
require("./app/routes/transaction.route")(app);
require("./app/routes/setting.route")(app);



// Define default data
const Setting = require("./app/controllers/setting.controller");
Setting.check();
const User = require("./app/controllers/user.controller");
User.check();

const PORT = process.env.PORT || 8080;
app.use(express.static(__dirname + "/app/uploads"));
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}.`);
});
