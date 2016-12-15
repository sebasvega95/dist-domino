const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

/* ----- Config ----- */
const port = process.env.PORT || 8080;
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

/* ----- Routes ----- */
const index = require('./routes/index');
app.use('/', index);

/* ----- Server ----- */
app.listen(port);
console.log(`Listening on port ${port}...`);
