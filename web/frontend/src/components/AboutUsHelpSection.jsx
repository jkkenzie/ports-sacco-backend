import { HelpContent } from './HelpSection';

export function AboutUsHelpSection() {
  return (
    <section
      id="help"
      className="w-full py-12 lg:py-16"
      style={{
        backgroundColor: '#eef0f3',
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
      }}
    >
      <HelpContent
        showHeader={false}
        buttonClassName="px-10"
        cardIconColor="#EE6E2A"
      />
    </section>
  );
}
