require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();


 app.use(express.json())
 app.use(express.static('public'));


mongoose.connect(process.env.TODO_URI) .then(function (db) {
  console.log("db connected");
})
.catch(function (err) {
  console.log("err", err);
});



//Available routes
app.use('/api/users', require('./routes/user'))
app.use('/api/todo', require('./routes/todo'))


app.listen(process.env.PORT||5000, () => {
  console.log(` app listening at http://localhost:5000`)
})