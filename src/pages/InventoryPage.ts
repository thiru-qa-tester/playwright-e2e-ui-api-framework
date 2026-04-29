import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async assertOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    await product.locator('button').click();
  }

  async getAddToCartButton(productName: string): Promise<Locator> {
    return this.page
      .locator('.inventory_item')
      .filter({ hasText: productName })
      .locator('button');
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    await product.locator('button').click();
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text || '0', 10);
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async logout(): Promise<void> {
    await this.burgerMenu.click();
    await this.logoutLink.click();
  }

  async getProductPrice(productName: string): Promise<string> {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    return (await product.locator('.inventory_item_price').textContent()) || '';
  }

  async getAllProductNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }
}
