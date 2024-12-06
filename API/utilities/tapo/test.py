import asyncio
from plugp100.common.credentials import AuthCredential
from plugp100.new.device_factory import connect, DeviceConnectConfiguration
auth = AuthCredential("", "")
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
    print({
        'raw_state': device.raw_state,
    }, '\n', '\n')
    await device.turn_on()
    await device.update()
    print({
        'raw_state': device.raw_state,
    })
async def main(ip):
    try :
        await example_connect_by_guessing(auth, ip)
    except Exception as e :
        print(e)
if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    loop.run_until_complete(main('192.168.0.102'))
    loop.run_until_complete(asyncio.sleep(1))
    loop.close()
