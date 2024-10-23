import redis from 'redis';

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on('error', (err) => console.error('Redis error', err));

const connectRedis = async () => {
  await client.connect();
  console.log('Connected to Redis');
};

export { client, connectRedis };
