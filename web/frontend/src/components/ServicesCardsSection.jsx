import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ServicesCardsSection({ cards, loading }) {
  const list = Array.isArray(cards) ? cards : [];

  if (loading) {
    return (
      <section className="w-full py-6 px-6 lg:py-6">
        <div className="max-w-7xl mx-auto text-center py-12 text-[#22ACB6]">Loading cards…</div>
      </section>
    );
  }

  if (list.length === 0) {
    return (
      <section className="w-full py-6 px-6 lg:py-6">
        <div className="max-w-7xl mx-auto text-center py-12 text-gray-600">No services to display.</div>
      </section>
    );
  }

  return (
    <section className="w-full py-6 px-6 lg:py-6">
      <div className="mx-auto" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-3">
          {list.map((item, index) => {
            const imageUrl = item?.image_url ?? '';
            const title = item?.title ?? '';
            const description = item?.description ?? '';
            const href = item?.href ?? '';
            const CardWrapper = href ? Link : 'a';
            const wrapperProps = href ? { to: href } : { href: '#' };

            return (
              <CardWrapper
                {...wrapperProps}
                key={index}
                className="group block relative w-full max-w-[350px] bg-white rounded-3xl p-2 cursor-pointer transition-opacity my-6 border-[#e8e8e8] border-[2px]"
                style={{ animation: 'slideInCard 0.6s ease-out' }}
              >
                <div className="relative w-full">
                  {imageUrl && (
                    <ImageWithFallback
                      src={imageUrl}
                      alt={title}
                      className="w-full h-auto rounded-t-3xl block -mt-5 sm:-mt-10"
                      style={{ transform: 'scale(1.1)' }}
                    />
                  )}
                  <span
                    className="absolute bg-[#82cdcb] text-white rounded-full group-hover:bg-[#ee6e2a] transition-colors z-10 flex items-center justify-center md:right-2 md:bottom-2 right-0 bottom-0 pointer-events-none"
                    style={{ width: '30px', height: '30px' }}
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </div>
                <div className="p-6 pt-6 pb-[0px]">
                  <h3
                    className="text-2xl text-[#22ACB6] mb-3 font-black"
                    style={{ fontFamily: 'Museo, Helvetica, sans-serif', fontWeight: 900, fontSize: '23px' }}
                  >
                    {title}
                  </h3>
                  <div className="w-full h-px bg-gray-300 mb-3" />
                  <p className="text-[#3b4e6b] text-sm mb-4">{description}</p>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
