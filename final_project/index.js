
// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

app.use(express.json());
app.use("/customer", customer_routes);

app.use("/", genl_routes);

const PORT = 5000;

app.listen(PORT, () => console.log("Server is running"));

