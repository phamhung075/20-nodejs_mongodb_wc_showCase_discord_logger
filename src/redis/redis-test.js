const Redis = require('ioredis');

const connectionMethods = [
    { host: 'localhost', port: 6379 },
    { host: '127.0.0.1', port: 6379 },
    { host: '172.17.0.2', port: 6379 },
    { host: '192.168.0.21', port: 6379 },
    { host: 'host.docker.internal', port: 6379 }
];

async function tryConnect(index) {
    if (index >= connectionMethods.length) {
        console.log('All connection attempts failed');
        process.exit(1);
        return;
    }

    const { host, port } = connectionMethods[index];
    console.log(`\nAttempting to connect to Redis at ${host}:${port}`);

    const redis = new Redis({
        host: host,
        port: port,
        connectTimeout: 10000,
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
            console.log(`Retry attempt: ${times}`);
            if (times > 3) {
                return null; // stop retrying
            }
            return Math.min(times * 100, 3000);
        }
    });

    redis.on('connect', () => {
        console.log(`Successfully connected to Redis at ${host}:${port}`);
        redis.set('test_key', 'test_value', (err, result) => {
            if (err) {
                console.error('Error setting key:', err);
            } else {
                console.log('Key set successfully:', result);
                redis.get('test_key', (err, result) => {
                    if (err) {
                        console.error('Error getting key:', err);
                    } else {
                        console.log('Retrieved value:', result);
                    }
                    redis.disconnect();
                    process.exit(0);
                });
            }
        });
    });

    redis.on('error', (err) => {
        console.error(`Redis error for ${host}:${port}:`, err.message);
        redis.disconnect();
        tryConnect(index + 1);
    });
}

console.log('Node.js version:', process.version);
console.log('IORedis module version:', require('ioredis/package.json').version);

tryConnect(0);

setTimeout(() => {
    console.log('All connection attempts timed out');
    process.exit(1);
}, 60000);