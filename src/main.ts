import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { BskyAgent } from '@atproto/api';
import { ButtplugBrowserWebsocketClientConnector, ButtplugClient } from 'buttplug';

const client = new ButtplugClient("buttsky");
const connector = new ButtplugBrowserWebsocketClientConnector("ws://localhost:12345");
client.connect(connector).then(() => console.log("Buttsky Connected to Intiface Central"));

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

agent.login({identifier: 'buttplug.engineer', password: '7rba-bsvf-zune-2lix'}).then(() => {
  console.log("Bluesky account connected");
  agent.countUnreadNotifications().then((v) => console.log(`${v.data.count} UNREAD POSTS`));
}).catch((e) => console.log(`ERROR: ${e}`));

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
