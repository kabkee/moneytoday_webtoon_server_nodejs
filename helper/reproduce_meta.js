const fs = require('fs');
let toons = [];

// 데이터 클리닝
fs.readFile('api_data_meta.json', (err, data) => {
    if (err) throw err;
    toons = JSON.parse(data);
    toons.forEach((item, index, array) => {
        delete item.more;
        delete item.folder;
        let thumbFile = item.thumb.split('/');
        item.thumb = `/data/toon_${item.id}/${thumbFile[thumbFile.length - 1]}`;
        item.id = index;

        let json = JSON.stringify({
            category: item.category,
            title: item.title,
            writer: item.writer,
            id: item.id
        })
        fs.writeFileSync(`public/data/toon_${item.id}/api_meta.json`, json, function(err, result) {
            if (err) console.log('error', err);
        });
    });

    // api제공용 새로운 메타 파일 생성
    let json = JSON.stringify(toons);
    fs.writeFile('api_data_meta.json', json, function(err, result) {
        if (err) console.log('error', err);
    });
});
