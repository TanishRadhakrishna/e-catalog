import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../../../app/login/page";

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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Login Page - User Authentication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // TC1: UI Rendering - Verify login form elements display correctly
  describe("TC1: Login Form UI Elements", () => {
    test("TC1.1: should render app branding with E-Catalog heading", () => {
      render(<LoginPage />);
      expect(screen.getByRole("heading", { name: /e-catalog/i })).toBeInTheDocument();
    });

    test("TC1.2: should render email and password input fields", () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test("TC1.3: should render Sign In button and registration link", () => {
      render(<LoginPage />);
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/register");
    });
  });

  // TC2: Input Validation - Test form input handling
  describe("TC2: Form Input Validation", () => {
    test("TC2.1: should update form fields when user types", () => {
      render(<LoginPage />);
      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      fireEvent.change(emailInput, { target: { value: "user@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "secret123" } });
      
      expect(emailInput.value).toBe("user@test.com");
      expect(passwordInput.value).toBe("secret123");
    });

    test("TC2.2: should have correct input types for security", () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/password/i)).toHaveAttribute("type", "password");
      expect(screen.getByPlaceholderText(/enter your email/i)).toHaveAttribute("type", "email");
    });
  });

  // TC3: Login Functionality - Verify login success/failure scenarios
  describe("TC3: Login Form Submission", () => {
    test("TC3.1: should show error when fields are empty", async () => {
      render(<LoginPage />);
      
      const submitBtn = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });

    test("TC3.2: should disable submit button while loading", () => {
      render(<LoginPage />);
      
      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitBtn = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "admin@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(submitBtn);

      // Button should be disabled during loading
      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
    });
  });

  // TC4: Navigation Links - Verify page navigation
  describe("TC4: Navigation Links", () => {
    test("TC4.1: should have correct href for forgot password link", () => {
      render(<LoginPage />);
      const forgotLink = screen.getByRole("link", { name: /forgot password/i });
      expect(forgotLink).toHaveAttribute("href", "/forgot-password");
    });
  });
});
