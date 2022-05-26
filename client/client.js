const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');

const { getMatrix } = require('./imageService');
const { transformImage } = require('./imageProcessor');

const PROTO_PATH = path.resolve('../', './proto/image.proto')

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const grpService = grpc.loadPackageDefinition(packageDefinition).processor;

const client = new grpService.ImageProcessor('localhost:50051', grpc.credentials.createInsecure());



const run = async () => {
    const matrixImage = getMatrix()
    const transformedImage = transformImage(matrixImage, client)
    console.log(await transformedImage)
}

run()