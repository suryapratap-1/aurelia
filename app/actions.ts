'use server';

import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2, 'Please give your name.').max(80),
  email: z.email('Please give an email address we could reply to.').max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+()\d\s-]*$/, 'Numbers, spaces and + only.')
    .optional()
    .or(z.literal('')),
  interest: z.enum(['viewing', 'residence', 'similar'], { message: 'Choose what you would like.' }),
  message: z.string().trim().max(1200, 'Please keep it under 1,200 characters.').optional().or(z.literal('')),
  consent: z.literal('on', { message: 'Please confirm you have read the note on this concept.' }),
});

export type EnquiryState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof schema>, string[]>>;
  values?: Record<string, string>;
};

/**
 * Validates an enquiry on the server. This is a concept site with no back office:
 * a valid enquiry is acknowledged but not stored or sent anywhere.
 */
export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // honeypot: real people never fill this field
  if (String(formData.get('company') ?? '') !== '') return { ok: true, message: 'Thank you.' };

  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    interest: String(formData.get('interest') ?? ''),
    message: String(formData.get('message') ?? ''),
    consent: formData.get('consent') ?? undefined,
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const { consent: _c, ...values } = raw;
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors, values: values as Record<string, string> };
  }
  const first = parsed.data.name.split(/\s+/)[0];
  return {
    ok: true,
    message: `Thank you, ${first}. Your enquiry passed every check, but Aurelia is a concept, so it went nowhere and nobody will call.`,
  };
}
