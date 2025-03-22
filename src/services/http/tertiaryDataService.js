import BaseDataService from './baseDataService';

/**
 * Tertiary data service for handling tertiary datasource operations
 */
class TertiaryDataService extends BaseDataService {
  constructor() {
    super();
    // Mock data for tertiary datasource that matches tertiarySchema structure
    this.mockData = {
      objectives: [
        { value: 'visits', label: 'Website Visits' },
        { value: 'awareness', label: 'Brand Awareness' },
        { value: 'conversions', label: 'Conversions' }
      ],
      biddingStrategies: [
        { value: 'manual', label: 'Manual Bidding' },
        { value: 'auto', label: 'Automatic Bidding' }
      ]
    };
  }


  /**
   * Get all project objectives
   * @returns {Promise} - Promise that resolves with the objectives
   */
  getObjectives() {
    return this.httpService.get('/api/tertiary/objectives', this.mockData.objectives);
  }

  /**
   * Get all bidding strategies
   * @returns {Promise} - Promise that resolves with the bidding strategies
   */
  getBiddingStrategies() {
    return this.httpService.get('/api/tertiary/bidding-strategies', this.mockData.biddingStrategies);
  }
}

// Create and export a singleton instance
const tertiaryDataService = new TertiaryDataService();
export default tertiaryDataService;
