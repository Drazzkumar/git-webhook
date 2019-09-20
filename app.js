
const express = require('express');
const bodyParser=require('body-parser');
const app = express();


const q= 'tasks';

const open = require('amqplib').connect('amqp://ccwbppts:yVCi5qiIM1plKVvKsO5EX3rJqA064pZL@moose.rmq.cloudamqp.com/ccwbppts');

const APP_PORT =
  (process.env.NODE_ENV === 'test' ? process.env.TEST_APP_PORT : process.env.APP_PORT) || process.env.PORT || '3000';

app.use(bodyParser.json())

app.get('/api/trigger',(req,res)=>{
  // Publisher
  console.log("Rabbit MQ triggered ")
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      return ch.sendToQueue(q, Buffer.from('This is TESTi_APP1'))
    });
  }).catch(console.warn);
  res.send({message:"ok"})
})

app.post('/api/trigger',(req,res)=>{
  // Publisher
  console.log("Rabbit MQ triggered ")
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      return ch.sendToQueue(q, Buffer.from('DATA',JSON.stringfy(req.body)))
    });
  }).catch(console.warn);
  res.send({message:"ok"})
})

app.get('/api/consume',(req,res)=>{
  // Consumer
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      return ch.consume(q, function(msg) {
        if (msg !== null) {
          console.log("Consumer",msg.content.toString());
          ch.ack(msg);
        }
      });
    });
  }).catch(console.warn);
  res.send({message:"OK"})
})

app.listen(APP_PORT,()=>console.log("App is running on port ",APP_PORT))
