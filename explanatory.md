# Beginner Explanatory Guide: PLATFORM-2964: Refactor canary release traffic splitter

> **Task Type**: Product Task  
> **Domain/Focus**: Backend JavaScript Development, Deployment Strategies

---

## 1. The Goal (In-Depth Beginner Explanation)

### The Core Problem
The task at hand involves refactoring the canary release traffic splitter, which is a critical component in managing how traffic is routed between stable and canary versions of an application. Currently, the implementation has several quality issues that were identified during a previous review. These issues include the use of "magic numbers," which are hard-coded values that lack context, making the code difficult to understand and maintain. Additionally, the error rate calculation is overly complex, and there is redundant metric tracking that clutters the codebase.

Fixing these issues is essential for several reasons. First, it enhances code readability and maintainability, allowing future developers to understand the logic without extensive documentation. Second, simplifying the error rate calculation ensures that the system can quickly and accurately assess the health of the canary deployment, which is crucial for making timely decisions about promoting or rolling back changes. Lastly, removing redundant metrics helps streamline the monitoring process, making it easier to focus on the most relevant data.

### Jargon Buster (Key Terms Explained)
* **Canary Release**: A deployment strategy that gradually rolls out a new version of software to a small subset of users before a full rollout. This allows developers to monitor the new version's performance and catch any issues early. For example, if a new feature is released to 5% of users, it’s called a canary release.
  
* **Magic Numbers**: These are hard-coded values in the code that appear without explanation. For instance, if a function uses the number `0.05` to represent a 5% error rate without context, it’s a magic number. Instead, it should be defined as a constant with a descriptive name, like `const ERROR_RATE_LIMIT = 0.05;`.

* **Error Rate Calculation**: This refers to the process of determining the percentage of failed requests compared to the total number of requests. For example, if there were 100 requests and 5 failed, the error rate would be 5%. This metric is crucial for assessing the health of a deployment.

* **Metric Tracking**: This involves collecting data about the performance and behavior of an application. In the context of canary releases, it includes tracking the number of requests, errors, and latencies to evaluate the stability of the new version.

### Expected Outcome
After implementing the refactor, the canary release traffic splitter should exhibit improved code quality without altering its external behavior. 

**Before**: The code contains magic numbers, complex error rate calculations, and redundant metrics, making it hard to read and maintain.

**After**: The code will have named constants instead of magic numbers, a simplified error rate calculation, and unnecessary metrics will be removed. This will lead to clearer, more maintainable code while ensuring that all unit tests pass successfully.

---

## 2. Related Coding Concepts & Syntax

### Concept 1: Constants and Variables
#### 📘 Theoretical Overview (50%)
* **Why it exists**: Constants are used to store values that do not change throughout the execution of a program. Using constants instead of magic numbers improves code readability and maintainability. If a value needs to be updated, it can be changed in one place rather than throughout the codebase, reducing the risk of errors.

* **Key Mechanisms**: In JavaScript, constants are declared using the `const` keyword. Once a constant is assigned a value, it cannot be reassigned. This is particularly useful for values that are used multiple times, such as configuration settings or thresholds.

#### 💻 Syntax & Practical Examples (50%)
* **Language Syntax**:
  ```javascript
  const ERROR_RATE_LIMIT = 0.05; // This constant represents the maximum allowable error rate
  const MAX_LATENCY_SAMPLES = 1000; // This constant limits the number of latency samples stored
  ```

* **Real-World Application**:
  ```javascript
  class TrafficSplitter {
    constructor(canaryPercent = 5) {
      this.canaryPercent = canaryPercent;
      this.MAX_LATENCY_SAMPLES = 1000; // Using a constant for maximum latency samples
      this.latencies = { stable: [], canary: [] };
    }

    recordResult(target, success, latencyMs) {
      if (this.latencies[target].length >= this.MAX_LATENCY_SAMPLES) {
        this.latencies[target].shift(); // Remove the oldest sample
      }
      this.latencies[target].push(latencyMs);
    }
  }
  ```

---

## 3. Step-by-Step Logic & Walkthrough

1. **Step 1: Locate and Analyze the Target File**
   * Navigate to the `p-w07-task-06` folder and open `trafficSplitter.js` and `canaryAnalyzer.js`. These files contain the logic that needs to be refactored.
   * Focus on the sections where magic numbers are used, particularly in the `TrafficSplitter` class and the error rate calculations in the `CanaryAnalyzer` class.

2. **Step 2: Input Verification & Validation**
   * Check for edge cases in the code, such as what happens if the number of requests is zero or if the canary percentage is set to an invalid value (e.g., greater than 100).

3. **Step 3: Core Implementation / Modification**
   * Replace magic numbers with named constants. For example, change `0.05` to `const ERROR_RATE_LIMIT = 0.05;`.
   * Simplify the error rate calculation in the `analyze` method of `CanaryAnalyzer` to make it more straightforward.
   * Remove any redundant metric tracking in the `TrafficSplitter` class.

4. **Step 4: Output Verification & Testing**
   * After making the changes, run the existing unit tests in `trafficSplitter.test.js` to ensure that all tests pass and that the refactored code behaves as expected.

---

## 4. Detailed Walkthrough of Test Cases

### Test Case 1: Standard / Success Case
* **Description**: This test checks if the `TrafficSplitter` can correctly process a valid request.
* **Inputs**:
  ```json
  {
    "requestId": "12345",
    "success": true,
    "latencyMs": 200
  }
  ```
* **Step-by-Step Execution Trace**:
  1. The `route` method is called with the request ID `12345`.
  2. The method calculates the target using the hash of the request ID and the `canaryPercent`.
  3. The request count for the determined target (either `stable` or `canary`) is incremented.
  4. The `recordResult` method is called, which updates the error count and latency for the target.
  5. The final result is returned, indicating the target to which the request was routed.

* **Expected Output**: The output should indicate whether the request was routed to `stable` or `canary`, along with updated metrics.

### Test Case 2: Edge Case / Validation Fail
* **Description**: This test checks how the system handles a scenario where the canary percentage is set to an invalid value (greater than 100).
* **Inputs**:
  ```json
  {
    "newPercent": 150
  }
  ```
* **Step-by-Step Execution Trace**:
  1. The `adjustCanaryPercent` method is called with `newPercent` set to `150`.
  2. The method checks if the new percentage is greater than `100` or not a number.
  3. Since the condition is met, an error is thrown or a validation message is returned.
  4. The execution is halted, and the invalid input is not accepted.

* **Expected Output**: The output should be an error message indicating that the canary percentage must be between `0` and `100`.