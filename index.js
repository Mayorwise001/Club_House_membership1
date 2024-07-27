const express = require("express");
const path = require("path");
const indexRouter = require('./routes/index');
const bodyParser = require("body-parser");
const logger = require('morgan');
const mongoose = require("mongoose");
require('dotenv').config();


const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('connected')
}

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', indexRouter);

// Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

// Static folder
app.use(express.static(path.join(__dirname, "public")));
// Start the server
const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on port ${port}`));