/**
 * E2E Test: Product Catalog
 * Tests the main product catalog functionality
 */
const { test, expect } = require("@playwright/test");

test.describe("Product Catalog", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());
    
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "password");
    await page.click('button:has-text("Sign In")');
    
    await page.waitForURL("/", { timeout: 5000 });
  });

  test("should display home page with navigation", async ({ page }) => {
    // Check navigation
    await expect(page.locator("text=E-Catalog")).toBeVisible();
    await expect(page.locator('button:has-text("Home")')).toBeVisible();
    await expect(page.locator('button:has-text("Favorites")')).toBeVisible();
    await expect(page.locator('button:has-text("Orders")')).toBeVisible();
  });

  test("should display search functionality", async ({ page }) => {
    // Check search elements
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(page.locator('button:has-text("Search")')).toBeVisible();
    await expect(page.locator('button:has-text("Clear")')).toBeVisible();
  });

  test("should search products", async ({ page }) => {
    // Enter search query
    await page.fill('input[placeholder*="Search"]', "test product");
    await page.click('button:has-text("Search")');

    // Wait for search to complete
    await page.waitForTimeout(500);
  });

  test("should clear search", async ({ page }) => {
    // Enter search query
    await page.fill('input[placeholder*="Search"]', "test");
    
    // Click clear
    await page.click('button:has-text("Clear")');

    // Verify input is cleared
    await expect(page.locator('input[placeholder*="Search"]')).toHaveValue("");
  });

  test("should show user profile when logged in", async ({ page }) => {
    // Check user profile is visible
    await expect(page.locator("text=Admin")).toBeVisible();
  });

  test("should logout successfully", async ({ page }) => {
    // Click on profile to open dropdown
    await page.click("text=Admin");
    
    // Wait for dropdown
    await expect(page.locator("text=Logout")).toBeVisible();
    
    // Click logout
    await page.click("text=Logout");

    // Verify redirect to login
    await expect(page).toHaveURL("/login");
  });
});
