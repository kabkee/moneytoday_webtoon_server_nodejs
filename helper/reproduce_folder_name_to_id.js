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
    // 캡터 폴더 변경.
    fs.readFile(`${dataFolder}/${toonTitle}/api_chapter_meta.json`, (err, data) => {
        if (err) throw err;
        chapters = JSON.parse(data);

        let toonMeta = fs.readFileSync(`${dataFolder}/${toonTitle}/api_meta.json`, () => {});
        toonMeta = JSON.parse(toonMeta);

        chapters.forEach((item, index, array) => {
            let errorDirs = [];
            try {
                let cleanFolderName = item.folder_name.replace(/\?/g, '').replace(/\./g, '').trim();
                // console.info(`${dataFolder}/${toonTitle}/${cleanFolderName}`, `${dataFolder}/${toonTitle}/episode_${item.id}`)
                fs.rename(`${dataFolder}/${toonTitle}/${cleanFolderName}`, `${dataFolder}/${toonTitle}/episode_${item.id}`, function(err) {
                    if (err) {
                        errorDirs.push(`${dataFolder}/${toonTitle}/${cleanFolderName}`);
                    }
                })
            } catch (error) {
                console.error(error)
            }

            if (errorDirs.length) {
                fs.appendFile(`rename_error_folder_log.txt`, JSON.stringify(errorDirs), (err, data) => {
                    if (err) {
                        console.error(err)
                    }
                });
            }

        });
    });
}
