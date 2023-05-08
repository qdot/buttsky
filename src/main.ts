import './style.css'
import { BskyAgent } from '@atproto/api';
import { ButtplugBrowserWebsocketClientConnector, ButtplugClient } from 'buttplug';

const client = new ButtplugClient("buttsky");
const agent = new BskyAgent({
  service: 'https://bsky.social',
});

async function connectToIntiface() {
  const connector = new ButtplugBrowserWebsocketClientConnector("ws://localhost:12345");
  await client.connect(connector);
  console.log("Buttsky Connected to Intiface Central");
}

async function connectToBluesky() {
  let user = document.querySelector("#bsuser")?.value;
  let pass = document.querySelector("#bspass")?.value;
  await agent.login({identifier: user, password: pass});
  console.log("Bluesky account connected");
  agent.countUnreadNotifications().then((v) => console.log(`${v.data.count} UNREAD POSTS`));
  followNotificationCount();
}

let stopNotifications = false;

async function followNotificationCount() {
  stopNotifications = false;
  while (!stopNotifications) {
    let notifications = await agent.countUnreadNotifications();
    console.log(notifications.data.count);
    await new Promise((res) => setTimeout(res, 5000));
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
