const restify = require('restify');

class Server {
  constructor(config) {
    this.config  = config;
    this.restify = this.setupRestify();
  }

  setupRestify() {
    const server = restify.createServer({});

    server.use(restify.plugins.bodyParser());

    server.post('notify', this.handleWebhook.bind(this));
    server.get('/a', this.handleHomepage.bind(this));

    return server;
  }

  handleWebhook(req, res, next) {
    const payloadText = req.body.payload;
    const payload = JSON.parse(payloadText);

    console.log(`Got a notification`, {
      branch: payload.branch,
      state: payload.state,
    });

    res.send({status: 'ack'});
    next();
  }

  handleHomepage(req, res, next) {
    res.send(this.config.defaultMessage);
    next();
  }

  run() {
    console.log('Running');
    this.restify.listen(this.config.port, () => {
      console.log(`${this.restify.name} listening at ${this.restify.url}`);
    });
  }
}

module.exports = Server;
