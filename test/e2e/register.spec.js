/**
 * E2E Test: Registration Flow
 * Tests the complete registration experience from the user's perspective
 */
const { test, expect } = require("@playwright/test");

test.describe("Registration Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/register");
    await page.evaluate(() => localStorage.clear());
  });

  test("should display registration page with all elements", async ({ page }) => {
    await page.goto("/register");

    // Check branding
    await expect(page.locator("h1")).toContainText("E-Catalog");
    await expect(page.locator("text=Create your account")).toBeVisible();

    // Check form elements
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('input#confirmPassword')).toBeVisible();
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible();

    // Check link to login
    await expect(page.locator('a:has-text("Sign in")')).toBeVisible();
  });

  test("should register successfully and redirect to home", async ({ page }) => {
    await page.goto("/register");

    // Fill in registration form
    await page.fill('input#name', "Test User");
    await page.fill('input[type="email"]', `testuser${Date.now()}@example.com`);
    await page.fill('input#password', "password123");
    await page.fill('input#confirmPassword', "password123");
    
    // Click register
    await page.click('button:has-text("Create Account")');

    // Wait for redirect to home page
    await page.waitForURL("/", { timeout: 5000 });
    
    // Verify we're on the home page
    await expect(page).toHaveURL("/");
  });

  test("should show error for mismatched passwords", async ({ page }) => {
    await page.goto("/register");

    // Fill in form with mismatched passwords
    await page.fill('input#name', "Test User");
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input#password', "password123");
    await page.fill('input#confirmPassword', "differentpassword");
    
    // Click register
    await page.click('button:has-text("Create Account")');

    // Wait for error message
    await expect(page.locator("text=Passwords do not match")).toBeVisible();
  });

  test("should show error for short password", async ({ page }) => {
    await page.goto("/register");

    // Fill in form with short password
    await page.fill('input#name', "Test User");
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input#password', "12345");
    await page.fill('input#confirmPassword', "12345");
    
    // Click register
    await page.click('button:has-text("Create Account")');

    // Wait for error message
    await expect(page.locator("text=Password must be at least 6 characters")).toBeVisible();
  });

  test("should show error for empty fields", async ({ page }) => {
    await page.goto("/register");

    // Click register without filling fields
    await page.click('button:has-text("Create Account")');

    // Wait for error message
    await expect(page.locator("text=Please fill in all fields")).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/register");

    // Click sign in link
    await page.click('a:has-text("Sign in")');

    // Verify navigation
    await expect(page).toHaveURL("/login");
  });
});
