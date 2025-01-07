import Bull from 'bull';

export const QUEUE_NAME = 'scraper-queue';

// Redis configuration
export const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Queue configuration
export const createQueue = () => {
  const queue = new Bull(QUEUE_NAME, {
    redis: REDIS_CONFIG,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000, // Initial delay of 1 second
      },
      removeOnComplete: false,
      removeOnFail: false,
    },
  });

  // Basic queue event handlers
  queue.on('error', (error) => {
    console.error('Queue error:', error);
  });

  queue.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed:`, error);
  });

  return queue;
};
