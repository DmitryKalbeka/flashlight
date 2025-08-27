import { Logger } from "@perf-profiler/logger";
import { TestCaseIterationResult } from "@perf-profiler/types";
import * as p from "path";
import { writeReport } from "./writeReport";
import { PerformanceMeasurer } from "./PerformanceMeasurer";

export interface Options {
  recordOptions:
    | { record: false }
    | { record: true; size?: string | undefined; bitRate?: number | undefined; videoPath: string };
  resultsFileOptions: {
    path: string;
    title: string;
  };
  adbOptions?: {
    adbServerHost?: string;
    adbServerPort?: number;
    deviceName?: string;
  };
}

export type PerformanceTesterOptions = Omit<
  Options,
  "resultsFileOptions" | "recordOptions" | "adbOptions"
> & {
  recordOptions:
    | { record: false }
    | { record: true; size?: string | undefined; bitRate?: number | undefined };
  resultsFileOptions?: {
    path?: string;
    title?: string;
  };
  adbOptions?: Options["adbOptions"];
};

export class PerformanceTester {
  public measures: TestCaseIterationResult[] = [];
  options: Options;
  private videoPath: string;
  private performanceMeasurer: PerformanceMeasurer;

  constructor(
    private bundleId: string,
    performanceTesterOptions: PerformanceTesterOptions = { recordOptions: { record: false } }
  ) {
    const title = performanceTesterOptions.resultsFileOptions?.title || "Results";

    const path = performanceTesterOptions.resultsFileOptions?.path;
    const filePath = path ? p.join(process.cwd(), p.dirname(path)) : `${process.cwd()}`;
    const fileName = path
      ? p.basename(path)
      : `${title.toLocaleLowerCase().replace(/ /g, "_")}_${new Date().getTime()}`;
    const resultsFilePath = path || `${filePath}/${fileName}.json`;
    const resultsPath = resultsFilePath ?? "";
    this.videoPath = `${resultsPath.replace(".json", "")}_iteration_${new Date().getTime()}.mp4`;

    this.options = {
      ...performanceTesterOptions,
      recordOptions: performanceTesterOptions.recordOptions.record
        ? {
            ...performanceTesterOptions.recordOptions,
            videoPath: this.videoPath,
          }
        : performanceTesterOptions.recordOptions,
      resultsFileOptions: {
        path: resultsFilePath,
        title,
      },
    };

    this.performanceMeasurer = new PerformanceMeasurer(this.bundleId, {
      adbOptions: this.options.adbOptions ?? {},
      recordOptions: this.options.recordOptions,
    });
  }

  async startMeasurement(): Promise<void> {
    this.measures = [];
    await this.performanceMeasurer.start();
  }

  async stopMeasurement(): Promise<void> {
    const measures = await this.performanceMeasurer.stop();
    this.measures.push(measures);
    this.writeResults();
  }

  writeResults() {
    const { path, title } = this.options.resultsFileOptions;
    writeReport(this.measures, {
      filePath: path,
      title,
      overrideScore: undefined,
    });
  }

  private logFailedMeasurement(error: unknown) {
    Logger.error(`Measurement failed: ${error instanceof Error ? error.message : "unknown error"}`);
  }
}
