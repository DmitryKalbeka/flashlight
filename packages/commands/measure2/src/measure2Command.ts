#!/usr/bin/env node

import { Option, Command } from "commander";
import { applyLogLevelOption, logLevelOption } from "./commands/logLevelOption";
import { PerformanceTester } from "./PerformanceTester";
import { Logger } from "@perf-profiler/logger";

export function registerMeasure2Command(program: Command) {
  program
    .command("measure2")
    .summary("Run a measuring session")
    .description(
      `Run a measuring session.

Main usage:
flashlight measure2 --adbServerHost <adbServerHost> --adbServerPort <adbServerPort> --deviceName <deviceName> --bundleId com.example.app
`
    )
    .requiredOption("--bundleId <bundleId>", "Bundle id of your app")
    .option("--adbServerHost <adbServerHost>", "ADB server host")
    .addOption(
      new Option("--adbServerPort <adbServerPort>", "ADB server port").argParser((arg) =>
        parseInt(arg, 10)
      )
    )
    .option("--deviceName <deviceName>", "ADB device name")
    .option(
      "--resultsTitle <resultsTitle>",
      "Result title that is displayed at the top of the report"
    )
    .option(
      "--record",
      "Allows you to record a video of the test. This is useful for debugging purposes."
    )
    .option(
      "--recordBitRate <recordBitRate>",
      "Set the video bit rate, in bits per second.  Value may be specified as bits or megabits, e.g. '4000000' is equivalent to '4M'."
    )
    .option(
      "--recordSize <recordSize>",
      'Set the video size, e.g. "1280x720".  Default is the device\'s main display resolution (if supported), 1280x720 if not.  For best results, use a size supported by the AVC encoder.'
    )
    .addOption(logLevelOption)
    .action(
      async (options: {
        bundleId: string;
        resultsFilePath?: string;
        resultsTitle?: string;
        logLevel?: string;
        record?: boolean;
        recordSize?: string;
        recordBitRate?: number;
        adbServerHost?: string;
        adbServerPort?: number;
        deviceName?: string;
      }) => {
        await runMeasurement(options);
      }
    );
}

async function runMeasurement({
  bundleId,
  resultsFilePath,
  resultsTitle,
  logLevel,
  record,
  recordSize,
  recordBitRate,
  adbServerHost,
  adbServerPort,
  deviceName,
}: {
  bundleId: string;
  resultsFilePath?: string;
  resultsTitle?: string;
  logLevel?: string;
  record?: boolean;
  recordSize?: string;
  recordBitRate?: number;
  adbServerHost?: string;
  adbServerPort?: number;
  deviceName?: string;
}): Promise<void> {
  applyLogLevelOption(logLevel);

  const performanceTester = new PerformanceTester(bundleId, {
    recordOptions: {
      record: !!record,
      size: recordSize,
      bitRate: recordBitRate,
    },
    adbOptions: {
      adbServerHost: adbServerHost,
      adbServerPort: adbServerPort,
      deviceName: deviceName,
    },
    resultsFileOptions: {
      path: resultsFilePath,
      title: resultsTitle,
    },
  });

  try {
    await performanceTester.startMeasurement();

    // Ожидание команды "exit" в stdin
    Logger.info('Type "exit" and press Enter to finish and save results.');
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", async (data) => {
      if (data.toString().trim() === "exit") {
        Logger.info("Exit command received. Saving results...");
        await performanceTester.stopMeasurement();
        process.exit(0);
      }
    });
  } catch (error) {
    console.error(error); // чтобы увидеть весь stack
    performanceTester.writeResults();

    if (error instanceof Error) {
      Logger.error(`Flashlight test FAILED ❌: ${error.message}
      You can still open a degraded view of the report`);
    }

    process.exit(1);
  }
}
