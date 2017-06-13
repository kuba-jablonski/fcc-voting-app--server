const express = require('express');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');

let app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});