import { Job } from 'bull';
import { scraperQueue } from './queue';
import { SCRAPER_CONFIG } from './config';
import { logger } from '../../utils/logger';

async function handlePeriodicScrape(job: Job) {
  logger.info(`Starting periodic scrape job ${job.id}`);
  // TODO: Implement actual scraping logic
  await new Promise(resolve => setTimeout(resolve, 1000));
  logger.info(`Completed periodic scrape job ${job.id}`);
}

async function handleOnDemandScrape(job: Job) {
  const { storeIds } = job.data;
  logger.info(`Starting on-demand scrape job ${job.id} for stores: ${storeIds.join(', ')}`);
  // TODO: Implement actual scraping logic
  await new Promise(resolve => setTimeout(resolve, 1000));
  logger.info(`Completed on-demand scrape job ${job.id}`);
}

// Process jobs
scraperQueue.process(SCRAPER_CONFIG.JOB_TYPES.PERIODIC_SCRAPE, handlePeriodicScrape);
scraperQueue.process(SCRAPER_CONFIG.JOB_TYPES.ON_DEMAND_SCRAPE, handleOnDemandScrape);
