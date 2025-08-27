export interface AdbPrefixOptions {
  adb_server_host?: string;
  adb_server_port?: number;
  device_name?: string;
}

/**
 * Формирует массив аргументов для adb на основе переданных опций.
 * @param options Опции для подключения к adb серверу и устройству.
 * @returns Массив строк с аргументами для adb.
 */
export declare function buildAdbPrefix(options: AdbPrefixOptions): string[];
