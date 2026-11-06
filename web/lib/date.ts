const dateTime = new Intl.DateTimeFormat('lt-LT', { dateStyle: 'medium', timeStyle: 'short' });
const dateLong = new Intl.DateTimeFormat('lt-LT', { dateStyle: 'long' });

export const formatDate = (iso: string) => dateTime.format(new Date(iso));
export const formatDateLong = (iso: string) => dateLong.format(new Date(iso));
