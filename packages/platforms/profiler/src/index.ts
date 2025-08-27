import { AndroidProfiler, FlashlightSelfProfiler } from "@perf-profiler/android";
import { IOSProfiler } from "@perf-profiler/ios";
import { Profiler, AdbPrefixOptions } from "@perf-profiler/types";

export function getProfiler(options?: AdbPrefixOptions): Profiler {
  switch (process.env.PLATFORM) {
    case "ios":
      return new IOSProfiler();
    case "flashlight":
      return new FlashlightSelfProfiler(options);
    default:
      return new AndroidProfiler(options);
  }
}

export const profiler: Profiler = getProfiler();

// TODO move this to a separate package
export { waitFor } from "@perf-profiler/android";
