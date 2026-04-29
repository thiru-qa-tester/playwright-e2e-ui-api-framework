import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Step One
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step Two
  readonly finishButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  // Confirmation
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.finishButton = page.locator('[data-test="finish"]');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');

    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async assertOnCheckoutStepOne(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-one/);
  }

  async assertOnCheckoutStepTwo(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-two/);
  }

  async assertOnConfirmationPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-complete/);
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async assertOrderConfirmed(): Promise<void> {
    await this.assertOnConfirmationPage();
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
  }

  async getTotalPrice(): Promise<string> {
    return (await this.totalLabel.textContent()) || '';
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
