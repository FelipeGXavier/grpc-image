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
    const generatedPixels = []
    const pixels = data.map(x => x.average)
    for (let i = 0; i < pixels.length; i++) {
        const newPixels = Array(4).fill(pixels[i])
        generatedPixels.push(...newPixels)
    }
    const image = []
    let idx = 0
    for (let i = 0; i < 800; i++) {
        const line = []
        for (let x = 0; x < 800; x++) {
            line.push(generatedPixels[idx++])
        }
        image.push(line)
    }
    return image
}

const transformImage = async (matrixImage, rpcClient) => {
    const firstHalfMatrix = matrixImage.slice(0, 400)
    const secondHalfMatrix = matrixImage.slice(400, 800)
    const promises = [...createPromisesFromMatrix(firstHalfMatrix, 0), ...createPromisesFromMatrix(secondHalfMatrix, 400, rpcClient)]
    const result = await Promise.all(promises)
    result.sort(function (a, b) {
        return a.row - b.row || a.cols - b.cols
    })
    return mountNewMatrix(result)
}

module.exports.transformImage = transformImage

