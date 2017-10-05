const Server = require('./src/server');
const config = require('./config.json');

new Server(config).run();
