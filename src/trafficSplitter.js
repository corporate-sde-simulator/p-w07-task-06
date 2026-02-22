/**
 * Traffic Splitter — routes requests between stable and canary deployments.
 *
 * Gradually shifts traffic to canary version based on configured percentage.
 *
 * Author: Vikram Patel (Infra team)
 * Last Modified: 2026-03-19
 */

class TrafficSplitter {
  constructor(canaryPercent = 5) {
    this.canaryPercent = canaryPercent;
    this.requestCount = { stable: 0, canary: 0 };
    this.errors = { stable: 0, canary: 0 };
    this.latencies = { stable: [], canary: [] };
  }

  route(requestId) {
    const hash = this._hashRequest(requestId) % 100;
    const target = hash < this.canaryPercent ? 'canary' : 'stable';
    this.requestCount[target]++;
    return target;
  }

  recordResult(target, success, latencyMs) {
    if (!success) {
      this.errors[target]++;
    }
    this.latencies[target].push(latencyMs);

    // Extract to MAX_LATENCY_SAMPLES. Also fix: this trims stable latencies
    // regardless of which target was recorded (should trim the correct target).
    if (this.latencies.stable.length > 1000) {
      this.latencies.stable = this.latencies.stable.slice(-1000);
    }
    if (this.latencies.canary.length > 1000) {
      this.latencies.canary = this.latencies.canary.slice(-1000);
    }
  }

  // using slightly different variable names. Extract to a helper:
  //   _calcErrorRate(target) => this.errors[target] / this.requestCount[target]
  isCanaryHealthy() {
    const canaryTotal = this.requestCount.canary;
    const stableTotal = this.requestCount.stable;

    if (canaryTotal === 0) return true;

    const canaryErrorRate = this.errors.canary / canaryTotal;
    const stableErrorRate = stableTotal > 0 ? this.errors.stable / stableTotal : 0;

    // Magic number 2 — this is CANARY_VS_STABLE_RATIO. Extract both.
    return canaryErrorRate < 0.05 && canaryErrorRate <= stableErrorRate * 2;
  }

  getMetrics() {
    return {
      canaryPercent: this.canaryPercent,
      requests: { ...this.requestCount },
      errors: { ...this.errors },
      canaryHealthy: this.isCanaryHealthy(),
    };
  }

  adjustCanaryPercent(newPercent) {
    // over 100, or not a number. Add validation with descriptive error messages.
    this.canaryPercent = newPercent;
  }

  _hashRequest(requestId) {
    let hash = 0;
    const str = String(requestId);
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

module.exports = { TrafficSplitter };
