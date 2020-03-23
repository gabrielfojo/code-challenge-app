const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require("multer");
const errorController = require('./controllers/error');
const apiRoutes = require('./routes/api');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'public/images');
  },
  filename:(req,file,cb)=>{
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.match(/(\.jpg||\.gif||\.png)$/) || '';
    cb(null, uniqueSuffix + ext[0]);
  }
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({'storage':fileStorage}).single('image'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 

app.use('/api', apiRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb://mongo:27017/S10sul'
  )
  .then(result => {
    app.listen(3040);
  })
  .catch(err => {
    console.log(err);
  });
