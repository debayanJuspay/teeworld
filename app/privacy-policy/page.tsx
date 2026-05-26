export const metadata = {
  title: "Privacy Policy - TeeWorld",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-sm text-muted-foreground space-y-6">
        <p>
          At TeeWorld, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide, including your name, email address, phone number, shipping address, and payment details. We also collect non-personal information such as browser type, device information, and browsing behaviour through cookies and analytics tools.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <p>
            We use your information to process orders, communicate order updates, provide customer support, improve our website experience, and send promotional offers (only if you opt in). We do not sell or rent your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Payment Security</h2>
          <p>
            All payment transactions are processed through Razorpay, a PCI-DSS compliant payment gateway. TeeWorld does not store your credit card or debit card details on our servers. Your payment information is encrypted and handled directly by Razorpay.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Cookies</h2>
          <p>
            We use cookies to enhance your browsing experience, remember your preferences, and analyse website traffic. You can disable cookies through your browser settings, though this may affect certain functionalities of our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Data Sharing</h2>
          <p>
            We may share your information with trusted third-party service providers, such as courier partners and payment processors, solely for the purpose of fulfilling your order. All such partners are contractually obligated to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account data at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, please contact us using the details below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy regularly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please reach out to us at hello@teeworld.com or call +91 96093 84607.
          </p>
        </section>
      </div>
    </div>
  );
}
