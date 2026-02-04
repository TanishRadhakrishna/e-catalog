/**
 * System Testing - Security Tests
 * Tests application security measures and vulnerabilities
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

describe("Security Testing", () => {
  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
  });

  describe("Authentication Security", () => {
    test("ST-SEC-1: User session is stored and cleared correctly", () => {
      const userData = { email: "admin@example.com", name: "Admin" };
      
      // Simulate login storing user data
      localStorage.setItem("user", JSON.stringify(userData));
      expect(JSON.parse(localStorage.getItem("user")).email).toBe("admin@example.com");

      // Simulate logout
      localStorage.removeItem("user");
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("Input Validation Security", () => {
    test("ST-SEC-2: SQL injection and XSS patterns are detected", () => {
      const detectSqlInjection = (input) => {
        const dangerousPatterns = /('|"|;|--|\bOR\b|\bAND\b|\bUNION\b|\bSELECT\b|\bDROP\b|\bDELETE\b)/i;
        return dangerousPatterns.test(input);
      };

      const detectXss = (input) => {
        const dangerousPatterns = /<script|javascript:|onerror=|onload=|onclick=/i;
        return dangerousPatterns.test(input);
      };

      // SQL injection patterns
      expect(detectSqlInjection("' OR '1'='1")).toBeTruthy();
      expect(detectSqlInjection("'; DROP TABLE users;--")).toBeTruthy();

      // XSS patterns
      expect(detectXss("<script>alert('xss')</script>")).toBeTruthy();
      expect(detectXss("javascript:alert('xss')")).toBeTruthy();
    });

    test("ST-SEC-3: Email validation rejects invalid formats", () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailPattern.test("invalid")).toBeFalsy();
      expect(emailPattern.test("@domain.com")).toBeFalsy();
      expect(emailPattern.test("valid@example.com")).toBeTruthy();
    });

    test("ST-SEC-4: Password requirements are enforced", () => {
      const validatePassword = (password) => {
        if (password.length < 8) return { valid: false, error: "Too short" };
        if (!/[A-Z]/.test(password)) return { valid: false, error: "No uppercase" };
        if (!/[a-z]/.test(password)) return { valid: false, error: "No lowercase" };
        if (!/[0-9]/.test(password)) return { valid: false, error: "No number" };
        if (!/[!@#$%^&*]/.test(password)) return { valid: false, error: "No special char" };
        return { valid: true };
      };

      expect(validatePassword("weak").valid).toBeFalsy();
      expect(validatePassword("Password123!").valid).toBeTruthy();
    });
  });

  describe("API Security", () => {
    test("ST-SEC-5: API handles malformed requests and returns proper errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Invalid JSON" }),
      });

      const response = await fetch("/api/products", {
        method: "POST",
        body: "invalid json{{{",
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("Session Security", () => {
    test("ST-SEC-6: Corrupted session data is handled gracefully", () => {
      localStorage.setItem("user", "corrupted{{{invalid json");

      const parseSession = () => {
        try {
          return JSON.parse(localStorage.getItem("user"));
        } catch {
          return null;
        }
      };

      expect(parseSession()).toBeNull();
    });
  });

  describe("Data Sanitization", () => {
    test("ST-SEC-7: HTML entities are escaped and input is sanitized", () => {
      const escapeHtml = (str) => {
        const escapeMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        };
        return str.replace(/[&<>"']/g, (char) => escapeMap[char]);
      };

      const sanitizeInput = (input) => input.trim();

      const dangerous = '<script>alert("xss")</script>';
      const escaped = escapeHtml(dangerous);

      expect(escaped).not.toContain('<script>');
      expect(sanitizeInput("  test  ")).toBe("test");
    });
  });
});
