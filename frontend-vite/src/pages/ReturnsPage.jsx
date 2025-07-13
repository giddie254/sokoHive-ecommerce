import React from 'react';

const ReturnsPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Return & Refund Policy</h1>

      <p className="mb-4 text-gray-700 dark:text-text-darkSecondary">
        At <strong>SokoHive</strong>, we want you to love what you ordered. If something isn’t right, we’re here to help.
      </p>

      <ul className="list-disc pl-5 space-y-3 text-sm text-gray-700 dark:text-text-darkSecondary">
        <li>
          You can return most new, unopened items within <strong>7 days</strong> of delivery for a full refund or exchange.
        </li>
        <li>
          Items must be in their original condition and packaging.
        </li>
        <li>
          Return shipping costs are the responsibility of the customer unless the return is due to our error.
        </li>
        <li>
          Refunds are processed within 3–5 business days after we receive and inspect your return.
        </li>
        <li>
          Some items like underwear, clearance items, and customized products are non-returnable.
        </li>
      </ul>

      <p className="mt-6 text-sm text-gray-500">
        For questions or to initiate a return, please contact our support team at <a href="/help" className="text-primary underline">SokoHive Help Center</a>.
      </p>
    </div>
  );
};

export default ReturnsPage;
