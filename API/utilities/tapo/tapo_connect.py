import asyncio
import sys
from plugp100.common.credentials import AuthCredential
from plugp100.new.device_factory import connect, DeviceConnectConfiguration
auth = AuthCredential("annnna6633@gmail.com", "a12345678")

def device_config(auth : AuthCredential, host : str) :
    return DeviceConnectConfiguration(
        host=host,
        credentials=auth
    )

async def example_connect_by_guessing(credentials: AuthCredential, host: str):
    device = await connect(device_config(auth, host))
    await device.update()
    print({
        'type': type(device),
        'protocol': device.protocol_version,
        'raw_state': device.raw_state,
        'components': device.get_device_components
    })
    device.raw_state['device_on'] = True
    print({
        'raw_state': device.raw_state,
    })
    await device.turn_on()
    await device.update()
    print({
        'raw_state': device.raw_state,
    })
async def getinfo(device) :
    await device.update()
    print({
        'type': type(device),
        'protocol': device.protocol_version,
        'raw_state': device.raw_state,
        'components': device.get_device_components
    })
async def main(ip):
    try :
        # await example_connect_by_guessing(auth, ip)
        # auth = AuthCredential("annnna6633@gmail.com", "a12345678")
        await getinfo(await connect(device_config(auth, ip)))
    except Exception as e :
        print(e)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python tapo_connect.py <ip>")
        sys.exit(1)
    # print(sys.argv)
    ip = sys.argv[1]
    loop = asyncio.new_event_loop()
    loop.run_until_complete(main(ip))
    loop.run_until_complete(asyncio.sleep(0.1))
    loop.close()
