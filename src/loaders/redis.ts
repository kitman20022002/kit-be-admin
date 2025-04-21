/* eslint-disable no-console */
import { createClient } from 'redis';

let redisClient:any;
module.exports = async function () {
  
  redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: 'redis-11756.c291.ap-southeast-2-1.ec2.cloud.redislabs.com',
      port: 11756,
    },
  });
  // console.log(redisClient);
  redisClient.on('error', (err:any) => {
    console.error('Error connecting to Redis:', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

//   redisClient.set('test-key', 'Hello Redis!', (err: any) => {
//     if (err) {
//       console.error('Error setting key:', err);
//     } else {
//       console.log('Key set successfully');
//     }
//   });
};

export default redisClient;
