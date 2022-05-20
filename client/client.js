const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.resolve('../grpc-image', './proto/image.proto');
console.log(PROTO_PATH)
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

client.GetAveragePixel([0,1,2,3], function(err, response) {
    console.log(response);
});