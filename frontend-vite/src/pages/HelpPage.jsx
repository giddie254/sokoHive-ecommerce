import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const HelpPage = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Help & Support</h1>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-background-darkSecondary shadow p-6 rounded-xl text-center">
          <Mail className="w-10 h-10 mx-auto text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Email Support</h3>
          <p className="text-sm mb-2">Get help by email</p>
          <a href="mailto:support@sokohive.com" className="text-primary hover:underline">
            support@sokohive.com
          </a>
        </div>

        <div className="bg-white dark:bg-background-darkSecondary shadow p-6 rounded-xl text-center">
          <Phone className="w-10 h-10 mx-auto text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Call Us</h3>
          <p className="text-sm mb-2">Available Mon–Sat, 8am–5pm</p>
          <a href="tel:+254712345678" className="text-primary hover:underline">
            +254 712 345 678
          </a>
        </div>

        <div className="bg-white dark:bg-background-darkSecondary shadow p-6 rounded-xl text-center">
          <MessageCircle className="w-10 h-10 mx-auto text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
          <p className="text-sm">Chat with a support agent in real-time</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-background-darkSecondary p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-primary mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5 text-sm text-gray-700 dark:text-text-darkSecondary">
          <div>
            <h3 className="font-medium text-text-primary dark:text-white mb-1">
              How do I track my order?
            </h3>
            <p>
              After placing an order, you'll receive a tracking link in your email or you can check your order status in your account dashboard under "Orders".
            </p>
          </div>

          <div>
            <h3 className="font-medium text-text-primary dark:text-white mb-1">
              What payment methods are supported?
            </h3>
            <p>
              We accept MPESA, Visa, Mastercard, and PayPal. You can select your preferred method during checkout.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-text-primary dark:text-white mb-1">
              Can I return or exchange a product?
            </h3>
            <p>
              Yes! You have 2 days after delivery to return items that are damaged, defective, or unsatisfactory. Contact our team to initiate a return.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-text-primary dark:text-white mb-1">
              How do I contact customer service?
            </h3>
            <p>
              You can reach us via <a href="mailto:support@sokohive.com" className="text-primary underline">email</a>, call, or use the chat feature on this page.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Homepage */}
      <div className="text-center mt-12">
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-2 rounded-full text-sm hover:bg-primary-light transition"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default HelpPage;

