import React, { useMemo, useState } from 'react';
import { formSubmitErrorMessage, postJsonWithNonce } from '../api/postJsonWithNonce';
import { customApiUrl } from '../api/wp';
import { useFormNonce } from '../hooks/useFormNonce';
import { getTurnstileToken } from '../utils/turnstile';

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AssetFinanceApplyFormBlock({
  title = 'Apply Now!',
  anchor,
  backgroundColor = '#eef0f3',
  titleColor = '#ED6E2A',
  labelColor = '#000000',
  inputBorderColor = '#e8e8e8',
  buttonLabel = 'SUBMIT YOUR APPLICATION',
  buttonBgColor = '#ED6E2A',
  buttonTextColor = '#ffffff',
  buttonHoverBgColor = '#22ACB6',
  buttonHoverTextColor = '#ffffff',
  successMessage = 'Thanks — we received your application.',
}) {
  const explicitAnchor = typeof anchor === 'string' && anchor.trim() ? anchor.trim() : '';
  const derived = slugifyId(title);
  const id = explicitAnchor || derived || 'apply';

  const endpoint = useMemo(() => customApiUrl('/contact'), []);
  const { nonceRef, ensureNonce } = useFormNonce();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '0.00',
    company: '', // honeypot
  });
  const [hover, setHover] = useState(false);
  const [status, setStatus] = useState({ state: 'idle', message: '' }); // idle|sending|success|error

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
          form: 'Asset Finance Apply',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount: formData.amount,
          company: formData.company,
          ...(turnstileToken ? { turnstileToken } : {}),
        },
        nonce
      );
      setStatus({ state: 'success', message: successMessage || 'Submitted.' });
      setFormData({ name: '', email: '', phone: '', amount: '0.00', company: '' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Apply form submit failed', {
        endpoint,
        status: err?.status,
        code: err?.code || err?.data?.code,
        message: err?.message,
        data: err?.data,
      });
      setStatus({
        state: 'error',
        message: formSubmitErrorMessage(err, 'Failed to submit your application. Please try again.'),
      });
    }
  };

  return (
    <section
      id={id}
      className="w-full py-15 px-6 lg:py-15"
      style={{
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor: backgroundColor || '#eef0f3',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-black mb-8" style={{ color: titleColor || '#ED6E2A', fontFamily: 'Museo900-Regular, Museo, sans-serif' }}>
          {title}
        </h2>

        <form onSubmit={handleSubmit} className="">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor={`${id}-name`} className="block text-[16px] font-bold mb-2" style={{ color: labelColor || '#000000' }}>
                  Name
                </label>
                <input
                  type="text"
                  id={`${id}-name`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full px-4 py-3 border text-[#000000] focus:outline-none"
                  style={{ borderColor: inputBorderColor || '#e8e8e8' }}
                  required
                />
              </div>

              <div>
                <label htmlFor={`${id}-email`} className="block text-[16px] font-bold mb-2" style={{ color: labelColor || '#000000' }}>
                  Email
                </label>
                <input
                  type="email"
                  id={`${id}-email`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 border"
                  style={{ borderColor: inputBorderColor || '#e8e8e8' }}
                  required
                />
              </div>

              <div>
                <label htmlFor={`${id}-phone`} className="block text-[16px] font-bold mb-2" style={{ color: labelColor || '#000000' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  id={`${id}-phone`}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-4 py-3 border"
                  style={{ borderColor: inputBorderColor || '#e8e8e8' }}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor={`${id}-amount`} className="block text-[16px] font-bold mb-2" style={{ color: labelColor || '#000000' }}>
                Amount
              </label>
              <input
                type="number"
                id={`${id}-amount`}
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border"
                style={{ borderColor: inputBorderColor || '#e8e8e8' }}
                required
              />
            </div>

            {/* honeypot (hidden) */}
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
              className="w-full px-6 py-4 font-bold text-sm uppercase tracking-wider transition-colors"
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
      </div>
    </section>
  );
}

