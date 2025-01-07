import { Page } from 'puppeteer';
import { Logger } from '../utils/logger';

export abstract class BaseScraper {
  protected logger: Logger;

  constructor(protected storeName: string) {
    this.logger = new Logger(storeName);
  }

  abstract scrape(page: Page): Promise<any>;

  protected async handleError(error: Error): Promise<void> {
    this.logger.error('Scraping error:', error);
    throw error;
  }

  protected async validateResponse(response: any): Promise<boolean> {
    if (!response) {
      throw new Error('No response received from page');
    }
    return true;
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}