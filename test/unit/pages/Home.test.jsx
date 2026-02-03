import { render, screen } from "@testing-library/react";
import Home from "../../../app/page";

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

// Mock fetch
global.fetch = jest.fn();

describe("Home Page - Product Catalog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  // TC1: Authentication Guard - Verify unauthenticated redirect
  describe("TC1: Authentication Guard", () => {
    test("TC1.1: should redirect to login when user is NOT authenticated", () => {
      localStorageMock.getItem.mockReturnValue(null);
      render(<Home />);
      
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });

    test("TC1.2: should NOT redirect when user IS authenticated", () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "user") return JSON.stringify({ name: "Test", email: "test@test.com" });
        if (key === "favorites") return "[]";
        return null;
      });
      
      render(<Home />);
      
      // Should not call replace with /login
      expect(mockReplace).not.toHaveBeenCalledWith("/login");
    });
  });

  // TC2: UI Rendering (when authenticated)
  describe("TC2: Page UI Elements", () => {
    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "user") return JSON.stringify({ name: "Test", email: "test@test.com" });
        if (key === "favorites") return "[]";
        return null;
      });
    });

    test("TC2.1: should render search input when authenticated", async () => {
      render(<Home />);
      
      expect(await screen.findByLabelText(/search products/i)).toBeInTheDocument();
    });

    test("TC2.2: should render Search button", async () => {
      render(<Home />);
      
      expect(await screen.findByRole("button", { name: /search/i })).toBeInTheDocument();
    });
  });

  // TC3: Empty State
  describe("TC3: Empty State Display", () => {
    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "user") return JSON.stringify({ name: "Test", email: "test@test.com" });
        if (key === "favorites") return "[]";
        return null;
      });
    });

    test("TC3.1: should show 'no products found' when product list is empty", async () => {
      render(<Home />);
      
      expect(await screen.findByText(/no products found/i)).toBeInTheDocument();
    });
  });
});
