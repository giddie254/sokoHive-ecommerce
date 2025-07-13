// src/pages/ShippingPage.jsx
import React from 'react';

const ShippingPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Shipping Information</h1>
      <p className="text-gray-700 dark:text-text-darkSecondary mb-4">
        We offer fast and reliable delivery to all major towns in Kenya and selected international destinations.
      </p>

      <ul className="list-disc pl-5 space-y-3 text-sm">
        <li>
          <strong>Standard Shipping:</strong> 2–5 business days (KSh 200–500 depending on location).
        </li>
        <li>
          <strong>Same-Day Delivery:</strong> Available in Nairobi for orders placed before 12PM.
        </li>
        <li>
          <strong>International Shipping:</strong> Available upon request. Contact support for custom quotes.
        </li>
        <li>
          You can track your order via your account dashboard after placing an order.
        </li>
      </ul>

      <p className="mt-6 text-sm text-gray-500">
        Need help? <a href="/help" className="text-primary underline">Visit our Help Center</a>
      </p>
    </div>
  );
};

export default ShippingPage;
