# RhondaHUD

A GSI based webhud for TF2
Depends on GSI client plugin for TF2

## Installation

Make sure NodeJS LTS along with NPM is installed
Open project directory in CMD and type the following commands

```bash
# Packages are required for later steps
npm install -g yarn npx

# Install dependencies
yarn install
```

### Collections

The server uses NeDB to store all the data of the HUD
The files can be modified manually if admin panel fails, but may get corrupted
If there is any issue replace the file contents with these default contents to reset it
You can change the values if needed

#### config.json

Contents must be one line only
_id has to be `default` to work properly

```json
{"_id":"default","teamblu_name":"Team BLU","teamred_name":"Team RED","announcements":[{"type":"SeriesScore"}],"announcementsDelay":"60","seriesBestOf":"5","seriesWinsTeamBlu":"0","seriesWinsTeamRed":"0"}
```

## Webhud

This part is made using vue

### Build

Contents will be at `/dist/webhud`

```bash
yarn build-vue
```

### Run

If you have a webserver like apache then you can copy the contents of `/dist/webhud` folder and use it as a site for webserver
NOTE: modrewrite is required in webserver to run vue properly
If you do not have a webserver then you can use the following command to run a development server

```bash
yarn serve
```

### Pages

- `/` - Webhud
- `/admin/` - Admin Panel

### Connection

Webhud will try to connect with the server at `localhost:5510` and `localhost:5515` by default
To change this, goto `vue.config.js` and change the values of the following and rebuild

```js
process.env.VUE_APP_ELECTRON_HOST;          // Host location of electron (required if running webhud inside electron)
process.env.VUE_APP_ELECTRON_SOCKET_PORT;   // Socket port of electron (required if running webhud inside electron)
```

## Electron

### Run

```bash
yarn electron

# Or for development electron
yarn dev-electron
```

### Connection

Electron will try to load webhud at `http://localhost:5520` by default
To change this, goto `electron/main.js` and change the following
Requires webhud to be hosted or running

```js
const hudUrl;       // URL path to webhud
```

### Keyboard Shortcuts

- `Alt + Q` : Hide HUD
- `Alt + S` : Minimize HUD
- `Alt + D` : Reload HUD
- `Alt + E` : Open Admin panel
- `Alt + R` : Reload Admin panel

Shortcuts for development

- `Alt + A` : Open devtools for HUD
- `Alt + W` : Open devtools for Admin panel
  
