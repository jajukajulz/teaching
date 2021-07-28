const fs = require('fs')

const folderName = 'data'

try {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
    }
} catch (err) {
    console.error(err)
}