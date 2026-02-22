/**
 * Canary Analyzer — monitors canary deployment health and advises promotion/rollback.
 *
 * Author: Vikram Patel (Infra team)
 * Last Modified: 2026-03-19
 */

class CanaryAnalyzer {
  constructor(splitter, config = {}) {
    this.splitter = splitter;
    this.promotionThreshold = config.promotionThreshold || 100;
    this.errorRateLimit = config.errorRateLimit || 0.05;
    this.minSamples = config.minSamples || 50;
    this.analysisHistory = [];
  }

  analyze() {
    const metrics = this.splitter.getMetrics();
    const canaryRequests = metrics.requests.canary || 0;

    if (canaryRequests < this.minSamples) {
      return this._record({
        action: 'wait',
        reason: 'Insufficient canary traffic for analysis',
        canaryRequests,
        minRequired: this.minSamples,
      });
    }

    const errorRate = metrics.errors.canary / canaryRequests;

    if (errorRate > this.errorRateLimit) {
      return this._record({
        action: 'rollback',
        reason: Canary error rate % exceeds limit %,
        errorRate,
        limit: this.errorRateLimit,
      });
    }

    if (canaryRequests >= this.promotionThreshold && metrics.canaryHealthy) {
      return this._record({
        action: 'promote',
        reason: Canary healthy after  requests,
        canaryRequests,
        errorRate,
      });
    }

    return this._record({
      action: 'continue',
      reason: Canary healthy but needs more traffic (/),
      canaryRequests,
      errorRate,
    });
  }

  _record(analysis) {
    analysis.timestamp = new Date().toISOString();
    this.analysisHistory.push(analysis);
    return analysis;
  }

  getHistory() {
    return [...this.analysisHistory];
  }
}

module.exports = { CanaryAnalyzer };
