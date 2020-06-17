const fs = require('fs');
let dataFolder = 'public/data'
let toons = fs.readFileSync('api_data_meta.json');
toons = JSON.parse(toons);

for (let idx in toons) {
    checkDirectory(toons[idx]);
}

function checkDirectory(toon) {
    // 만화 제목 변경.
    let errorDirs = [];
    try {
        // console.info(`${dataFolder}/${toon.title}`, `${dataFolder}/toon_${toon.id}`)
        fs.rename(`${dataFolder}/${toon.title}`, `${dataFolder}/toon_${toon.id}`, function(err) {
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
}
