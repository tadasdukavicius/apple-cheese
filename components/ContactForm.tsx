'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../context/ToastContext';
import { postAPI } from '../lib/api';
import { contactSchema, type ContactFormValues } from '../lib/schemas';
import Field from './Field';

export default function ContactForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactFormValues) {
    try {
      await postAPI('contact', values);
      toast('Ačiū! Jūsų žinutė išsiųsta. Atsakysime kuo greičiau.');
      reset();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Nepavyko išsiųsti žinutės.', 'error');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Field id="name" label="Vardas ir pavardė" error={errors.name?.message}>
        {(p) => <input {...p} type="text" autoComplete="name" placeholder="Jūsų vardas ir pavardė" {...register('name')} />}
      </Field>
      <Field id="email" label="El. pašto adresas" error={errors.email?.message}>
        {(p) => <input {...p} type="email" autoComplete="email" placeholder="jusu@pastas.lt" {...register('email')} />}
      </Field>
      <Field id="subject" label="Tema" error={errors.subject?.message}>
        {(p) => <input {...p} type="text" placeholder="Dėl ko rašote?" {...register('subject')} />}
      </Field>
      <Field id="message" label="Žinutė" error={errors.message?.message}>
        {(p) => (
          <textarea {...p} rows={5} placeholder="Papasakokite, kuo galime padėti..." {...register('message')} className={`${p.className} resize-none`} />
        )}
      </Field>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Palikite tuščią</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
        {isSubmitting ? 'Siunčiama...' : 'Siųsti žinutę'}
      </button>
    </form>
  );
}
