/**
 * E2E Test: Login Flow
 * Tests the complete login experience from the user's perspective
 */
const { test, expect } = require("@playwright/test");

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());
  });

  test("should display login page with all elements", async ({ page }) => {
    await page.goto("/login");

    // Check branding
    await expect(page.locator("h1")).toContainText("E-Catalog");
    await expect(page.locator("text=Sign in to your account")).toBeVisible();

    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();

    // Check links
    await expect(page.locator('a:has-text("Forgot password")')).toBeVisible();
    await expect(page.locator('a:has-text("Sign up")')).toBeVisible();
  });

  test("should login successfully with demo credentials", async ({ page }) => {
    await page.goto("/login");

    // Fill in credentials
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "password");
    
    // Click login
    await page.click('button:has-text("Sign In")');

    // Wait for redirect to home page
    await page.waitForURL("/", { timeout: 5000 });
    
    // Verify we're on the home page
    await expect(page).toHaveURL("/");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    // Fill in invalid credentials
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    
    // Click login
    await page.click('button:has-text("Sign In")');

    // Wait for error message
    await expect(page.locator("text=Invalid email or password")).toBeVisible({
      timeout: 5000,
    });
  });

  test("should show error for empty fields", async ({ page }) => {
    await page.goto("/login");

    // Click login without filling fields
    await page.click('button:has-text("Sign In")');

    // Wait for error message
    await expect(page.locator("text=Please fill in all fields")).toBeVisible();
  });

  test("should navigate to registration page", async ({ page }) => {
    await page.goto("/login");

    // Click sign up link
    await page.click('a:has-text("Sign up")');

    // Verify navigation
    await expect(page).toHaveURL("/register");
  });
});
