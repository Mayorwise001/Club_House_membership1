const express = require("express")
const indexRouter = require("./routes/index")

const app = express();


app.use('/', indexRouter);



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));