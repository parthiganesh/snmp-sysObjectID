import {getOrg, getDeviceInfo} from "../src/index";

describe("getOrg", () => {
  test("should return the correct vendor name for a pen", () => {
    expect(getOrg(9)).toBe("ciscoSystems");
  });

  test("should return the correct vendor name for a pen given as a string", () => {
    expect(getOrg("9")).toBe("ciscoSystems");
  });

  test("should return the correct vendor name for a pen given as a number", () => {
    expect(getOrg(60432)).toBe("Paul Morrison");
  });

  test("should return undefined for an unassigned pen", () => {
    expect(getOrg(-1)).toBe(undefined);
  });
});

describe("getDeviceInfo", () => {
  test("should return device info for valid OID", () => {
    const oid = '1.3.6.1.4.1.9.1.516';
    const result = getDeviceInfo(oid);
    expect(result).toEqual({ vendor: 'ciscoSystems', category: 'Switch', model: 'Cisco Catalyst 3750 Series' });
  });

  test('should return default values for invalid OID', () => {
    const oid = 'invalid-oid';
    const default_value = 'unknown';
    const result = getDeviceInfo(oid, default_value);
    expect(result).toEqual({ vendor: 'unknown', category: 'unknown', model: 'unknown' });
  });
});
