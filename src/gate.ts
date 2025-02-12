import mf from "mineflayer";
import { isAwaitKeyword } from "typescript";

function sleep(ms: number): void {
  const buffer = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(buffer, 0, 0, ms);
}

export default class Gate {
  host: string;
  version: string;
  username: string;
  password: string;
  label: string;

  isReady: boolean = false;

  instance: mf.Bot;

  constructor(
    host: string,
    version: string,
    username: string,
    password: string,
    label: string,
  ) {
    this.host = host;
    this.version = version;
    this.username = username;
    this.password = password;
    this.label = label;

    this.instance = mf.createBot({
      host: this.host,
      username: this.username,
      auth: "offline",
      version: this.version,
    });

    this.instance.on("spawn", this.onSpawn.bind(this));
  }

  async onSpawn(): Promise<void> {
    const { game } = this.instance;
    // console.log("Brand: ", game.serverBrand);
    // console.log("Type: ", game.levelType);
    // console.log("GameMode: ", game.gameMode);
    // console.log("Dimension: ", game.dimension);
    // console.log("Difficulty: ", game.difficulty);

    if (game.levelType == "flat" && game.gameMode == "adventure") {
      // lobby identifiers
      // these might change in the future

      this.isReady = false;

      await this.instance.waitForTicks(20 * 1); // wait 1 sec
      this.instance.chat(`/l ${this.password}`); // log in
      this.log("Logged in!");

      await this.instance.waitForTicks(20 * 2); // wait 2 sec
      this.instance.setQuickBarSlot(0); // switch to section selector
      this.instance.activateItem(false); // use section selector
      this.log("Activated Section Selector!");

      await this.instance.waitForTicks(20 * 2); // wait 2 sec
      await this.instance.simpleClick.leftMouse(38); // select anarchy
      this.log("Joining Anarchy!");
      // should now spawn in anarchy
    } else if (game.levelType == "default" && game.gameMode == "survival") {
      // anarchy identifiers (probably)
      // these might change in the future

      await this.instance.waitForTicks(20 * 1); // wait 1 sec
      this.isReady = true; // on anarchy
    } else {
      this.error("I am lost in a world I don't know!");
    }
  }

  log(message: any): void {
    console.log(`[${this.username}]: `, message);
  }

  error(message: any): void {
    console.error(`[${this.username}]: `, message);
  }
}
