import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../../../components/Navbar";

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

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  // TC1: Rendering - Verify core UI elements render correctly
  describe("TC1: Core UI Rendering", () => {
    test("TC1.1: should render application logo and brand name", () => {
      render(<Navbar />);
      expect(screen.getByText(/E-Catalog/i)).toBeInTheDocument();
    });

    test("TC1.2: should render all main navigation links", () => {
      render(<Navbar />);
      expect(screen.getByText(/home/i)).toBeInTheDocument();
      expect(screen.getByText(/favorites/i)).toBeInTheDocument();
      expect(screen.getByText(/orders/i)).toBeInTheDocument();
    });
  });

  // TC2: Authentication State - Verify login/logout state display
  describe("TC2: Authentication State Display", () => {
    test("TC2.1: should show Login button when user is NOT logged in", () => {
      localStorageMock.getItem.mockReturnValue(null);
      render(<Navbar />);
      expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    test("TC2.2: should show user profile dropdown when user IS logged in", () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({ name: "John Doe", email: "john@example.com" })
      );
      render(<Navbar />);
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /login/i })).not.toBeInTheDocument();
    });

    test("TC2.3: should display user initial in avatar when logged in", () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({ name: "Alice Smith", email: "alice@example.com" })
      );
      render(<Navbar />);
      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });

  // TC3: Logout Functionality - Verify logout flow
  describe("TC3: Logout Functionality", () => {
    test("TC3.1: should show dropdown menu when profile button is clicked", () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({ name: "Test User", email: "test@example.com" })
      );
      render(<Navbar />);
      
      const profileBtn = screen.getByText("Test").closest("button");
      fireEvent.click(profileBtn);
      
      expect(screen.getByText(/my profile/i)).toBeInTheDocument();
      expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    test("TC3.2: should clear user data and redirect on logout", () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({ name: "Test User", email: "test@example.com" })
      );
      render(<Navbar />);
      
      // Open dropdown
      const profileBtn = screen.getByText("Test").closest("button");
      fireEvent.click(profileBtn);
      
      // Click logout
      const logoutBtn = screen.getByText(/logout/i);
      fireEvent.click(logoutBtn);
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
  });
});
