const fs = require('fs');
let dataFolder = 'public/data'
let toons = fs.readFileSync('api_data_meta.json');

// fs.readdir(dataFolder, { withFileTypes: true }, function(error, filelist) {
//     if (error) {
//         console.error(error)
//     }
//     let toonTitle;
//     for (let idx in filelist) {
//         toonTitle = filelist[idx];
//         if (toonTitle.isDirectory()) {
//             makeJson(toonTitle.name);
//         }
//     }
// })
toons = JSON.parse(toons);
for (let idx in toons) {
    makeJson(toons[idx]);
}

function makeJson(toon) {
    // 데이터 클리닝
    fs.readFile(`${dataFolder}/toon_${toon.id}/api_chapter_meta.json`, (err, data) => {
        if (err) throw err;
        chapters = JSON.parse(data);

        let toonMeta = fs.readFileSync(`${dataFolder}/toon_${toon.id}/api_meta.json`);
        toonMeta = JSON.parse(toonMeta);

        chapters.forEach((item, index, array) => {
            item.category = toonMeta.category;
            item.toon_title = toonMeta.title;
            item.toon_id = toonMeta.id;
            item.writer = toonMeta.writer;

            delete item.more;
            let thumbFile = item.thumb.split('/');
            item.thumb = `/data/toon_${toon.id}/episode_${item.id}/${thumbFile[thumbFile.length-1]}`;
            item.id = index;

            let toonFiles = [];
            let errorDirs = [];
            try {
                fs.readdirSync(`${dataFolder}/toon_${toon.id}/episode_${item.id}`, { withFileTypes: true }).forEach(p => {    
                    if (!p.isDirectory() && p.name != thumbFile[thumbFile.length - 1]) {  // 디렉토리인지 체크
                        toonFiles.push(p.name);
                    }
                });
                console.info(toonFiles)
                item.toon_files = toonFiles;
            } catch (error) {
                errorDirs.push(`${dataFolder}/toon_${toon.id}/episode_${item.id}`);
            }
            if (errorDirs.length) {
                fs.appendFile(`error_log.txt`, JSON.stringify(errorDirs), (err, data) => {
                    if (err) {
                        console.error(err)
                    }
                });
            }
        });

        // api제공용 새로운 메타 파일 생성
        let json = JSON.stringify(chapters);
        fs.writeFile(`${dataFolder}/toon_${toon.id}/api_chapter_meta.json`, json, (err, data) => {
            if (err) {
                console.error(err)
            }
        });
    });
}
