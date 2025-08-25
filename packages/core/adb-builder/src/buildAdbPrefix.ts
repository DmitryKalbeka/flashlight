export interface AdbPrefixOptions {
  adbServerHost?: string;
  adbServerPort?: string;
  deviceName?: string;
}

export function buildAdbPrefix(options: AdbPrefixOptions): string[] {
  const args: string[] = [];
  if (options.adbServerHost) args.push("-H", options.adbServerHost);
  if (options.adbServerPort) args.push("-P", options.adbServerPort);
  if (options.deviceName) args.push("-s", options.deviceName);
  return args;
}
