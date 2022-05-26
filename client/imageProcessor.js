const averagePixel = (pixels, meta) => {
    const sum = pixels.reduce((partialSum, a) => partialSum + a, 0);
    return { average: Math.floor(sum / pixels.length), ...meta }
}

const processAveragePixelLocally = (pixels, row, startOffset, endOffset) => {
    return new Promise((res, rej) => {
        res(averagePixel(pixels, { row, cols: `${startOffset};${endOffset}` }))
    })
}

const processAveragePixelRemote = (pixels, row, startOffset, endOffset, rpcClient) => {
    return new Promise((res, rej) => {
        rpcClient.GetAveragePixel({ pixelPoint: pixels }, function (err, response) {
            if (err) {
                console.log(err)
                rej(err)
            }
            res(Object.assign(response, { row, cols: `${startOffset};${endOffset}` }))
        });
    })

}

const createPromisesFromMatrix = (matrix, startOffset, rpcClient = null) => {
    const promises = []
    for (let i = 0; i < matrix.length; i++) {
        for (let x = 0; x < matrix[0].length; x++) {
            const pixels = matrix[i].slice(x, x + 4)
            if (rpcClient == null) {
                promises.push(processAveragePixelLocally(pixels, i + startOffset, x, x + 3))
            } else {
                promises.push(processAveragePixelRemote(pixels, i + startOffset, x, x + 3, rpcClient))
            }
            x = x + 3
        }
    }
    return promises
}


const mountNewMatrix = (data) => {
    const matrix = Array(800).fill(Array(800))
    for (let i = 0; i < data.length; i++) {
        const average = parseInt(data[i].average)
        const row = parseInt(data[i].row)
        const cols = data[i].cols.split(";")
        for (let x = parseInt(cols[0]); x <= parseInt(cols[1]); x++) {
            matrix[row][x] = average
        }
    }
    return matrix
}

const transformImage = async (matrixImage, rpcClient) => {
    const firstHalfMatrix = matrixImage.slice(0, 400)
    const secondHalfMatrix = matrixImage.slice(400, 800)
    const promises = [...createPromisesFromMatrix(firstHalfMatrix, 0), ...createPromisesFromMatrix(secondHalfMatrix, 400, rpcClient)]
    const result = await Promise.all(promises)
    return mountNewMatrix(result)
}

module.exports.transformImage = transformImage

