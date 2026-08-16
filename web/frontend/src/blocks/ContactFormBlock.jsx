import React from 'react';
import { SimpleContactForm } from '../components/SimpleContactForm';

/**
 * Gutenberg block: custom/contact-form — Contact Us enquiry form.
 */
export function ContactFormBlock({
  title = 'Get in touch.',
  subtitle = 'Reach out to us and we will respond as soon as we can.',
  formName = 'Contact Form',
  backgroundColor = '#ffffff',
  titleColor = '#22ABB5',
  textColor = '#333333',
  labelColor = '#333333',
  inputBorderColor = '#e8e8e8',
  buttonLabel = 'SUBMIT',
  buttonBgColor = '#ED6E2A',
  buttonTextColor = '#ffffff',
  buttonHoverBgColor = '#22ACB6',
  buttonHoverTextColor = '#ffffff',
  successMessage = 'Thanks — we have received your message.',
}) {
  return (
    <section
      style={{
        backgroundColor,
        color: textColor,
        padding: '2.5rem 1.25rem',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {title ? (
          <h2
            style={{
              color: titleColor,
              fontSize: '1.75rem',
              marginBottom: subtitle ? '0.5rem' : '1.5rem',
            }}
          >
            {title}
          </h2>
        ) : null}
        {subtitle ? <p style={{ marginBottom: '1.5rem' }}>{subtitle}</p> : null}
        <SimpleContactForm
          formName={formName}
          labelColor={labelColor}
          inputBorderColor={inputBorderColor}
          buttonLabel={buttonLabel}
          buttonBgColor={buttonBgColor}
          buttonTextColor={buttonTextColor}
          buttonHoverBgColor={buttonHoverBgColor}
          buttonHoverTextColor={buttonHoverTextColor}
          successMessage={successMessage}
        />
      </div>
    </section>
  );
}
