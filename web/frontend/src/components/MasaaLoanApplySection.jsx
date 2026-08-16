import React, { useState } from 'react';

const ORANGE = '#ED6E2A';
const BODY_COLOR = '#000000';

export function MasaaLoanApplySection({ index = 4 }) {
  const backgroundColor = index % 2 === 0 ? '#eef0f3' : '#ffffff';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '0.00',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="apply"
      className="w-full py-15 px-6 lg:py-15"
      style={{
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
        scrollMarginTop: '10px',
        backgroundColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-black mb-8"
          style={{ color: ORANGE, fontFamily: 'Museo900-Regular, Museo, sans-serif' }}
        >
          Apply Now!
        </h2>

        <form onSubmit={handleSubmit} className="">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-[16px] font-bold mb-2" style={{ color: BODY_COLOR }}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full px-4 py-3 border text-[#000000] border-[#e8e8e8] focus:outline-none "
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[16px] font-bold mb-2" style={{ color: BODY_COLOR }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-[#e8e8e8]"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[16px] font-bold mb-2" style={{ color: BODY_COLOR }}>
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-4 py-3 border border-[#e8e8e8]"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="amount" className="block text-[16px] font-bold mb-2" style={{ color: BODY_COLOR }}>
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-[#e8e8e8]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 font-bold text-sm uppercase tracking-wider text-white transition-colors hover:bg-[#22ACB6]"
              style={{ backgroundColor: ORANGE }}
            >
              SUBMIT YOUR APPLICATION
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

