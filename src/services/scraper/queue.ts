import Bull from 'bull';
import { SCRAPER_CONFIG } from './config';
import { logger } from '../../utils/logger';

// Create the main scraper queue
export const scraperQueue = new Bull(SCRAPER_CONFIG.QUEUE_NAME, {
  redis: SCRAPER_CONFIG.REDIS_URL,
  defaultJobOptions: {
    attempts: SCRAPER_CONFIG.RETRY_ATTEMPTS,
    backoff: {
      type: 'exponential',
      delay: SCRAPER_CONFIG.RETRY_DELAY
    }
  }
});

// Queue event handlers
scraperQueue.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

scraperQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed: ${err.message}`);
});

scraperQueue.on('error', (error) => {
  logger.error('Queue error:', error);
});

// Health monitoring
setInterval(async () => {
  try {
    const isHealthy = await scraperQueue.isReady();
    logger.debug(`Queue health check - Status: ${isHealthy ? 'healthy' : 'unhealthy'}`);
  } catch (error) {
    logger.error('Queue health check failed:', error);
  }
}, SCRAPER_CONFIG.HEALTH_CHECK_INTERVAL);
