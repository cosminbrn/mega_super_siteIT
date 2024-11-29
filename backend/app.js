const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('buna');
});
PORT = 3000;
app.listen(PORT, () => {
    console.log(`port ${PORT}`);
});