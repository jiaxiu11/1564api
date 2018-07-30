const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
import routes from './routes/1564routes';//here you cannot use require
import jsonwebtoken from 'jsonwebtoken';
var cors = require('cors');//add in cors


const app = express();
app.use(cors());

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// DB Config
const db = require('./config/keys').mongoURI;
const secret = require('./config/keys').secret;
// Connect to Mongo
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Use Routes
// app.use('/api/items', items);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  // app.use(express.static('client/build'));

  // app.get('*', (req, res) => {
  //   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  // });
}
//my auth
app.use((req, res, next) => {
  if(req.headers && req.headers.authorization
    && req.headers.authorization.split(' ')[0] === 'JWT') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], secret,
    (err, decode) => {
      if(err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
//myroutes
routes(app);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
