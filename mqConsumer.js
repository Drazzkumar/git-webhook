
const q= 'tasks';

const open = require('amqplib').connect('amqp://ccwbppts:yVCi5qiIM1plKVvKsO5EX3rJqA064pZL@moose.rmq.cloudamqp.com/ccwbppts');

// Consumer
open.then(function(conn) {
  return conn.createChannel();
}).then(function(ch) {
  return ch.assertQueue(q).then(function(ok) {
    return ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log("Cunsumer",msg.content.toString());
        ch.ack(msg);
      }
    });
  });
}).catch(console.warn);
