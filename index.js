const express = require("express")
const path = require("path");
const indexRouter = require('./routes/index')
const bodyParser = require("body-parser");
const logger = require('morgan');




const mongoose = require("mongoose");




const mongoDb = "mongodb+srv://tomosorijosephmayowa:MongoPass@cluster0.r54f38d.mongodb.net/authentication?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoDb);
const db = mongoose.connection;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDb);
  console.log('connected')
}
// db.on("error", console.error.bind(console, "mongo connection error"));


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', indexRouter);


// Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

// Initialize passport and connect-flash






// Static folder
app.use(express.static(path.join(__dirname, "public")));
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));