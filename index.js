const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("this is test site!");
})

app.use('/gsheet', require('./routes/gsheet'));

// Handle production
if (process.env.NODE_ENV === 'production') {
    // Static folder - 此時即可提供在public資料夾下的所有檔案url
    app.use(express.static(__dirname + '/public/'));

    // Handle SPA
    // res.sendFile() 可以向瀏覽器發送 靜態頁面；
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})