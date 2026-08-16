import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { formSubmitErrorMessage, postJsonWithNonce } from '../api/postJsonWithNonce';
import { customApiUrl } from '../api/wp';
import { useFormNonce } from '../hooks/useFormNonce';
import { getTurnstileToken } from '../utils/turnstile';

const BODY = 'Sans-serif, Helvetica, sans-serif';

/**
 * Newsletter signup form (The Newsletter Plugin via REST).
 * Layout matches Xfrontend NewsletterSection.
 */
export function NewsletterSubscribeForm({
  formUid = 'newsletter',
  emailPlaceholder = 'Enter Your Email Address',
  submitButtonText = 'SUBSCRIBE',
  submitButtonWidth = '300px',
  inputBgColor = '#38f0ba',
  inputTextColor = '#3b4e6b',
  inputPlaceholderColor = '#3b4e6b',
  submitBgColor = '#EE6E2A',
  submitTextColor = '#ffffff',
  submitArrowColor = '#ffffff',
  listIds = [],
  formId = '',
}) {
  const { nonceRef, ensureNonce } = useFormNonce();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'idle', message: '' });

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus({ state: 'error', message: 'Please enter your email address.' });
      return;
    }

    setStatus({ state: 'sending', message: '' });

    try {
      const nonce = (await ensureNonce({ force: true })) || nonceRef.current;
      if (!nonce) {
        setStatus({
          state: 'error',
          message: 'Unable to verify the form. Please refresh the page and try again.',
        });
        return;
      }

      const turnstileToken = await getTurnstileToken({ action: 'newsletter_subscribe' });
      const data = await postJsonWithNonce(
        customApiUrl('/newsletter-subscribe'),
        {
          email: trimmed,
          list_ids: Array.isArray(listIds) ? listIds.filter((id) => Number(id) > 0) : [],
          form_id: formId || '',
          _gotcha: '',
          ...(turnstileToken ? { turnstileToken } : {}),
        },
        nonce
      );

      if (data?.success) {
        setStatus({ state: 'success', message: data.message || 'Thank you for subscribing.' });
        setEmail('');
        return;
      }

      setStatus({
        state: 'error',
        message: data?.message || 'Subscription failed. Please try again.',
      });
    } catch (err) {
      setStatus({
        state: 'error',
        message: formSubmitErrorMessage(err, 'Subscription failed. Please try again.'),
      });
    }
  };

  return (
    <>
      <style>
        {`
          [data-newsletter-form="${formUid}"] input[type="email"]::placeholder {
            color: ${inputPlaceholderColor};
            opacity: 0.7;
          }
        `}
      </style>

      <form
        data-newsletter-form={formUid}
        onSubmit={handleSubmit}
        noValidate
        className="relative flex flex-col lg:flex-row items-center gap-4"
      >
        <input
          type="text"
          name="_gotcha"
          value=""
          readOnly
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px] opacity-0 w-px h-px overflow-hidden"
          aria-hidden="true"
        />

        <input
          type="email"
          name="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder={emailPlaceholder}
          required
          autoComplete="email"
          disabled={status.state === 'sending'}
          className="flex-1 rounded-full px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-white min-w-0 w-full lg:w-auto border-0 disabled:opacity-70"
          style={{
            fontFamily: BODY,
            backgroundColor: inputBgColor,
            color: inputTextColor,
            caretColor: inputTextColor,
          }}
          aria-invalid={status.state === 'error'}
        />

        <button
          type="submit"
          disabled={status.state === 'sending'}
          className="text-white px-8 py-4 rounded-full text-sm font-bold hover:opacity-90 transition-opacity flex items-center whitespace-nowrap relative w-full lg:w-auto disabled:opacity-70"
          style={{
            fontFamily: BODY,
            width: submitButtonWidth,
            maxWidth: '100%',
            backgroundColor: submitBgColor,
            color: submitTextColor,
          }}
        >
          <span className="flex-1 text-center pr-8">
            {status.state === 'sending' ? 'SUBSCRIBING...' : submitButtonText}
          </span>
          <ArrowRight className="w-5 h-5 absolute right-4" strokeWidth={3} style={{ color: submitArrowColor }} aria-hidden />
        </button>
      </form>

      {status.message ? (
        <p
          className={`mt-3 w-full text-sm font-medium text-center lg:text-left ${
            status.state === 'success' ? 'text-white' : 'text-red-100'
          }`}
          role={status.state === 'error' ? 'alert' : 'status'}
        >
          {status.message}
        </p>
      ) : null}
    </>
  );
}
