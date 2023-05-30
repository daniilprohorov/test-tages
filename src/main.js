const splitter = require('filesplit')
const path = require('path')
const fileStream = require('./FileStream.js')

const filename = 'testFile2.txt'
const filenameSorted = 'testFile2Sorted.txt'
const filePath = path.join('..', 'test', 'res')

// const splitFile = (filepath, filename, splitNamePrefix, lines) => {
//     const inputFilePath = path.join(filepath, filename)
//     const splitFilesPath = path.join(filepath, splitNamePrefix)
//     return new Promise((resolve, reject) => {
//         const callFunc  = splitter.create([inputFilePath], splitFilesPath, {maxLines: lines})
//         callFunc((error, result) => {
//             if (error) {
//                 reject(error)
//             } else {
//                 resolve(result[''].map(obj => obj.file).map(s => s.split(path.sep).pop()))
//             }
//         });
//     })
// }


const reader = new fileStream.FileRead(path.join(filePath, filename))

const table = {}
let cycleContinue = true
while(cycleContinue) {
    let value = reader.get()
    if (value === null) {
        cycleContinue = false
    } else {
        if (table[value] === undefined) {
            table[value] = 0
        }
        table[value] += 1
    }

}

const writer = new fileStream.FileWrite(path.join(filePath, filenameSorted))
for (let key of Object.keys(table)) {
    for (let i = 0; i < table[key]; i++) {
        writer.write(key)
    }
}
writer.writeRemaindedData()
