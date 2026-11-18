'use client';

import { useActionState, useId } from 'react';
import { type EnquiryState, submitEnquiry } from '@/app/actions';

const initial: EnquiryState = { ok: false };

function Field({
  name,
  label,
  type = 'text',
  autoComplete,
  required,
  state,
  hint,
}: {
  name: 'name' | 'email' | 'phone';
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  state: EnquiryState;
  hint?: string;
}) {
  const id = useId();
  const err = state.errors?.[name]?.[0];
  return (
    <div>
      <label htmlFor={id} className="label block !text-paper/70">
        {label}
        {!required && <span className="normal-case tracking-normal"> (optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        defaultValue={state.values?.[name]}
        aria-invalid={!!err}
        aria-describedby={err ? `${id}-e` : hint ? `${id}-h` : undefined}
        className="mt-2 w-full border-0 border-b border-paper/40 bg-transparent py-3 text-[1.12rem] text-paper outline-none transition-colors placeholder:text-paper/35 focus:border-bronze aria-[invalid=true]:border-[#e0a37a]"
      />
      {hint && !err && (
        <p id={`${id}-h`} className="mt-2 text-[0.85rem] text-paper/55">
          {hint}
        </p>
      )}
      {err && (
        <p id={`${id}-e`} className="mt-2 text-[0.88rem] text-[#f0b892]">
          {err}
        </p>
      )}
    </div>
  );
}

export function Enquiry() {
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const msgId = useId();
  const interestErr = state.errors?.interest?.[0];
  const consentErr = state.errors?.consent?.[0];

  return (
    <section id="enquire" aria-labelledby="enquire-title" className="relative z-10 bg-charcoal pb-28 pt-28 text-paper md:pb-36 md:pt-36">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 md:col-span-5">
          <p className="label !text-paper/60 mb-6">Enquire</p>
          <h2 id="enquire-title" className="text-[length:var(--text-title)]">
            Arrange a viewing of a home that isn’t&nbsp;there.
          </h2>
          <p className="mt-6 max-w-[36ch] text-paper/75">
            The form below works: it checks every field on the server and answers you. Because Aurelia is a fictional concept, nothing you type is stored or
            sent.
          </p>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          {state.ok ? (
            <div role="status" className="border-t border-paper/30 pt-8">
              <p className="font-display text-[2.2rem] leading-tight">Received.</p>
              <p className="mt-4 max-w-[40ch] text-paper/80">{state.message}</p>
            </div>
          ) : (
            <form action={action} noValidate className="space-y-9" aria-describedby={msgId}>
              <p id={msgId} className="sr-only">
                Fields marked optional can be left blank.
              </p>
              <div className="grid gap-9 sm:grid-cols-2">
                <Field name="name" label="Name" autoComplete="name" required state={state} />
                <Field name="email" label="Email" type="email" autoComplete="email" required state={state} />
              </div>
              <Field name="phone" label="Telephone" type="tel" autoComplete="tel" state={state} hint="Only if you would rather be called." />

              <fieldset aria-describedby={interestErr ? 'interest-e' : undefined}>
                <legend className="label !text-paper/70">I would like</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    ['viewing', 'A private viewing'],
                    ['residence', 'Details of 23W'],
                    ['similar', 'Similar residences'],
                  ].map(([v, l]) => (
                    <label key={v} className="cursor-pointer">
                      <input type="radio" name="interest" value={v} defaultChecked={(state.values?.interest ?? 'viewing') === v} className="peer sr-only" />
                      <span className="inline-block border border-paper/35 px-4 py-2 text-[0.95rem] transition-colors peer-checked:border-bronze peer-checked:bg-bronze peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze">
                        {l}
                      </span>
                    </label>
                  ))}
                </div>
                {interestErr && (
                  <p id="interest-e" className="mt-2 text-[0.88rem] text-[#f0b892]">
                    {interestErr}
                  </p>
                )}
              </fieldset>

              <div>
                <label htmlFor="msg" className="label block !text-paper/70">
                  Message <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  id="msg"
                  name="message"
                  rows={3}
                  defaultValue={state.values?.message}
                  className="mt-2 w-full resize-y border-0 border-b border-paper/40 bg-transparent py-3 text-[1.08rem] text-paper outline-none focus:border-bronze"
                />
              </div>

              {/* honeypot */}
              <div aria-hidden="true" className="absolute -left-[9999px]">
                <label>
                  Company <input name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] text-paper/80">
                  <input
                    type="checkbox"
                    name="consent"
                    className="mt-1 h-4 w-4 accent-[var(--color-bronze)]"
                    aria-invalid={!!consentErr}
                    aria-describedby={consentErr ? 'consent-e' : undefined}
                  />
                  <span>I understand Aurelia Residences is a fictional concept: there is no residence, no price and no sales team.</span>
                </label>
                {consentErr && (
                  <p id="consent-e" className="mt-2 text-[0.88rem] text-[#f0b892]">
                    {consentErr}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-door disabled:opacity-60" disabled={pending}>
                {pending ? 'Checking…' : 'Send enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
