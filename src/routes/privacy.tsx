import { Link } from "@/lib/router";

const toc = [
  "Information We Collect",
  "How We Use Your Information",
  "Information Sharing",
  "Data Security",
  "Cookies and Tracking",
  "Your Rights",
  "Your State Privacy Rights",
  "Age Restriction & Children's Privacy",
  "Third-Party Links",
  "Changes to This Policy",
  "Contact Us",
];

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={`pp-${n}`} className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
        {n}. {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5 pl-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border bg-surface py-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/6 blur-[80px]" />
        </div>
        <div className="container-page relative z-10 text-center">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[11px] font-bold tracking-widest text-primary uppercase">
            Legal
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            ObeliskRX LLC · ObeliskRX.com · Last Updated: August 11, 2026
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-primary">Home</Link>
            <span>/</span>
            <span className="font-medium text-foreground">Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="container-page py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-10 items-start">

            {/* Table of Contents - sticky sidebar */}
            <aside className="hidden xl:block w-64 shrink-0 sticky top-24">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Contents</p>
                <nav className="space-y-1">
                  {toc.map((title, i) => (
                    <a
                      key={i}
                      href={`#pp-${i + 1}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      <span className="w-5 shrink-0 font-bold text-[10px] text-primary/60">{i + 1}.</span>
                      {title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Sections */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Intro */}
              <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
                <p className="text-sm leading-relaxed text-gray-600">
                  At ObeliskRX LLC ("ObeliskRX," "we," "our," or "us"), we are committed to protecting your privacy. ObeliskRX supplies research-use-only compounds to researchers and qualified purchasers through our website, ObeliskRX.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
                </p>
              </div>

              <Section n={1} title="Information We Collect">
                <p className="font-semibold text-gray-800">Information you provide directly to us, including:</p>
                <BulletList items={[
                  "Contact Information: Name, email address, phone number, and shipping and billing addresses",
                  "Payment Information: Billing details and card information, processed securely through our third-party payment providers. We do not store full payment card numbers on our own servers.",
                  "Order Information: Products purchased, order history, and transaction details",
                  "Communication Data: Messages, emails, and support requests you send us",
                  "Account Information: Username and password if you create an account",
                  "Age-Verification Information: Confirmation that you are 21 years of age or older, and any related verification information you provide when you enter our website or place an order",
                ]} />
                <p className="mt-4 font-semibold text-gray-800">Automatically Collected Information</p>
                <p>When you visit our website, we automatically collect:</p>
                <BulletList items={[
                  "IP address and browser type",
                  "Device information and operating system",
                  "Pages viewed and time spent on our site",
                  "Referring website and exit pages",
                  "Cookies and similar tracking technologies",
                ]} />
              </Section>

              <Section n={2} title="How We Use Your Information">
                <p>We use the information we collect to:</p>
                <BulletList items={[
                  "Process and fulfill your orders",
                  "Verify eligibility to purchase, including age (21+) and acknowledgment that products are for research use only",
                  "Communicate with you about your orders and our products",
                  "Send promotional emails, where you have consented to receive them",
                  "Improve our website and customer experience",
                  "Prevent fraud and enhance security",
                  "Comply with legal obligations",
                  "Respond to your questions and support requests",
                ]} />
              </Section>

              <Section n={3} title="Information Sharing">
                <p>We do not sell your personal information in exchange for money. We may share your information with:</p>
                <BulletList items={[
                  "Service Providers: Payment processors, shipping carriers, email, hosting, and analytics providers who help us operate our business and are contractually required to protect your information",
                  "Advertising & Analytics Partners: We may share online identifiers (such as cookie data) with analytics and advertising partners to measure and improve our marketing. Depending on your state of residence, this activity may be considered 'sharing' or a 'sale' of personal information, and you may opt out as described in Section 6",
                  "Legal Requirements: When required by law, subpoena, or legal process, or to protect our rights, safety, or property",
                  "Business Transfers: In connection with a merger, acquisition, financing, or sale of assets",
                ]} />
              </Section>

              <Section n={4} title="Data Security">
                <p>We implement appropriate technical and organizational measures to protect your personal information, including:</p>
                <BulletList items={[
                  "SSL/TLS encryption for all data transmission",
                  "Secure payment processing through PCI-compliant providers",
                  "Regular security monitoring",
                  "Limited access to personal information by authorized personnel",
                  "Secure data storage with encryption at rest",
                ]} />
                <p className="mt-2">No method of transmission over the internet or method of electronic storage is completely secure, and while we strive to protect your personal information, we cannot guarantee absolute security.</p>
              </Section>

              <Section n={5} title="Cookies and Tracking">
                <p>We use cookies and similar technologies to:</p>
                <BulletList items={[
                  "Remember your preferences and cart contents",
                  "Analyze website traffic and usage patterns",
                  "Personalize your experience",
                  "Measure and deliver relevant advertising",
                ]} />
                <p className="mt-2">You can control cookies through your browser settings. Disabling cookies may affect your ability to use certain features of our website.</p>
              </Section>

              <section id="pp-6" className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-card sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">6. Your Rights</h2>
                <p className="mt-4 text-sm text-gray-600">Subject to your location and applicable law, you have the right to:</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: "📋", right: "Access", desc: "The personal information we hold about you" },
                    { icon: "✏️", right: "Correct", desc: "Request correction of inaccurate information" },
                    { icon: "🗑️", right: "Delete", desc: "Request deletion of your personal information" },
                    { icon: "📧", right: "Opt Out", desc: "Of marketing communications at any time" },
                    { icon: "🚫", right: "Restrict Sharing", desc: "Opt out of the sale or sharing of your personal information for targeted advertising" },
                    { icon: "💾", right: "Data Portability", desc: "Request a copy of your data in a portable format" },
                  ].map(({ icon, right, desc }) => (
                    <div key={right} className="flex items-start gap-3 rounded-xl bg-white p-3 border border-gray-100">
                      <span className="text-lg">{icon}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{right}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  To exercise any of these rights, contact us at{" "}
                  <a href="mailto:Contact@ObeliskRX.com" className="font-semibold text-primary underline">
                    Contact@ObeliskRX.com
                  </a>
                  . We may need to verify your identity before completing your request.
                </p>
              </section>

              <Section n={7} title="Your State Privacy Rights">
                <p>
                  Depending on your state of residence, you may have additional privacy rights under state law. This includes California residents under the California Consumer Privacy Act, as amended by the California Privacy Rights Act (CCPA/CPRA), as well as residents of Virginia, Colorado, Connecticut, and a growing number of other U.S. states with comprehensive privacy laws.
                </p>
                <p>These rights may include the right to know what personal information we collect and how it is used, the right to access and correct your information, the right to delete your information, the right to a portable copy of your data, and the right to opt out of targeted advertising or the sale or sharing of your personal information.</p>
                <p>We do not sell personal information for monetary consideration, and we will not discriminate against you for exercising any of these rights.</p>
                <p>
                  To submit a request, contact us at{" "}
                  <a href="mailto:Contact@ObeliskRX.com" className="font-semibold text-primary underline">
                    Contact@ObeliskRX.com
                  </a>
                  .
                </p>
              </Section>

              <Section n={8} title="Age Restriction & Children's Privacy">
                <p>
                  Our website and products are intended solely for researchers and purchasers who are 21 years of age or older. Our website is not intended for, and we do not knowingly collect personal information from, anyone under 21 years of age. If we learn that we have collected information from a person under 21, we will promptly delete it.
                </p>
              </Section>

              <Section n={9} title="Third-Party Links">
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these sites. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </Section>

              <Section n={10} title="Changes to This Policy">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our website after changes constitutes acceptance of the updated policy.
                </p>
              </Section>

              {/* Contact */}
              <section id="pp-11" className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-card sm:p-8 text-center">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">11. Contact Us</h2>
                <p className="mt-2 text-sm text-gray-600">If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
                <div className="mt-4 inline-block rounded-xl bg-white p-5 shadow-sm border border-gray-200 text-left">
                  <p className="font-bold text-gray-900">ObeliskRX LLC</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Website:{" "}
                    <span className="font-semibold text-primary">ObeliskRX.com</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Email:{" "}
                    <a href="mailto:Contact@ObeliskRX.com" className="font-semibold text-primary underline">
                      Contact@ObeliskRX.com
                    </a>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Business Hours: Monday – Friday, 9:00 AM – 5:00 PM EST</p>
                  <p className="mt-1 text-sm text-gray-600">1489 W. Palmetto Park Rd., Suite 500, Boca Raton, FL 33486, USA</p>
                </div>
              </section>

              {/* Related links */}
              <div className="rounded-2xl border border-border bg-white p-6 text-center">
                <p className="text-sm font-semibold text-gray-700">Related Policies</p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm">
                  <Link to="/terms" className="text-primary underline hover:opacity-80">Terms of Service</Link>
                  <span className="text-gray-300">·</span>
                  <Link to="/refund-policy" className="text-primary underline hover:opacity-80">Returns & Refunds</Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
