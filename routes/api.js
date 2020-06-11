const express = require('express');
const router = express.Router();
const fs = require('fs');
const dataFolder = 'data';


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  
  fs.readdir(dataFolder, function(error, filelist){
    if(error){
      console.error(error)
    }
    console.log(filelist);
  })

});

module.exports = router;
