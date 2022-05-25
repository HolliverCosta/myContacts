const express = require('express');
require('express-async-errors');

const routes = require('./routes');
const cors = require('./app/middlewares/cors');
const erroHandler = require('./app/middlewares/erroHandler');

const app = express();

app.use(express.json());
app.use(cors);
app.use(routes);
app.use(erroHandler);

app.listen(3001, () => console.log('Server started at http://localhost:3001'));
