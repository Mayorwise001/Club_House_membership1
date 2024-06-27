const express = require("express")

const app = express();


app.get('/', (req, res)=>{
    res.send('Express server workings')
});



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));