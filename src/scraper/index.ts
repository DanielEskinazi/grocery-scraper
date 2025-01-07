import { createQueue } from './config/queue.config';
import { ScraperScheduler } from './scheduler/scheduler';
import { Logger } from './utils/logger';

export class ScraperService {
  private queue;
  private scheduler;
  private logger;

  constructor() {
    this.queue = createQueue();
    this.scheduler = new ScraperScheduler(this.queue);
    this.logger = new Logger('ScraperService');
  }

  async initialize() {
    try {
      // Set up queue processor
      this.queue.process('scrape', async (job) => {
        const { storeName } = job.data;
        this.logger.info(`Processing scrape job for ${storeName}`);
        // Implement scraping logic here
      });

      // Set up basic monitoring
      this.queue.on('completed', (job) => {
        this.logger.info(`Job ${job.id} completed`);
      });

      this.queue.on('failed', (job, error) => {
        this.logger.error(`Job ${job.id} failed:`, error);
      });

      this.logger.info('Scraper service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize scraper service:', error);
      throw error;
    }
  }

  scheduleStore(storeName: string, cronPattern: string) {
    this.scheduler.scheduleJob(storeName, cronPattern);
  }

  async triggerScrape(storeName: string) {
    try {
      const job = await this.queue.add(
        'scrape',
        { storeName },
        { jobId: `${storeName}-manual-${Date.now()}` }
      );
      this.logger.info(`Manual scrape triggered for ${storeName}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to trigger scrape for ${storeName}:`, error);
      throw error;
    }
  }

  async shutdown() {
    this.scheduler.stopAllJobs();
    await this.queue.close();
    this.logger.info('Scraper service shut down successfully');
  }
}