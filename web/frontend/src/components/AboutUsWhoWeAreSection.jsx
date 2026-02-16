import roundedBg from '../../assets/image/rounded-bg-1.svg';
import visionImg from '../../assets/image/vision.png';
import missionImg from '../../assets/image/mission.png';
import purposeImg from '../../assets/image/purpose.png';
import coreValuesImg from '../../assets/image/core-values.png';

const TEAL = '#40C9BF';
const BODY_COLOR = '#333333';

const listItems = [
  'Kenya Ports Authority (KPA).',
  'Salaried individuals from various organizations and institutions.',
  'Investment, women, youth and welfare groups.',
  'Corporates, retirees, and pensioners.',
  'Business people in Micro, Small, and Medium Enterprises (MSMEs).',
  'Any other Kenyan with a reliable income.',
  'Kenyans in the diaspora.',
];

export function AboutUsWhoWeAreSection() {
  return (
    <section
      id="who-we-are"
      className="w-full bg-white py-12 lg:py-16"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-bold mb-6"
          style={{ color: TEAL }}
        >
          Who We Are
        </h2>

        <div className="space-y-5" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
          <p>
            Ports DT Sacco, your trusted financial partner since 1966, is a Tier 1 licensed deposit-taking Sacco regulated by the Sacco Society Regulatory Authority (SASRA). Originally established by employees of the East African Harbours & Railways Corporation (currently KPA), we opened our common bond in 2010, expanded our membership, and today, our diverse community includes members from:
          </p>

          <ul
            className="pl-6 space-y-2"
            style={{ listStyleType: 'circle' }}
          >
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <p>
            Ports Sacco has strategically positioned itself to serve you better through both physical and online outlets. These include Mombasa the heart of our operations; Voi conveniently serving our members in the region; Nairobi at the Internal Container Depot (ICD) and CBD; and Kisumu catering to the needs of our members in the western region.
          </p>

          <p>
            Our International and diaspora members are served through our digital channels including the member portal.
          </p>
        </div>
      </div>

      {/* Vision, Mission, Purpose & Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 lg:pt-16">
        {/* Top row: three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {/* Our Vision */}
          <div className="flex flex-col items-center text-center">
            <div
              className="flex items-center justify-center flex-shrink-0 bg-no-repeat bg-center bg-contain"
              style={{ width: 150, height: 150, backgroundImage: `url(${roundedBg})` }}
            >
              <img src={visionImg} alt="" className="w-19 h-19 object-contain" aria-hidden />
            </div>
            <h3 className="mt-4 mb-2" style={{ color: TEAL, fontFamily: 'Museo700-Regular, Museo, sans-serif', fontSize: '26px' }}>
              Our Vision
            </h3>
            <p className="text-sm md:text-base text-center" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
              To be a formidable financial institution by providing competitive financial solutions to a happy, healthy and prosperous people.
            </p>
          </div>

          {/* Our Mission */}
          <div className="flex flex-col items-center text-center">
            <div
              className="flex items-center justify-center flex-shrink-0 bg-no-repeat bg-center bg-contain"
              style={{ width: 150, height: 150, backgroundImage: `url(${roundedBg})` }}
            >
              <img src={missionImg} alt="" className="w-19 h-19 object-contain" aria-hidden />
            </div>
            <h3 className="mt-4 mb-2" style={{ color: TEAL, fontFamily: 'Museo700-Regular, Museo, sans-serif', fontSize: '26px' }}>
              Our Mission
            </h3>
            <p className="text-sm md:text-base text-center" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
              To strengthen the socio-economic well-being of our customers through prudent management and innovative products and services.
            </p>
          </div>

          {/* Our Purpose */}
          <div className="flex flex-col items-center text-center">
            <div
              className="flex items-center justify-center flex-shrink-0 bg-no-repeat bg-center bg-contain"
              style={{ width: 150, height: 150, backgroundImage: `url(${roundedBg})` }}
            >
              <img src={purposeImg} alt="" className="w-19 h-19 object-contain" aria-hidden />
            </div>
            <h3 className="mt-4 mb-2" style={{ color: TEAL, fontFamily: 'Museo700-Regular, Museo, sans-serif', fontSize: '26px' }}>
              Our Purpose
            </h3>
            <p className="text-sm md:text-base text-center" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
              Uplifting People. Inspiring happiness, optimism and hope.
            </p>
          </div>
        </div>

        {/* Bottom: Our Core Values */}
        <div className="flex flex-col items-center text-center mt-12 lg:mt-16">
          <div
            className="flex items-center justify-center flex-shrink-0 bg-no-repeat bg-center bg-contain"
            style={{ width: 150, height: 150, backgroundImage: `url(${roundedBg})` }}
          >
            <img src={coreValuesImg} alt="" className="w-19 h-19 object-contain" aria-hidden />
          </div>
          <h3 className="mt-4 mb-4" style={{ color: TEAL, fontFamily: 'Museo700-Regular, Museo, sans-serif', fontSize: '26px' }}>
            Our Core Values
          </h3>
          <div className="space-y-3 max-w-2xl text-center" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
            <p className="text-sm md:text-base">
              <strong style={{ color: TEAL, fontSize: '21px' }}>Caring:</strong> We are truthful, we listen and go extra mile-above and beyond.
            </p>
            <p className="text-sm md:text-base">
              <strong style={{ color: TEAL, fontSize: '21px' }}>Equity:</strong> We are committed to inclusivity, equality, fairness, public good and social justice.
            </p>
            <p className="text-sm md:text-base">
              <strong style={{ color: TEAL, fontSize: '21px' }}>Consistency:</strong> We are predictable, dependable, and reliable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
