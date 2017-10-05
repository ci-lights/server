const Server = require('./src/server');
const info = require('./package.json');

const config = {
  port: process.env.PORT || 8000,
  defaultMessage: {
    name: info.name,
    version: info.version,
    description: info.description,
    homepage: info.homepage,
  },
};

new Server(config).run();
