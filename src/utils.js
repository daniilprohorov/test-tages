const fs = require('fs')
const events = require("events");
const readLine = require("readline");

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
}

const createLine = () => {
    const number = getRandomInt(1001)
    return `${number}\n`;
}

const createTestFile = async (filename, n) => {
    let canWrite = false
    const writeStream = fs.createWriteStream(filename)
    for (let i = 0; i < n; i++) {
        canWrite = writeStream.write(createLine())
        if (!canWrite) {
            await events.once(writeStream, 'drain')
        }
    }
    writeStream.end()
}
const createTestFileMb = (filename, sizeMb) => {
    const n = Math.floor((sizeMb / 4) * 1024 * 1024)
    return createTestFile(filename, n)
}

const sortFile = async (filename) => {
    const filenameS = filename.split('.')[0] + 'S.' + filename.split('.')[1]
    const writeStream = fs.createWriteStream(filenameS)
    const array = []
    const rl = readLine.createInterface({
        input: fs.createReadStream(filename),
        crlfDelay: Infinity,
    });
    for await (const line of rl) {
        const number = Number(line)
        array.push(number)
    }
    console.log(array)

    const arrayS = array.sort((a, b) => a - b)

    console.log(arrayS)
    let canWrite = false
    for (const element of arrayS) {
        canWrite = writeStream.write(`${element}\n`)
        if (!canWrite) {
            await events.once(writeStream, 'drain')
        }
    }
    writeStream.end()

}

const isSorted = async (filename) => {
    let max = 0;
    try {
        const rl = readLine.createInterface({
            input: fs.createReadStream(filename),
            crlfDelay: Infinity,
        });
        rl.line
        for await (const line of rl) {
            const number = Number(line)
            if (max > number) {
                throw 'NotSorted'
            }
            max = number
        }
        return true

    } catch (err) {
        console.error(err);
        return false
    }
}
//createTestFileMb('testFile.txt', 100)
//sortFile('testFile.txt')
// createTestFile('test1.txt', 100)
//     .then(
//         sortFile('test1.txt')
//     )
//     .then(() => {
//         console.log(isSorted('test1S.txt'))
//     })
isSorted('testFileS.txt').then((res) => console.log(res))


