const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

export const formatPrice = (amount: number) => eur.format(amount);
