import { render, screen, fireEvent } from "@testing-library/react";
import TopSellersModal from "../../../components/TopSellersModal";

describe("TopSellersModal Component", () => {
  const mockOnClose = jest.fn();
  const mockData = [
    { name: "Product A", quantity_sold: 10, revenue: 100 },
    { name: "Product B", quantity_sold: 5, revenue: 50 },
    { name: "Product C", quantity_sold: 20, revenue: 200 },
  ];

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  // TC1: Modal Visibility - Verify show/hide behavior
  describe("TC1: Modal Visibility", () => {
    test("TC1.1: should NOT render when isOpen is false", () => {
      const { container } = render(
        <TopSellersModal isOpen={false} onClose={mockOnClose} data={[]} />
      );
      expect(container.firstChild).toBeNull();
    });

    test("TC1.2: should render when isOpen is true", () => {
      const { container } = render(
        <TopSellersModal isOpen={true} onClose={mockOnClose} data={[]} />
      );
      expect(container.firstChild).not.toBeNull();
    });
  });

  // TC2: Content Display - Verify modal content renders correctly
  describe("TC2: Content Display", () => {
    test("TC2.1: should render modal title", () => {
      render(<TopSellersModal isOpen={true} onClose={mockOnClose} data={[]} />);
      expect(
        screen.getByRole("heading", { name: /top selling products/i })
      ).toBeInTheDocument();
    });

    test("TC2.2: should show empty state when no data provided", () => {
      render(<TopSellersModal isOpen={true} onClose={mockOnClose} data={[]} />);
      expect(screen.getByText(/no sales data available yet/i)).toBeInTheDocument();
    });

    test("TC2.3: should display product data correctly", () => {
      render(<TopSellersModal isOpen={true} onClose={mockOnClose} data={mockData} />);
      
      expect(screen.getByText(/Product A/i)).toBeInTheDocument();
      expect(screen.getByText(/Product B/i)).toBeInTheDocument();
      expect(screen.getByText(/Product C/i)).toBeInTheDocument();
    });
  });

  // TC3: User Interactions - Verify close functionality
  describe("TC3: User Interactions", () => {
    test("TC3.1: should call onClose when close button is clicked", () => {
      render(<TopSellersModal isOpen={true} onClose={mockOnClose} data={[]} />);
      
      screen.getByRole("button", { name: /close/i }).click();
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("TC3.2: should call onClose when overlay is clicked", () => {
      render(<TopSellersModal isOpen={true} onClose={mockOnClose} data={[]} />);
      
      const overlay = document.querySelector(".modal-overlay");
      overlay.click();
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
