import mineflayer from "mineflayer";
import conf from "../conf.json";
import Gate from "./gate";
import { type SBReqBody, isSBReqBody } from "./utils";

let user_list: Gate[] = [];
for (let user of conf.users) {
  console.log(`Loading ${user.username}!`);
  let gate = new Gate(
    conf.host,
    "1.18.2",
    user.username,
    user.password,
    user.label,
  );
  user_list.push(gate);
  await Bun.sleep(1000 * 5);
  // sleep 3 sec in between accounts so it doesnt get flagged to logging in too fast.
}

const server = Bun.serve({
  port: conf.web.port,
  async fetch(req) {
    if (req.headers.has("authorization")) {
      // looking for user token

      const raw_auth = req.headers.get("authorization");
      if (raw_auth != null && raw_auth.length == 23) {
        // check if string looks like a token
        const token = raw_auth.slice(7); // remove prefix

        if (conf.web.tokens.includes(token)) {
          // check if token is registered
          // token is valid

          const url = new URL(req.url);
          switch (url.pathname) {
            case "/ls": {
              // list all gates and availability

              if (req.method != "GET") break;

              let res = []; // result list
              for (let user of user_list) {
                res.push({
                  label: user.label,
                  ready: user.isReady(),
                });
              }
              return new Response(JSON.stringify(res), { status: 200 }); // response with json
              // look into format type
            }

            case "/sb": {
              // set base

              if (req.method != "POST") break;

              let body;
              try {
                body = await req.json();
              } catch {
                break;
              }
              if (!isSBReqBody(body)) break;
              const sb_body = body as SBReqBody;
              const label = sb_body.label;

              for (let user of user_list) {
                if (user.label == label) {
                  if (!user.isReady())
                    return new Response("Gate not Ready!", { status: 500 });

                  user.instance.chat("/clan setbase");
                  return new Response("AOK", { status: 200 });
                }
              }

              return new Response("Gate not found!", { status: 404 });
            }

            default: {
              return new Response("404!", { status: 404 });
            }
          }
        }
      }
    }

    // no token found
    return new Response("Unauthorized!", {
      status: 401,
    });
  },
});

console.log(`Listening on ${server.url}`);
