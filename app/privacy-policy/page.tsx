import Header from '@/components/header';

export const metadata = {
  title: 'Privacy Policy | Qudmeet',
  description: 'Our privacy policy and data protection practices.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <Header />
      <main className="mt-[80px] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us when using our services, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Usage data and interactions with our services</li>
                <li>Device and browser information</li>
                <li>Content you upload or create using our tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the collected information to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide and improve our services</li>
                <li>Personalize your experience</li>
                <li>Communicate with you about updates and features</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the Internet is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies and Tracking</h2>
              <p className="text-gray-600">
                We use cookies and similar tracking technologies to improve user experience and 
                analyze service usage. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-600">
                Our services may include links to third-party websites or services. We are not 
                responsible for their privacy practices or content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
              <p className="text-gray-600">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:us@qudmeet.click" className="text-blue-600 hover:text-blue-500">
                  us@qudmeet.click
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 