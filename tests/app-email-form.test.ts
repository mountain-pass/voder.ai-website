import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Tests specifically for email form functionality in src/app.ts

beforeEach(() => {
  // Ensure a clean DOM before each test
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('email form functionality', () => {
  beforeEach(() => {
    // Set up complete form HTML
    document.body.innerHTML = `
      <div id="app">
        <form id="interest-form" name="interest-form" method="POST" data-netlify="true">
          <input type="email" id="email" name="email" />
          <button type="submit">Subscribe</button>
          <div id="form-status"></div>
        </form>
      </div>
    `;
  });

  it('prevents default form submission and validates empty email', async () => {
    const { init } = await import('../src/app.js');

    init();

    const form = document.getElementById('interest-form') as HTMLFormElement;

    const emailInput = document.getElementById('email') as HTMLInputElement;

    const formStatus = document.getElementById('form-status') as HTMLDivElement;

    emailInput.value = '';

    const submitEvent = new Event('submit', { cancelable: true });

    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

    form.dispatchEvent(submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(formStatus.textContent).toBe('Please enter your email address.');
    expect(formStatus.className).toBe('form-status error');
  });

  it('validates invalid email format', async () => {
    const { init } = await import('../src/app.js');

    init();

    const form = document.getElementById('interest-form') as HTMLFormElement;

    const emailInput = document.getElementById('email') as HTMLInputElement;

    const formStatus = document.getElementById('form-status') as HTMLDivElement;

    emailInput.value = 'invalid-email';

    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(formStatus.textContent).toBe('Please enter a valid email address.');
    expect(formStatus.className).toBe('form-status error');
  });

  it('shows loading state during form submission', async () => {
    // Mock fetch to delay response
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(new Response('OK', { status: 200 })), 100);
        }),
    );

    const { init } = await import('../src/app.js');

    init();

    const form = document.getElementById('interest-form') as HTMLFormElement;

    const emailInput = document.getElementById('email') as HTMLInputElement;

    const formStatus = document.getElementById('form-status') as HTMLDivElement;

    emailInput.value = 'test@example.com';

    form.dispatchEvent(new Event('submit', { cancelable: true }));

    // Check loading state immediately
    expect(formStatus.textContent).toBe('Subscribing...');
    expect(formStatus.className).toBe('form-status loading');

    // Wait for fetch to complete
    await new Promise((resolve) => setTimeout(resolve, 150));
  });

  it('handles successful form submission', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));

    // Mock Clarity
    (global as any).window = {
      clarity: vi.fn(),
    };

    const { init } = await import('../src/app.js');

    init();

    const form = document.getElementById('interest-form') as HTMLFormElement;

    const emailInput = document.getElementById('email') as HTMLInputElement;

    const formStatus = document.getElementById('form-status') as HTMLDivElement;

    emailInput.value = 'test@example.com';

    form.dispatchEvent(new Event('submit', { cancelable: true }));

    // Wait for async form submission
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(formStatus.textContent).toBe("Thank you! We'll notify you when Voder launches.");
    expect(formStatus.className).toBe('form-status success');
    expect(emailInput.value).toBe(''); // Form should be reset

    expect(global.fetch).toHaveBeenCalledWith('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: expect.any(String),
    });

    expect((global as any).window.clarity).toHaveBeenCalledWith(
      'set',
      'email_signup',
      'test@example.com',
    );
    expect((global as any).window.clarity).toHaveBeenCalledWith('event', 'waitlist_signup');
  });

  it('handles network errors during form submission', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { init } = await import('../src/app.js');

    init();

    const form = document.getElementById('interest-form') as HTMLFormElement;

    const emailInput = document.getElementById('email') as HTMLInputElement;

    const formStatus = document.getElementById('form-status') as HTMLDivElement;

    emailInput.value = 'test@example.com';

    form.dispatchEvent(new Event('submit', { cancelable: true }));

    // Wait for async form submission to fail
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(formStatus.textContent).toBe('Something went wrong. Please try again.');
    expect(formStatus.className).toBe('form-status error');
    expect(consoleSpy).toHaveBeenCalledWith('Form submission error:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('handles HTTP error responses', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response('Error', { status: 500 }));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { init } = await import('../src/app.js');

    init();

    const form = document.getElementById('interest-form') as HTMLFormElement;

    const emailInput = document.getElementById('email') as HTMLInputElement;

    const formStatus = document.getElementById('form-status') as HTMLDivElement;

    emailInput.value = 'test@example.com';

    form.dispatchEvent(new Event('submit', { cancelable: true }));

    // Wait for async form submission to fail
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(formStatus.textContent).toBe('Something went wrong. Please try again.');
    expect(formStatus.className).toBe('form-status error');
    expect(consoleSpy).toHaveBeenCalledWith('Form submission error:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('handles form submission without Clarity analytics', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));

    // Ensure no Clarity is available
    delete (global as any).window;

    const { init } = await import('../src/app.js');

    init();

    const form = document.getElementById('interest-form') as HTMLFormElement;

    const emailInput = document.getElementById('email') as HTMLInputElement;

    const formStatus = document.getElementById('form-status') as HTMLDivElement;

    emailInput.value = 'test@example.com';

    form.dispatchEvent(new Event('submit', { cancelable: true }));

    // Wait for async form submission
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(formStatus.textContent).toBe("Thank you! We'll notify you when Voder launches.");
    expect(formStatus.className).toBe('form-status success');

    expect(global.fetch).toHaveBeenCalled();
  });

  it('does nothing when form elements are missing', async () => {
    // Override the DOM to have no form elements
    document.body.innerHTML = '<div id="app">No form here</div>';

    const { init } = await import('../src/app.js');

    expect(() => init()).not.toThrow();

    // No form elements exist, so no event listeners should be added
    // This test primarily ensures no errors occur when form elements are missing
  });
});
