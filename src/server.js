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

  handleHomepage(req, res, next) {
    res.send(this.config.defaultMessage);
    next();
  }

  handleWebhook(req, res, next) {
    const payloadText = req.body.payload;
    const payload = JSON.parse(payloadText);

    // @see https://docs.travis-ci.com/user/notifications/#Webhooks-Delivery-Format
    this.handleBuildStatus(payload.branch, payload.state, payload.pull_request)

    res.send({status: 'ack'});
    next();
  }

  handleBuildStatus(branch, state, is_pull_request) {
    console.log(`Got a notification`, {
      branch,
      state,
      is_pull_request
    });
  }

  run() {
    console.log('Running');
    this.restify.listen(this.config.port, () => {
      console.log(`${this.restify.name} listening at ${this.restify.url}`);
    });
  }
}

module.exports = Server;
