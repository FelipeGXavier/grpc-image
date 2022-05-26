# python -m grpc_tools.protoc -I./proto --python_out=./server --grpc_python_out=./server ./proto/image.proto

from math import floor
import grpc
from concurrent import futures

import image_pb2_grpc as pb2_grpc
import image_pb2 as pb2

class ImageProcessor(pb2_grpc.ImageProcessorServicer):

    def GetAveragePixel(self, request, context):
        pixels = request.pixelPoint
        average = floor(sum(pixels) / len(pixels))
        print('Request received', pixels)
        return pb2.AveragePixel(average=average)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    pb2_grpc.add_ImageProcessorServicer_to_server(ImageProcessor(), server)
    server.add_insecure_port('[::]:50051')
    print("Listen on port 50051")
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()

