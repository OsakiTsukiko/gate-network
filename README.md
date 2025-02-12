# Gate Network
A network of bots for easy transportation on the Minecraft Anarchy Server `mc.gamster.org` 

### To install dependencies:

```bash
bun install
```

### To run:
Make a config file named `conf.json` in the root directory with the following inside:
```json
{
  "host": "mc.gamster.org", 
  "users": [
    {
      "username": "username1",
      "password": "password1",
      "label": "label1"
    },
    {
      "username": "username2",
      "password": "password2",
      "label": "label2"
    }
  ],
  "web": {
    "port": 8080,
    "tokens": ["8_byte_length_key_as_hex", "df6c765d1f25c0b3"]
  }
}
```
And run with:
```bash
bun run src/main.ts
```

### To use:
SOON (look into `src/main.ts`)
  
> [!NOTE]  
> gate-network is not affiliated with **mc.gamster.org** in any way.
