const TrafficSplitter = require("../src/trafficSplitter.js");
const CanaryAnalyzer = require("../src/canaryAnalyzer.js");

describe("Canary release traffic splitter", () => {
    test("should process valid input", () => {
        const obj = new TrafficSplitter();
        expect(obj.process({ key: "val" })).not.toBeNull();
    });
    test("should handle null", () => {
        const obj = new TrafficSplitter();
        expect(obj.process(null)).toBeNull();
    });
    test("should track stats", () => {
        const obj = new TrafficSplitter();
        obj.process({ x: 1 });
        expect(obj.getStats().processed).toBe(1);
    });
    test("support should work", () => {
        const obj = new CanaryAnalyzer();
        expect(obj.process({ data: "test" })).not.toBeNull();
    });
});
