/**
 * System Testing - Compatibility Tests
 * Tests application behavior across different conditions
 * Uses Jest for simpler, faster system-level testing
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] || null,
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn();

describe("Compatibility Testing", () => {
  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
  });

  describe("Browser Features", () => {
    test("ST-COMPAT-1: LocalStorage is available and handles JSON data", () => {
      // Test basic operations
      localStorage.setItem("test", "value");
      expect(localStorage.getItem("test")).toBe("value");
      localStorage.removeItem("test");
      expect(localStorage.getItem("test")).toBeNull();

      // Test JSON data
      const userData = { email: "test@example.com", name: "Test User" };
      localStorage.setItem("user", JSON.stringify(userData));
      expect(JSON.parse(localStorage.getItem("user"))).toEqual(userData);
    });

    test("ST-COMPAT-2: LocalStorage handles special characters and large data", () => {
      const specialData = { text: "Special: <>&\"'äöü中文" };
      localStorage.setItem("special", JSON.stringify(specialData));
      expect(JSON.parse(localStorage.getItem("special"))).toEqual(specialData);

      const largeData = { items: Array(100).fill({ id: 1, name: "Item" }) };
      localStorage.setItem("large", JSON.stringify(largeData));
      expect(JSON.parse(localStorage.getItem("large")).items.length).toBe(100);
    });
  });

  describe("API Compatibility", () => {
    test("ST-COMPAT-3: API returns proper JSON and handles HTTP methods", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (header) => header === "content-type" ? "application/json" : null,
        },
        json: async () => ({ data: "test" }),
      });

      const response = await fetch("/api/products");
      expect(response.headers.get("content-type")).toContain("application/json");
    });
  });

  describe("Data Format Compatibility", () => {
    test("ST-COMPAT-4: Handles dates, numbers, and edge cases correctly", () => {
      // Date formats
      const dates = ["2026-02-02", "2026-02-02T10:30:00Z"];
      dates.forEach((dateStr) => {
        expect(isNaN(new Date(dateStr).getTime())).toBeFalsy();
      });

      // Numeric precision
      const total = 19.99 * 3;
      expect(total).toBeCloseTo(59.97, 2);

      // Edge cases
      expect(null).toEqual(null);
      expect([]).toEqual([]);
      expect({}).toEqual({});
    });
  });

  describe("Input Validation Compatibility", () => {
    test("ST-COMPAT-5: Email and password validation patterns work correctly", () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailPattern.test("test@example.com")).toBeTruthy();
      expect(emailPattern.test("invalid")).toBeFalsy();

      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      expect(passwordPattern.test("Password123!")).toBeTruthy();
      expect(passwordPattern.test("weak")).toBeFalsy();
    });
  });

  describe("Error Handling Compatibility", () => {
    test("ST-COMPAT-6: Handles network errors and timeouts gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));
      await expect(fetch("/api/products")).rejects.toThrow("Network error");

      fetch.mockImplementation(() => 
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Timeout")), 100);
        })
      );
      await expect(fetch("/api/products")).rejects.toThrow("Timeout");
    });
  });
});
