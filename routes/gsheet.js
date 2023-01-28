const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('this is gsheet site!')
})

module.exports = router;