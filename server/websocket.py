import websockets
import asyncio
import os

connected_websockets = set()

async def echo(websocket, path):
    connected_websockets.add(websocket)
    try:
        async for message in websocket:
            await websocket.send(message)
    finally:
        connected_websockets.remove(websocket)

async def send_message(message):
    try:
        for websocket in connected_websockets.copy():
            await websocket.send(message)

    except RuntimeError:
        pass

def send_message_sync(message):
    asyncio.run_coroutine_threadsafe(send_message(message), asyncio.get_event_loop())

async def main():
    async with websockets.serve(echo, os.environ.get('SERVER_HOST'), int(os.environ.get('WEBSOCKET_PORT'))):
        await asyncio.Future()