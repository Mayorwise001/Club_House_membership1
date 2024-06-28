const express = require("express")
const path = require("path");
const indexRouter = require('./routes/index')

const flash = require('connect-flash');
const passport = require("passport");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));