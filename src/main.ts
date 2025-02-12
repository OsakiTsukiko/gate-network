import mineflayer from "mineflayer";
import conf from "../conf.json";
import Gate from "./gate";

let user_list: Gate[] = [];
for (let user of conf.users) {
  let gate = new Gate(
    conf.host,
    "1.18.2",
    user.username,
    user.password,
    user.label,
  );
}
