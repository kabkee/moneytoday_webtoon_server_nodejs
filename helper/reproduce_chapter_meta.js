const fs = require('fs');
let dataFolder = 'public/data'
let toons = fs.readFileSync('data_meta.json');

fs.readdir(dataFolder, { withFileTypes: true }, function(error, filelist) {
    if (error) {
        console.error(error)
    }
    let toonTitle;
    for (let idx in filelist) {
        toonTitle = filelist[idx];
        if (toonTitle.isDirectory()) {
            makeJson(toonTitle.name);
        }
    }
})

function makeJson(toonTitle) {
    // 데이터 클리닝
    fs.readFile(`${dataFolder}/${toonTitle}/chapter_meta.json`, (err, data) => {
        if (err) throw err;
        chapters = JSON.parse(data);

        let toonMeta = fs.readFileSync(`${dataFolder}/${toonTitle}/meta.json`);
        toonMeta = JSON.parse(toonMeta);

        chapters.forEach((item, index, array) => {
            item.category = toonMeta.category;
            item.toon_title = toonMeta.title;
            item.writer = toonMeta.writer;

            delete item.more;
            item.folder_name = item.folder_name.replace(/\?/g, '').replace(/\./g, '').trim();
            let thumbFile = item.thumb.split('/');
            item.thumb = `/${dataFolder}/${toonTitle}/${item.folder_name}/${thumbFile[thumbFile.length-1]}`;

            let toonFiles = [];
            let errorDirs = [];
            try {
                fs.readdirSync(`${dataFolder}/${toonTitle}/${item.folder_name}`, { withFileTypes: true }).forEach(p => {    
                    if (!p.isDirectory() && p.name != thumbFile[thumbFile.length - 1]) {  // 디렉토리인지 체크
                        toonFiles.push(p.name);
                    }
                });
                console.info(toonFiles)
                item.toon_files = toonFiles;
            } catch (error) {
                errorDirs.push(`${dataFolder}/${toonTitle}/${item.folder_name}`);
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
        fs.writeFile(`${dataFolder}/${toonTitle}/api_chapter_meta.json`, json, (err, data) => {
            if (err) {
                console.error(err)
            }
        });
    });
}
