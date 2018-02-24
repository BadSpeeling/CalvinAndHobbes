function getNewComic() {

    const fs = require('fs');
    var files = fs.readdirSync('/comics/')

    return files[0]

}

console.log (getNewComic())