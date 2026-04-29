import { test, expect } from '@playwright/test';
import { LoginPage, InventoryPage } from '../../pages';
import { Users, ErrorMessages } from '../../data/testData';

test.describe('Login Scenarios', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  // ── Happy Path ─────────────────────────────────────────────────────────────

  test('TC_LOGIN_01 - Valid credentials login successfully', async () => {
    await loginPage.loginAndExpectSuccess(Users.standard.username, Users.standard.password);
    await inventoryPage.assertOnInventoryPage();
  });

  test('TC_LOGIN_02 - Performance glitch user can login', async () => {
    await loginPage.loginAndExpectSuccess(Users.performance.username, Users.performance.password);
    await inventoryPage.assertOnInventoryPage();
  });

  // ── Negative Scenarios ────────────────────────────────────────────────────

  test('TC_LOGIN_03 - Locked out user cannot login', async () => {
    await loginPage.loginAndExpectError(Users.locked.username, Users.locked.password);
    await loginPage.assertErrorMessage(ErrorMessages.lockedOut);
  });

  test('TC_LOGIN_04 - Invalid username and password shows error', async () => {
    await loginPage.loginAndExpectError(Users.invalid.username, Users.invalid.password);
    await loginPage.assertErrorMessage(ErrorMessages.invalidCredentials);
  });

  test('TC_LOGIN_05 - Empty username shows required error', async () => {
    await loginPage.loginAndExpectError(Users.emptyUsername.username, Users.emptyUsername.password);
    await loginPage.assertErrorMessage(ErrorMessages.usernameRequired);
  });

  test('TC_LOGIN_06 - Empty password shows required error', async () => {
    await loginPage.loginAndExpectError(Users.emptyPassword.username, Users.emptyPassword.password);
    await loginPage.assertErrorMessage(ErrorMessages.passwordRequired);
  });

  test('TC_LOGIN_07 - Both fields empty shows username required error', async () => {
    await loginPage.loginAndExpectError(Users.emptyBoth.username, Users.emptyBoth.password);
    await loginPage.assertErrorMessage(ErrorMessages.usernameRequired);
  });

  test('TC_LOGIN_08 - Error icon appears on both fields for invalid login', async () => {
    await loginPage.loginAndExpectError(Users.invalid.username, Users.invalid.password);
    await loginPage.assertErrorIconOnFields();
  });

  test('TC_LOGIN_09 - Error message can be dismissed', async () => {
    await loginPage.loginAndExpectError(Users.invalid.username, Users.invalid.password);
    await loginPage.closeError();
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('TC_LOGIN_10 - Correct password with wrong username fails', async () => {
    await loginPage.loginAndExpectError('wrong_user', Users.standard.password);
    await loginPage.assertErrorMessage(ErrorMessages.invalidCredentials);
  });

  // ── Security / Edge Cases ─────────────────────────────────────────────────

  test('TC_LOGIN_11 - SQL injection attempt does not login', async () => {
    await loginPage.loginAndExpectError("' OR '1'='1", "' OR '1'='1");
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC_LOGIN_12 - XSS injection in username does not execute', async () => {
    await loginPage.loginAndExpectError('<script>alert(1)</script>', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
