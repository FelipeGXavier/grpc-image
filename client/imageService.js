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
    const rowSize = dimension[0]
    const colSize = dimension[1]
    const matrix = [
        []
    ]
    // Skip first two lines
    let idx = 2
    for (let i = 0; i < rowSize; i++) {
        for (let x = 0; x < colSize; x++) {
            matrix[i][x] = lines[idx++]
        }
    }
    return matrix
}

const run = () => {
    const rawImage = readImage()
    const matrix = createMatrix(rawImage)
}

run()
