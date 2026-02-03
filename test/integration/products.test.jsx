/**
 * Integration Tests - Product Management
 * Tests product listing, searching, and CRUD operations
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

// Mock localStorage with user logged in
const localStorageMock = {
  getItem: jest.fn((key) => {
    if (key === "user") return JSON.stringify({ name: "Test User", email: "test@test.com" });
    if (key === "favorites") return "[]";
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn();

// Import after mocks
import Home from "../../app/page";

describe("Product Management Integration Tests", () => {
  const mockProducts = [
    { id: 1, name: "Product One", price: 29.99, description: "First product" },
    { id: 2, name: "Product Two", price: 49.99, description: "Second product" },
    { id: 3, name: "Another Item", price: 19.99, description: "Third product" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });
  });

  // TC1: Product Listing
  describe("TC1: Product Listing", () => {
    test("TC1.1: should fetch and display products on load", async () => {
      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/products");
      });

      expect(await screen.findByText("Product One")).toBeInTheDocument();
      expect(await screen.findByText("Product Two")).toBeInTheDocument();
    });
  });

  // TC2: Product Search
  describe("TC2: Product Search", () => {
    test("TC2.1: should search products with query", async () => {
      render(<Home />);

      await screen.findByText("Product One");

      const searchInput = screen.getByLabelText(/search products/i);
      fireEvent.change(searchInput, { target: { value: "Product" } });
      
      const searchButton = screen.getByRole("button", { name: /^search$/i });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/products?q=Product");
      });
    });

    test("TC2.2: should search on Enter key press", async () => {
      render(<Home />);

      await screen.findByText("Product One");

      const searchInput = screen.getByLabelText(/search products/i);
      fireEvent.change(searchInput, { target: { value: "Test" } });
      fireEvent.keyDown(searchInput, { key: "Enter" });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/products?q=Test");
      });
    });

    test("TC2.3: should clear search and show all products", async () => {
      render(<Home />);

      await screen.findByText("Product One");

      const searchInput = screen.getByLabelText(/search products/i);
      fireEvent.change(searchInput, { target: { value: "Test" } });
      
      const clearButton = screen.getByRole("button", { name: /clear/i });
      fireEvent.click(clearButton);

      expect(searchInput.value).toBe("");
      await waitFor(() => {
        expect(global.fetch).toHaveBeenLastCalledWith("/api/products");
      });
    });
  });

  // TC3: Empty State
  describe("TC3: Empty State", () => {
    test("TC3.1: should display empty state when no products", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      render(<Home />);

      expect(await screen.findByText(/no products found/i)).toBeInTheDocument();
    });
  });
});
