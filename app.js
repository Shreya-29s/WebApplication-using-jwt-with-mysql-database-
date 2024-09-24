const express = require('express');
const bodyParser = require('body-parser');
const router = require('./backend/router/router');
// const cors = require('cors');

const app = express();

// app.use(cors());
app.use(bodyParser.json());
app.use(router);
app.use(express.static('./public'));

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
