import { buildAdbPrefix, AdbPrefixOptions } from "./buildAdbPrefix";

describe("buildAdbPrefix", () => {
  it("returns empty array if no options are provided", () => {
    expect(buildAdbPrefix({})).toEqual([]);
  });

  it("adds only -H if adb_server_host is provided", () => {
    expect(buildAdbPrefix({ adbServerHost: "127.0.0.1" })).toEqual(["-H", "127.0.0.1"]);
  });

  it("adds only -P if adb_server_port is provided", () => {
    expect(buildAdbPrefix({ adbServerPort: "5037" })).toEqual(["-P", "5037"]);
  });

  it("adds only -s if device_name is provided", () => {
    expect(buildAdbPrefix({ deviceName: "emulator-5554" })).toEqual(["-s", "emulator-5554"]);
  });

  it("adds all options if all are provided", () => {
    const options: AdbPrefixOptions = {
      adbServerHost: "192.168.1.2",
      adbServerPort: "5038",
      deviceName: "device123",
    };
    expect(buildAdbPrefix(options)).toEqual(["-H", "192.168.1.2", "-P", "5038", "-s", "device123"]);
  });

  it("adds options in correct order", () => {
    expect(
      buildAdbPrefix({
        adbServerPort: "5037",
        deviceName: "dev",
        adbServerHost: "host",
      })
    ).toEqual(["-H", "host", "-P", "5037", "-s", "dev"]);
  });
});
