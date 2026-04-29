import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async assertOnCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*cart/);
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async assertProductInCart(productName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: productName });
    await expect(item).toBeVisible();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async getItemPrice(productName: string): Promise<string> {
    const item = this.cartItems.filter({ hasText: productName });
    return (await item.locator('.inventory_item_price').textContent()) || '';
  }
}
