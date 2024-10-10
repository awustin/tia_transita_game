# tia_transita_game
A game with Phaser JS

### Development

#### Setup
For first time setup, run `npm install`.

#### Build and serve
Run `npm start` to enable development web server on port `9000`

#### Manual publish to web directory
The script `publish.sh` will copy the contents of `public/` into the web server folder. Such directory will depend on your own web server configuration, it defaults to `/var/www/html`. The script can take a subdirectory as the first argument, that will append to `/var/www/html`.
