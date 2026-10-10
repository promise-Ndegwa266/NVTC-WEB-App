require('dotenv').config();
const redis = require('redis');

const redisUrl = process.env.REDIS_URL

// 1. Initialize and Connect the Redis Client
const redisClient = redis.createClient({
    url: `${redisUrl}`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect in the background (no top-level await needed)
redisClient.connect()
    .then(() => console.log('Connected to Redis successfully.'))
    .catch((err) => console.error('Redis initialization failed:', err));

// 2. Define the Reusable Caching Middleware
function cacheMiddleware(ttlSeconds = 3600) {
    return async (req, res, next) => {
        // Use the request URL path as the unique cache key
        const cacheKey = req.originalUrl || req.url;

        try {
            // Check if cached data exists in Redis
            const cachedData = await redisClient.get(cacheKey);

            if (cachedData) {
                console.log(`Cache Hit for: ${cacheKey}`);
                // Return cached data immediately and stop route execution
                return res.json(JSON.parse(cachedData));
            }

            console.log(`Cache Miss for: ${cacheKey}. Proceeding to route handler...`);

            // Intercept res.json to cache the data before sending it out
            const originalJson = res.json;
            res.json = function (body) {
                // Restore original res.json behavior
                res.json = originalJson;
                
                // Asynchronously save data to Redis with an expiration time (TTL)
                redisClient.setEx(cacheKey, ttlSeconds, JSON.stringify(body))
                    .catch(err => console.error('Redis Save Error:', err));

                return res.json(body);
            };

            next();

        } catch (error) {
            console.error('Cache Middleware Error:', error);
            // Fallback: If Redis fails, skip caching and move to the route handler safely
            next();
        }
    };
}

// 3. Apply the Middleware to Your Route
app.get('/api/heavy-data', cacheMiddleware(60), async (req, res) => {
    // Simulate a heavy operation (like a slow database query)
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    const databaseResult = {
        status: "success",
        data: ["Item A", "Item B", "Item C"],
        generatedAt: new Date().toISOString()
    };

    res.json(databaseResult);
});
