import Header from '@/components/header';
import ContactForm from '@/components/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Qudmeet.click',
  description: 'Get in touch with us for any questions or support needs.',
  openGraph: {
    title: 'Contact Us | Qudmeet.click',
    description: 'Get in touch with us for any questions or support needs.',
    url: 'https://qudmeet.click/contact',
    siteName: 'Qudmeet.click',
    images: [
      {
        url: 'https://qudmeet.click/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <Header />
      <main className="mt-[80px] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>
          
          <ContactForm />

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
              <p className="mt-2 text-gray-600">
                <a href="mailto:support@qudmeet.click" className="text-blue-600 hover:text-blue-500">
                  support@qudmeet.click
                </a>
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Follow Us</h3>
              <p className="mt-2 text-gray-600">
                <a 
                  href="https://twitter.com/qudmeet" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-500"
                >
                  @qudmeet
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 