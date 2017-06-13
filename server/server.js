const express = require('express');

let app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});