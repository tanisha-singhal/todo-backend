require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();


 app.use(express.json())



mongoose.connect(process.env.TODO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("connected to Mongo successfully");
})



//Available routes
app.use('/api/users', require('./routes/user'))
app.use('/api/todo', require('./routes/todo'))


app.listen(process.env.PORT||5000, () => {
  console.log(` app listening at http://localhost:5000`)
})