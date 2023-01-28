const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("this is test site!");
})

app.use('/gsheet', require('./routes/gsheet'));

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})