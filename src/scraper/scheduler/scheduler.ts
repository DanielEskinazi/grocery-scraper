import { CronJob } from 'cron';
import { Queue } from 'bull';
import { Logger } from '../utils/logger';

export class ScraperScheduler {
  private jobs: Map<string, CronJob> = new Map();
  private logger: Logger;

  constructor(private queue: Queue) {
    this.logger = new Logger('Scheduler');
  }

  scheduleJob(storeName: string, cronPattern: string): void {
    const job = new CronJob(cronPattern, async () => {
      try {
        await this.queue.add(
          'scrape',
          { storeName },
          { jobId: `${storeName}-${Date.now()}` }
        );
        this.logger.info(`Scheduled job created for ${storeName}`);
      } catch (error) {
        this.logger.error(`Error scheduling job for ${storeName}:`, error);
      }
    });

    this.jobs.set(storeName, job);
    job.start();
    this.logger.info(`Scheduled scraping job for ${storeName} with pattern: ${cronPattern}`);
  }

  stopJob(storeName: string): void {
    const job = this.jobs.get(storeName);
    if (job) {
      job.stop();
      this.jobs.delete(storeName);
      this.logger.info(`Stopped scraping job for ${storeName}`);
    }
  }

  stopAllJobs(): void {
    this.jobs.forEach((job, storeName) => {
      job.stop();
      this.logger.info(`Stopped scraping job for ${storeName}`);
    });
    this.jobs.clear();
  }
}