import { scraperQueue } from './queue';
import { SCRAPER_CONFIG } from './config';
import { logger } from '../../utils/logger';

export class ScraperScheduler {
  private static instance: ScraperScheduler;

  private constructor() {}

  static getInstance(): ScraperScheduler {
    if (!ScraperScheduler.instance) {
      ScraperScheduler.instance = new ScraperScheduler();
    }
    return ScraperScheduler.instance;
  }

  async schedulePeriodicScraping() {
    try {
      await scraperQueue.add(
        SCRAPER_CONFIG.JOB_TYPES.PERIODIC_SCRAPE,
        { timestamp: Date.now() },
        {
          repeat: {
            cron: SCRAPER_CONFIG.DEFAULT_SCHEDULE
          }
        }
      );
      logger.info('Periodic scraping scheduled successfully');
    } catch (error) {
      logger.error('Failed to schedule periodic scraping:', error);
      throw error;
    }
  }

  async triggerOnDemandScraping(storeIds: string[]) {
    try {
      await scraperQueue.add(
        SCRAPER_CONFIG.JOB_TYPES.ON_DEMAND_SCRAPE,
        {
          timestamp: Date.now(),
          storeIds
        }
      );
      logger.info(`On-demand scraping triggered for stores: ${storeIds.join(', ')}`);
    } catch (error) {
      logger.error('Failed to trigger on-demand scraping:', error);
      throw error;
    }
  }

  async getQueueStatus() {
    try {
      const [waiting, active, completed, failed] = await Promise.all([
        scraperQueue.getWaitingCount(),
        scraperQueue.getActiveCount(),
        scraperQueue.getCompletedCount(),
        scraperQueue.getFailedCount()
      ]);

      return {
        waiting,
        active,
        completed,
        failed
      };
    } catch (error) {
      logger.error('Failed to get queue status:', error);
      throw error;
    }
  }
}
