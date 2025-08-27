import { AdbPrefixOptions } from "@perf-profiler/types";

export function buildAdbPrefix(options: AdbPrefixOptions | undefined): string {
  if (!options) return "adb";
  return [
    "adb",
    options.adbServerHost ? ["-H", options.adbServerHost] : [],
    options.adbServerPort ? ["-P", String(options.adbServerPort)] : [],
    options.deviceName ? ["-s", options.deviceName] : [],
  ]
    .flat()
    .join(" ");
}

export { AdbPrefixOptions };
