const eur = new Intl.NumberFormat('lt-LT', { style: 'currency', currency: 'EUR' });

export const formatPrice = (amount: number) => eur.format(amount);
