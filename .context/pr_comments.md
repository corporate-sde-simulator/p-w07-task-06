# PR Review - Canary release traffic splitter (by Ravi)

## Reviewer: Vikram Patel
---

**Overall:** Good foundation but critical bugs need fixing before merge.

### `trafficSplitter.js`

> **Bug #1:** Traffic split percentage calculation uses Math.floor wrong so 10 percent canary gets 0 percent traffic
> This is the higher priority fix. Check the logic carefully and compare against the design doc.

### `canaryAnalyzer.js`

> **Bug #2:** Error rate comparison for auto-rollback compares absolute count instead of percentage
> This is more subtle but will cause issues in production. Make sure to add a test case for this.

---

**Ravi**
> Acknowledged. I have documented the issues for whoever picks this up.
