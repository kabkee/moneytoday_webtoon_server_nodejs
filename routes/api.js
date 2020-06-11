const express = require('express');
const router = express.Router();
const fs = require('fs');
const dataFolder = 'data';
let toons = [];

routeInit();

function routeInit(){
  fs.readFile('api_data_meta.json', (err, data) => {
    if (err) throw err;
    toons = JSON.parse(data);
  });
}

/* GET webtoon listing. */
router.get('/list', function(req, res, next) {
  res.json(toons);
});
router.get('/toon/:toonIdx', function(req, res, next) {
  let toonIdx = req.params.toonIdx;
  res.json(toons[toonIdx]);
  return;
  
  fs.readFile('data_meta.json', (err, data) => {
    if (err) throw err;
    let toons = JSON.parse(data);
    console.log(toons);
    res.json(toons);
  });
});

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
