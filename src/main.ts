import './style.css'
import { BskyAgent } from '@atproto/api';
import { ButtplugBrowserWebsocketClientConnector, ButtplugClient } from 'buttplug';

const client = new ButtplugClient("buttsky");
const agent = new BskyAgent({
  service: 'https://bsky.social',
});

let device;
let characteristic: any;

async function connectToIntiface() {
  const connector = new ButtplugBrowserWebsocketClientConnector("ws://localhost:12345");
  await client.connect(connector);
  console.log("Buttsky Connected to Intiface Central");
}

async function connectToBluesky() {
  let user = (document.querySelector("#bsuser") as any).value;
  let pass = (document.querySelector("#bspass") as any).value;
  await agent.login({ identifier: user, password: pass });
  console.log("Bluesky account connected");
  agent.countUnreadNotifications().then((v) => console.log(`${v.data.count} UNREAD POSTS`));
  followNotificationCount();
}

async function connectToMiTail() {
  device = await (navigator as any).bluetooth.requestDevice({
    filters: [{ name: "mitail" }], optionalServices: ['battery_service', '3af2108b-d066-42da-a7d4-55648fa0a9b6']
  });

  console.log('Connecting to GATT Server...');
  const server = await device.gatt.connect();

  console.log('Getting Battery Service...');
  const service = await server.getPrimaryService('3af2108b-d066-42da-a7d4-55648fa0a9b6');

  console.log('Getting Battery Level Characteristic...');
  characteristic = await service.getCharacteristic('5bfd6484-ddee-4723-bfe6-b653372bbfd6');

  console.log('Reading Battery Level...');
  await characteristic.writeValue(new TextEncoder().encode("TAILSH"));
}

let stopNotifications = false;

async function followNotificationCount() {
  stopNotifications = false;
  let lastCount = 0;
  while (!stopNotifications) {
    let notifications = await agent.countUnreadNotifications();
    let count = notifications.data.count - lastCount;
    console.log(`Notifications: ${notifications.data.count} Delta: ${count}`);
    (document.querySelector("#status") as any).innerHTML = `Notifications: ${notifications.data.count} Delta: ${count}`;
    lastCount = notifications.data.count;
    if (characteristic !== undefined) {
      if (count >= 5) {
        await characteristic.writeValue(new TextEncoder().encode("TAILFA"));
      } else if (count >= 3) {
        await characteristic.writeValue(new TextEncoder().encode("TAILS3"));
      } else if (count >= 1) {
        await characteristic.writeValue(new TextEncoder().encode("TAILS2"));
      }
    }
    if (client.connected) {
      for (var device of client.devices) {
        if (device.vibrateAttributes.length > 0) {
          await device.vibrate(Math.min(count / 5.0, 1.0));
        }
      }
    }
    await new Promise((res) => setTimeout(res, 10000));
  }
}

function stopNotificationCount() {
  console.log("Stopping notification count");
  stopNotifications = true;
}

(window as any).connectToIntiface = connectToIntiface;
(window as any).connectToBluesky = connectToBluesky;
(window as any).followNotificationCount = followNotificationCount;
(window as any).stopNotificationCount = stopNotificationCount;
(window as any).connectToMiTail = connectToMiTail;
