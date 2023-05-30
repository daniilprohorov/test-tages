const fs = require('fs')

class FileRead {
    constructor(filename, bufferLength = 10) {
        this.i = 0
        this.bufferLength = bufferLength
        this.data = []
        this.rightRemainder = ''
        this.file = fs.openSync(filename, 'r')
    }
    get() {
        let value = Buffer.alloc(this.bufferLength)
        let countRead = fs.readSync(this.file, value, 0, this.bufferLength, this.i)
        if (countRead > 0) {
            let lines = value.toString().split('\n')
            let buffer
            if (this.i === 0) {
                buffer = lines.slice(0, -1)
                this.rightRemainder = lines.slice(-1)[0]
            } else {
                lines[0] = this.rightRemainder + lines[0]
                buffer = lines.slice(0, -1)
                this.rightRemainder = lines.slice(-1)[0]
            }
            this.data.push(...buffer.map(s => Number(s)).filter(n => !isNaN(n)))
            this.i += this.bufferLength
        } else if (this.rightRemainder !== '' && this.rightRemainder !== '\n' && this.rightRemainder !== null) {
            const re = /\d+/g
            const value = this.rightRemainder.match(re)[0]
            if (value !== undefined) {
                this.data.push(Number(value))
            }
            this.rightRemainder = null
        }
        let res = this.data.shift()
        if (res !== undefined) {
            return res
        } else {
            return null
        }
    }
}

class FileWrite {
    constructor(filename, bufferLength = 10) {
        this.i = 0
        this.bufferLength = bufferLength
        this.data = []
        this.filename = filename
        this.start = true
    }

    write(value) {
        this.data.push(value)
        this.i += 1
        if (this.i === this.bufferLength - 1) {
            let str
            if (this.start) {
                str = this.data.join('\n')
                this.start = false
            } else {
                str = '\n' + this.data.join('\n')
            }
            fs.appendFileSync(this.filename, str, {encoding: 'utf-8'})
            this.data = []
            this.i = 0
        }
    }

    writeRemaindedData() {
        if (this.data.length > 0) {
            const str = '\n' + this.data.join('\n')
            fs.appendFileSync(this.filename, str, {encoding: 'utf-8'})
        }
    }
}

module.exports = {
    FileRead,
    FileWrite
}