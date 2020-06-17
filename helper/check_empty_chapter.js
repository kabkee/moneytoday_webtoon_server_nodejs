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
            checkDirectory(toonTitle.name);
        }
    }
})

function checkDirectory(toonTitle) {
    // 데이터 클리닝
    fs.readFile(`${dataFolder}/${toonTitle}/chapter_meta.json`, (err, data) => {
        if (err) throw err;
        chapters = JSON.parse(data);

        let toonMeta = fs.readFileSync(`${dataFolder}/${toonTitle}/api_meta.json`, () => {});
        toonMeta = JSON.parse(toonMeta);

        chapters.forEach((item, index, array) => {
            let errorDirs = [];
            try {
                let cleanFolderName = item.folder_name.replace(/\?/g, '').replace(/\./g, '').trim();
                let allDirFiles = fs.readdirSync(`${dataFolder}/${toonTitle}/${cleanFolderName}`, { withFileTypes: true }, () => {})
                    // console.info('allDirFiles', allDirFiles.length);
                if (!allDirFiles.length) {
                    errorDirs.push(`${dataFolder}/${toonTitle}/${item.folder_name}`);
                }
            } catch (error) {
                console.error(error)
            }
            // if (errorDirs.length) {
            // fs.appendFile(`error_log.txt`, JSON.stringify(errorDirs), (err, data) => {
            //     if (err) {
            //         console.error(err)
            //     }
            // });
            // console.info(errorDirs)
            // }
            if (errorDirs.length) {
                fs.appendFile(`empty_folder_log.txt`, JSON.stringify(errorDirs), (err, data) => {
                    if (err) {
                        console.error(err)
                    }
                });
            }

        });

        // api제공용 새로운 메타 파일 생성
        // let json = JSON.stringify(chapters);
        // fs.writeFile(`${dataFolder}/${toonTitle}/api_chapter_meta.json`, json, (err, data) => {
        //     if (err) {
        //         console.error(err)
        //     }
        // });
    });
}
