/*
 * To tie everything together, we must instantiate our Action Handler and Action Reader, and instantiate an Action
 * Watcher with both of those.
 */

const { BaseActionWatcher } = require('demux');
const { NodeosActionReader } = require('demux-eos');
const mongoose = require('mongoose');

const ObjectActionHandler = require('./ObjectActionHandler');
const handlerVersion = require('./handlerVersions/v1');
const config = require('./config');

console.log(`Enviroment: ${process.env.NODE_ENV}`);

// connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to database.');

  /*
   * This ObjectActionHandler, which does not change the signature from its parent AbstractActionHandler, takes an array
   * of `HandlerVersion` objects
   */
  const actionHandler = new ObjectActionHandler([handlerVersion]);

  /*
   * Since we're reading from the EOS main net, we can use the NodeosActionReader supplied by the demux-eos package. This
   * utilizes any public Nodeos endpoint as a source of block data.
   *
   * The second argument defines at what block this should start at. For values less than 1, this switches to a "tail"
   * mode, where we start at an offset of the most recent blocks.
   *
   * More information can be found on the main demux-eos repository:
   * https://github.com/EOSIO/demux-js-eos
   */
  const actionReader = new NodeosActionReader(
    config.eos.host,
    0,
  );

  /* BaseActionWatcher
   * This ready-to-use base class helps coordinate the Action Reader and Action Handler, passing through block information
   * from the Reader to the Handler. The third argument is the polling loop interval in milliseconds. Since EOS has 0.5s
   * block times, we set this to half that for an average of 125ms latency.
   *
   * All that is left to run everything is to call `watch()`.
   */
  const actionWatcher = new BaseActionWatcher(
    actionReader,
    actionHandler,
    250,
  );

  actionWatcher.watch();
});
