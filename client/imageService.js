const fs = require('fs')
const path = require('path')

const readImage = () => {
    const imagePath = path.resolve('../', 'bin/input_image.pgm')
    const rawImage = fs.readFileSync(imagePath).toString()
    return rawImage
}

const createMatrix = (rawImage) => {
    const lines = rawImage.split("\n")
    const dimension = lines[1].split(" ")
    const rowSize = parseInt(dimension[0])
    const colSize = parseInt(dimension[1])
    const matrix = []
    // Skip first two lines
    let idx = 2
    for (let i = 0; i < rowSize; i++) {
        const line = []
        for (let x = 0; x < colSize; x++) {
            line.push(parseInt(lines[idx]))
            idx++
        }
        matrix.push(line)
    }
    return matrix
}

const getMatrix = () => {
    const rawImage = readImage()
    return createMatrix(rawImage)
}

module.exports.getMatrix = getMatrix


