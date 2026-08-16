import React from 'react';
import ContactForm from '../components/ContactForm/ContactForm';
import { SectionPageTitle } from '../components/SectionPageTitle';

/**
 * Gutenberg block: custom/new-member-registration — membership onboarding form.
 */
export function NewMemberRegistrationBlock({
  title = 'Join Us',
  subtitle = '',
  anchor,
  backgroundColor = '#ffffff',
  titleColor = '#22ABB5',
  textColor = '#333333',
}) {
  return (
    <section
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {title ? (
        <SectionPageTitle anchor={anchor} color={titleColor}>
          {title}
        </SectionPageTitle>
      ) : null}
      {subtitle ? <p className="px-[50px] mb-6 -mt-2">{subtitle}</p> : null}
      <div className="px-[50px] pb-10">
        <ContactForm />
      </div>
    </section>
  );
}
