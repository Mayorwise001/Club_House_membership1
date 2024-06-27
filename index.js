const express = require("express")

const bcrypt = require("bcrypt");
const path = require("path");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport"); 
const indexRouter = require('./routes/index')
const http = require('http');
const router = express.Router();
const bodyParser = require('body-parser');
const logger = require('morgan');
const debug = require('debug')('my-express-app:server');

const methodOverride = require('method-override');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', indexRouter);



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));