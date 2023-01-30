const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// 設定路由
app.use('/api/gsheet', require('./routes/gsheet'));

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
