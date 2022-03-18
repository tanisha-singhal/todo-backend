require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
var cors = require('cors')
const app = express();
const corsOptions ={
  origin:'*', 
  //credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
app.use(cors(corsOptions))

 app.use(express.json())
 //app.use(express.static(path.join(__dirname, 'build')));
 app.use(express.static('public'));
// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

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