// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Product } from '../../types/product';

const toast = vi.fn();
const postAPI = vi.fn();

vi.mock('../../context/ToastContext', () => ({ useToast: () => ({ toast }) }));
vi.mock('../../lib/api', () => ({ postAPI: (...args: unknown[]) => postAPI(...args) }));
vi.mock('../../components/AddToCartButton', () => ({
  default: ({ variantId }: { variantId: string }) => <button data-variant={variantId}>Į krepšelį</button>,
}));

const { default: ProductPurchase } = await import('../../components/ProductPurchase');
const { default: ProductCard } = await import('../../components/ProductCard');
const { default: ContactForm } = await import('../../components/ContactForm');

const plain = (s: string | null) => (s ?? '').replace(/\s/g, ' ');

const variants = [
  { id: 'v150', product_id: 'p', label: '150 g', weight_g: 150, price: 5.9, sort_order: 1 },
  { id: 'v300', product_id: 'p', label: '300 g', weight_g: 300, price: 10.5, sort_order: 2 },
  { id: 'v600', product_id: 'p', label: '600 g', weight_g: 600, price: 19, sort_order: 3 },
];

const product: Product = {
  id: 'p1',
  name: 'Klasikinis obuolių sūris',
  description: 'Aprašymas',
  image_url: '/images/products/classic.jpg',
  category: 'singles',
  features: [],
  created_at: '2026-01-01',
  variants,
};

beforeEach(() => {
  toast.mockReset();
  postAPI.mockReset();
});
afterEach(cleanup);

const livePrice = () => plain(document.querySelector('[aria-live="polite"]')?.textContent ?? '');
const addButton = () => screen.getByRole('button', { name: 'Į krepšelį' }) as HTMLButtonElement;

describe('ProductPurchase', () => {
  it('shows the smallest size and its price first', () => {
    render(<ProductPurchase variants={variants} productId="p1" />);
    expect((screen.getByRole('radio', { name: /150 g/ }) as HTMLInputElement).checked).toBe(true);
    expect(livePrice()).toBe('5,90 €');
    expect(addButton().dataset.variant).toBe('v150');
  });

  it('updates the price and the variant that will be added when a size is chosen', async () => {
    const user = userEvent.setup();
    render(<ProductPurchase variants={variants} productId="p1" />);

    await user.click(screen.getByRole('radio', { name: /600 g/ }));

    expect((screen.getByRole('radio', { name: /600 g/ }) as HTMLInputElement).checked).toBe(true);
    expect(livePrice()).toBe('19,00 €');
    expect(addButton().dataset.variant).toBe('v600');
  });

  it('can be operated with the keyboard', async () => {
    const user = userEvent.setup();
    render(<ProductPurchase variants={variants} productId="p1" />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect((screen.getByRole('radio', { name: /300 g/ }) as HTMLInputElement).checked).toBe(true);
    expect(livePrice()).toBe('10,50 €');
  });

  it('handles a product without sizes', () => {
    render(<ProductPurchase variants={[]} productId="p1" />);
    expect(screen.getByText('Šiuo metu nėra.')).toBeTruthy();
  });
});

describe('ProductCard', () => {
  it('links to the product and shows a "from" price with all sizes', () => {
    render(<ProductCard product={product} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/products/p1');
    expect(screen.getByRole('heading', { name: 'Klasikinis obuolių sūris' })).toBeTruthy();
    expect(screen.getByText('150 g · 300 g · 600 g')).toBeTruthy();
    expect(plain(link.textContent)).toContain('nuo 5,90 €');
  });

  it('uses the requested heading level', () => {
    render(<ProductCard product={product} headingAs="h3" />);
    expect(screen.getByRole('heading', { level: 3 })).toBeTruthy();
  });
});

describe('ContactForm', () => {
  const fillValid = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText('Vardas ir pavardė'), 'Jonas Jonaitis');
    await user.type(screen.getByLabelText('El. pašto adresas'), 'jonas@example.lt');
    await user.type(screen.getByLabelText('Tema'), 'Klausimas');
    await user.type(screen.getByLabelText('Žinutė'), 'Ar turite sūrio be cukraus?');
  };

  it('shows Lithuanian validation errors and does not submit an empty form', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: 'Siųsti žinutę' }));

    expect(await screen.findByText('Įveskite savo vardą')).toBeTruthy();
    expect(screen.getByText('Įveskite teisingą el. pašto adresą')).toBeTruthy();
    expect(screen.getByText('Įveskite temą')).toBeTruthy();
    expect(screen.getByText('Žinutė turi būti bent 10 simbolių')).toBeTruthy();
    expect(postAPI).not.toHaveBeenCalled();
    // Errors are exposed to screen readers
    expect(screen.getByLabelText('Vardas ir pavardė').getAttribute('aria-invalid')).toBe('true');
  });

  it('submits valid input, confirms with a toast and clears the form', async () => {
    postAPI.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Siųsti žinutę' }));

    await waitFor(() => expect(postAPI).toHaveBeenCalledTimes(1));
    expect(postAPI.mock.calls[0]?.[0]).toBe('contact');
    expect(postAPI.mock.calls[0]?.[1]).toMatchObject({ name: 'Jonas Jonaitis', email: 'jonas@example.lt' });
    await waitFor(() => expect(toast).toHaveBeenCalledWith('Ačiū! Jūsų žinutė išsiųsta. Atsakysime kuo greičiau.'));
    expect((screen.getByLabelText('Vardas ir pavardė') as HTMLInputElement).value).toBe('');
  });

  it('shows an error toast when sending fails', async () => {
    postAPI.mockRejectedValue(new Error('Per daug žinučių. Pabandykite vėliau.'));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Siųsti žinutę' }));
    await waitFor(() => expect(toast).toHaveBeenCalledWith('Per daug žinučių. Pabandykite vėliau.', 'error'));
  });
});
