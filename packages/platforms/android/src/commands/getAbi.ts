import { executeCommand } from "./shell";

export const getAbi = (adbPrefix: string = "adb") =>
  executeCommand(`${adbPrefix} shell getprop ro.product.cpu.abi`).split(/\r\n|\n|\r/)[0];
