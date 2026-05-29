export const metadata = {
  title: "Terms & Conditions - TeeWorld",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <div className="prose prose-sm text-muted-foreground space-y-6">
        <p>
          Welcome to TeeWorld. By accessing or using our website, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please discontinue use of our services immediately.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>
            By placing an order or browsing our website, you confirm that you are at least 18 years old or have parental consent to use our services. These terms apply to all visitors, users, and customers of TeeWorld.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Products & Pricing</h2>
          <p>
            All product descriptions, images, and prices are subject to change without notice. We make every effort to display accurate colours and details, but variations may occur due to screen settings. Prices are listed in INR and inclusive of applicable taxes unless stated otherwise.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Orders & Payment</h2>
          <p>
            Orders are confirmed only upon successful payment. We reserve the right to cancel any order for reasons including stock unavailability, pricing errors, or suspected fraudulent activity. Payments are processed securely via Razorpay.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Shipping & Delivery</h2>
          <p>
            We aim to dispatch orders within 2-3 business days. Delivery timelines vary by location and are estimates only. TeeWorld is not liable for delays caused by courier partners or unforeseen circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Returns & Refunds</h2>
          <p>
            We accept returns within 7 days of delivery for unworn, unwashed items with original tags intact. Refunds are processed to the original payment method within 5-7 business days after we receive the returned item. Shipping costs for returns are borne by the customer unless the item was defective.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Intellectual Property</h2>
          <p>
            All content on TeeWorld, including logos, designs, images, and text, is the property of TeeWorld and protected by copyright laws. Unauthorized reproduction, distribution, or modification is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Limitation of Liability</h2>
          <p>
            TeeWorld shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the specific order in question.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in West Bengal, India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. Contact</h2>
          <p>
            For any questions regarding these terms, please contact us at business.teeworld@gmail.com or call +91 96093 84607.
          </p>
        </section>
      </div>
    </div>
  );
}
