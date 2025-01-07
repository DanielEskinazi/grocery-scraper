export const SCRAPER_CONFIG = {
  // Queue configuration
  QUEUE_NAME: 'scraper-queue',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Job types
  JOB_TYPES: {
    PERIODIC_SCRAPE: 'periodic-scrape',
    ON_DEMAND_SCRAPE: 'on-demand-scrape'
  },
  
  // Scheduling
  DEFAULT_SCHEDULE: '0 */1 * * *', // Every hour
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 5000, // 5 seconds
  
  // Monitoring
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  
  // Logging
  LOG_LEVEL: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
};