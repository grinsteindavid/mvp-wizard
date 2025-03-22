import BaseDataService from './baseDataService';

/**
 * Primary data service for handling primary datasource operations
 */
class PrimaryDataService extends BaseDataService {
  constructor() {
    super();
    // Mock data for primary datasource that matches primarySchema structure
    this.mockData = {
      bidStrategies: [
        { value: 'cpc', label: 'Performance Based (CPC)' },
        { value: 'cpm', label: 'Impression Based (CPM)' },
        { value: 'cpv', label: 'Engagement Based (CPV)' }
      ]
    };
  }

  /**
   * Get all bid strategies
   * @returns {Promise} - Promise that resolves with the bid strategies
   */
  getOptimizationStrategies() {
    console.log('Fetching bid strategies...');
    return this.httpService.get('/api/primary/bid-strategies', this.mockData.bidStrategies);
  }
}

// Create and export a singleton instance
const primaryDataService = new PrimaryDataService();
export default primaryDataService;
