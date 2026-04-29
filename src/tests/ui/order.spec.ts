import { test, expect } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../../pages';
import { Users, CheckoutData, Products } from '../../data/testData';

test.describe('Product Order Scenarios', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.loginAndExpectSuccess(Users.standard.username, Users.standard.password);
    await inventoryPage.assertOnInventoryPage();
  });

  test('TC_ORDER_01 - Full E2E order flow: add to cart, checkout, confirm', async () => {
    // Step 1: Add product to cart
    await inventoryPage.addProductToCart(Products.backpack);
    expect(await inventoryPage.getCartItemCount()).toBe(1);

    // Step 2: Go to Cart
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.assertProductInCart(Products.backpack);
    expect(await cartPage.getCartItemCount()).toBe(1);

    // Step 3: Proceed to Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnCheckoutStepOne();

    // Step 4: Fill checkout info
    await checkoutPage.fillCheckoutInfo(
      CheckoutData.firstName,
      CheckoutData.lastName,
      CheckoutData.postalCode
    );
    await checkoutPage.continue();
    await checkoutPage.assertOnCheckoutStepTwo();

    // Step 5: Verify order summary and finish
    const total = await checkoutPage.getTotalPrice();
    expect(total).toContain('Total:');
    await checkoutPage.finish();

    // Step 6: Verify confirmation
    await checkoutPage.assertOrderConfirmed();
  });

  test('TC_ORDER_02 - Add product button changes to Remove after adding', async () => {
    await inventoryPage.addProductToCart(Products.bikeLight);
    const button = await inventoryPage.getAddToCartButton(Products.bikeLight);
    await expect(button).toHaveText('Remove');
  });

  test('TC_ORDER_03 - Cart badge updates with item count', async () => {
    expect(await inventoryPage.getCartItemCount()).toBe(0);
    await inventoryPage.addProductToCart(Products.backpack);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
  });

  test('TC_ORDER_04 - Can continue shopping from cart', async () => {
    await inventoryPage.addProductToCart(Products.backpack);
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.continueShopping();
    await inventoryPage.assertOnInventoryPage();
  });

  test('TC_ORDER_05 - Checkout requires first name', async () => {
    await inventoryPage.addProductToCart(Products.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('', CheckoutData.lastName, CheckoutData.postalCode);
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('TC_ORDER_06 - Checkout requires last name', async () => {
    await inventoryPage.addProductToCart(Products.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(CheckoutData.firstName, '', CheckoutData.postalCode);
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });

  test('TC_ORDER_07 - Checkout requires postal code', async () => {
    await inventoryPage.addProductToCart(Products.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(CheckoutData.firstName, CheckoutData.lastName, '');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

  test('TC_ORDER_08 - Logout redirects to login page', async () => {
    await inventoryPage.logout();
    await expect(loginPage.page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
