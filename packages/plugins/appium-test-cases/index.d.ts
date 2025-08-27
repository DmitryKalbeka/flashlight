import { TestCase } from "@perf-profiler/e2e";
import { AppiumDriver } from "@bam.tech/appium-helper";
export declare const createStartAppTestCase: ({
  driver,
  waitForAppStart,
}: {
  driver: AppiumDriver;
  waitForAppStart: () => Promise<unknown>;
}) => TestCase;
//# sourceMappingURL=index.d.ts.map
