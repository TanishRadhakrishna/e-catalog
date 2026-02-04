/**
 * Integration Tests - Authentication Flow
 * Tests the complete login/logout/register flow across components
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock Next.js navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
  }),
}));

// Real localStorage mock that persists data during tests
let store = {};
const localStorageMock = {
  getItem: jest.fn((key) => store[key] || null),
  setItem: jest.fn((key, value) => { store[key] = value; }),
  removeItem: jest.fn((key) => { delete store[key]; }),
  clear: jest.fn(() => { store = {}; }),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Import components after mocks
import LoginPage from "../../app/login/page";
import RegisterPage from "../../app/register/page";

describe("Authentication Flow Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store = {};
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // TC1: Login Flow
  describe("TC1: Login Flow", () => {
    test("TC1.1: should login with demo credentials and redirect to home", async () => {
      render(<LoginPage />);
      
      fireEvent.change(screen.getByLabelText(/email/i), { 
        target: { value: "admin@example.com" } 
      });
      fireEvent.change(screen.getByLabelText(/password/i), { 
        target: { value: "password" } 
      });
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      // Wait for async login
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "user",
          expect.stringContaining("admin@example.com")
        );
      });
    });

    test("TC1.2: should show error message for invalid credentials", async () => {
      render(<LoginPage />);
      
      fireEvent.change(screen.getByLabelText(/email/i), { 
        target: { value: "wrong@email.com" } 
      });
      fireEvent.change(screen.getByLabelText(/password/i), { 
        target: { value: "wrongpassword" } 
      });
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });
    });
  });

  // TC2: Registration Flow
  describe("TC2: Registration Flow", () => {
    test("TC2.1: should register new user and store in localStorage", async () => {
      render(<RegisterPage />);
      
      fireEvent.change(screen.getByLabelText(/full name/i), { 
        target: { value: "New User" } 
      });
      fireEvent.change(screen.getByLabelText(/email/i), { 
        target: { value: "newuser@test.com" } 
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), { 
        target: { value: "password123" } 
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { 
        target: { value: "password123" } 
      });
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));

      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        // Should store user
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "user",
          expect.stringContaining("newuser@test.com")
        );
        // Should store in registered users
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "registeredUsers",
          expect.stringContaining("newuser@test.com")
        );
      });
    });

    test("TC2.2: should prevent registration with mismatched passwords", () => {
      render(<RegisterPage />);
      
      fireEvent.change(screen.getByLabelText(/full name/i), { 
        target: { value: "Test User" } 
      });
      fireEvent.change(screen.getByLabelText(/email/i), { 
        target: { value: "test@test.com" } 
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), { 
        target: { value: "password123" } 
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { 
        target: { value: "different" } 
      });
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));

      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    test("TC2.3: should enforce minimum password length", () => {
      render(<RegisterPage />);
      
      fireEvent.change(screen.getByLabelText(/full name/i), { 
        target: { value: "Test User" } 
      });
      fireEvent.change(screen.getByLabelText(/email/i), { 
        target: { value: "test@test.com" } 
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), { 
        target: { value: "12345" } 
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { 
        target: { value: "12345" } 
      });
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));

      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  // TC3: Form Validation
  describe("TC3: Form Validation", () => {
    test("TC3.1: login should require all fields", () => {
      render(<LoginPage />);
      
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });

    test("TC3.2: register should require all fields", () => {
      render(<RegisterPage />);
      
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));

      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
  });
});
