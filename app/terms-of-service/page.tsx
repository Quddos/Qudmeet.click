import Header from '@/components/header';

export const metadata = {
  title: 'Terms of Service | Qudmeet',
  description: 'Our terms of service and usage conditions.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <Header />
      <main className="mt-[80px] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing or using our services, you agree to be bound by these Terms of Service. 
                If you disagree with any part of the terms, you may not access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600 mb-4">
                We grant you a limited, non-exclusive, non-transferable license to use our services 
                for personal or business purposes, subject to these terms.
              </p>
              <p className="text-gray-600">You must not:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Modify or copy the materials without explicit permission</li>
                <li>Use the materials for commercial purposes without authorization</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person or mirror them</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600">
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Service Modifications</h2>
              <p className="text-gray-600">
                We reserve the right to modify or discontinue our services at any time without notice. 
                We shall not be liable to you or any third party for any modification, suspension, or 
                discontinuance of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-600">
                We shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages resulting from your use of or inability to use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Governing Law</h2>
              <p className="text-gray-600">
                These terms shall be governed by and construed in accordance with the laws of your 
                jurisdiction, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="text-gray-600">
                For any questions about these Terms of Service, please contact us at{' '}
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