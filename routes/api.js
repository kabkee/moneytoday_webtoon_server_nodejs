const express = require('express');
const router = express.Router();
const fs = require('fs');
const dataFolder = 'public/data';
let toons = [];

routeInit();

function routeInit() {
    fs.readFile('api_data_meta.json', (err, data) => {
        if (err) throw err;
        toons = JSON.parse(data);
    });
}

/* GET webtoon listing. */
router.get('/list', function(req, res, next) {
    res.json(toons);
});
router.get('/list/:toonIdx', function(req, res, next) {
    let toonIdx = req.params.toonIdx;
    res.json(toons[toonIdx]);
});
router.get('/chapter/:toonIdx', function(req, res, next) {
    let toonIdx = req.params.toonIdx;
    fs.readFile(`${dataFolder}/${toons[toonIdx].title}/api_chapter_meta.json`, (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

module.exports = router;
