import React, { useMemo, useState } from 'react';
import { formSubmitErrorMessage, postJsonWithNonce } from '../api/postJsonWithNonce';
import { customApiUrl } from '../api/wp';
import { useFormNonce } from '../hooks/useFormNonce';
import { getTurnstileToken } from '../utils/turnstile';

export function SimpleContactForm({
  formName = 'Contact Form',
  labelColor = '#333333',
  inputBorderColor = '#e8e8e8',
  buttonLabel = 'SUBMIT',
  buttonBgColor = '#ED6E2A',
  buttonTextColor = '#ffffff',
  buttonHoverBgColor = '#22ACB6',
  buttonHoverTextColor = '#ffffff',
  successMessage = 'Thanks — we have received your message.',
}) {
  const endpoint = useMemo(() => customApiUrl('/contact'), []);
  const { nonceRef, ensureNonce } = useFormNonce();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    company: '',
  });
  const [hover, setHover] = useState(false);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const turnstileToken = await getTurnstileToken({ action: 'contact_submit' });
      await postJsonWithNonce(
        endpoint,
        {
          form: formName,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          company: formData.company,
          ...(turnstileToken ? { turnstileToken } : {}),
        },
        nonce
      );
      setStatus({ state: 'success', message: successMessage || 'Submitted.' });
      setFormData({ name: '', email: '', phone: '', message: '', company: '' });
    } catch (err) {
      console.error('Contact form submit failed', {
        endpoint,
        status: err?.status,
        code: err?.code || err?.data?.code,
        message: err?.message,
        data: err?.data,
      });
      setStatus({
        state: 'error',
        message: formSubmitErrorMessage(err, 'Failed to send your message. Please try again.'),
      });
    }
  };

  const inputClass = 'w-full px-4 py-3 border text-[#000000] focus:outline-none';
  const labelClass = 'block text-[16px] font-bold mb-2';

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="contact-name" className={labelClass} style={{ color: labelColor }}>
              Name
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className={inputClass}
              style={{ borderColor: inputBorderColor }}
              required
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass} style={{ color: labelColor }}>
              Email
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={inputClass}
              style={{ borderColor: inputBorderColor }}
              required
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className={labelClass} style={{ color: labelColor }}>
              Phone
            </label>
            <input
              type="tel"
              id="contact-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className={inputClass}
              style={{ borderColor: inputBorderColor }}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass} style={{ color: labelColor }}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="How can we help?"
            rows={5}
            className={`${inputClass} resize-y min-h-[120px]`}
            style={{ borderColor: inputBorderColor }}
          />
        </div>

        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
          aria-hidden="true"
        />

        {status.state === 'success' ? (
          <div className="text-sm font-semibold" style={{ color: '#166534' }}>
            {status.message}
          </div>
        ) : null}
        {status.state === 'error' ? (
          <div className="text-sm font-semibold" style={{ color: '#991b1b' }}>
            {status.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status.state === 'sending'}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="w-full md:w-auto px-8 py-4 font-bold text-sm uppercase tracking-wider transition-colors"
          style={{
            backgroundColor: hover ? buttonHoverBgColor : buttonBgColor,
            color: hover ? buttonHoverTextColor : buttonTextColor,
            opacity: status.state === 'sending' ? 0.7 : 1,
          }}
        >
          {status.state === 'sending' ? 'SENDING...' : buttonLabel}
        </button>
      </div>
    </form>
  );
}
