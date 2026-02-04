import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../../../app/register/page";

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

describe("Register Page - User Registration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // TC1: UI Rendering - Verify registration form elements
  describe("TC1: Registration Form UI Elements", () => {
    test("TC1.1: should render E-Catalog branding and subtitle", () => {
      render(<RegisterPage />);
      expect(screen.getByRole("heading", { name: /e-catalog/i })).toBeInTheDocument();
      expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    });

    test("TC1.2: should render all required input fields and submit button", () => {
      render(<RegisterPage />);
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    });

    test("TC1.3: should render link to login page", () => {
      render(<RegisterPage />);
      expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
    });
  });

  // TC2: Form Validation - Test validation scenarios
  describe("TC2: Form Validation", () => {
    test("TC2.1: should show error when passwords do not match", () => {
      render(<RegisterPage />);
      
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Test User" } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "differentpassword" } });
      
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));

      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    test("TC2.2: should show error when password is too short", () => {
      render(<RegisterPage />);
      
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Test User" } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "12345" } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "12345" } });
      
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));

      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });

    test("TC2.3: should show error when fields are empty", () => {
      render(<RegisterPage />);
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });

    test("TC2.4: should have correct input types for security", () => {
      render(<RegisterPage />);
      expect(screen.getByLabelText(/^password$/i)).toHaveAttribute("type", "password");
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute("type", "password");
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
    });
  });

  // TC3: Registration Flow - Test successful registration
  describe("TC3: Registration Submission", () => {
    test("TC3.1: should disable button during registration", () => {
      render(<RegisterPage />);
      
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Jane Doe" } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "jane@example.com" } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });
      
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));

      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
    });
  });

  // TC4: Input Handling - Test form input updates (consolidated)
  describe("TC4: Form Input Handling", () => {
    test("TC4.1: should update all form fields when user types", () => {
      render(<RegisterPage />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      
      fireEvent.change(nameInput, { target: { value: "Test Name" } });
      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "testpass" } });
      fireEvent.change(confirmInput, { target: { value: "testpass" } });
      
      expect(nameInput.value).toBe("Test Name");
      expect(emailInput.value).toBe("test@test.com");
      expect(passwordInput.value).toBe("testpass");
      expect(confirmInput.value).toBe("testpass");
    });
  });
});
