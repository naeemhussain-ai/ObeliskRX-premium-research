import { Link } from "@/lib/router";

const toc = [
  "Acceptance of Terms",
  "Eligibility",
  "Products and Intended Use",
  "Account Registration",
  "Orders and Payment",
  "Shipping and Delivery",
  "Returns and Refunds",
  "Intellectual Property",
  "Prohibited Conduct",
  "Termination",
  "Affiliate & Referral Program",
  "Assumption of Risk",
  "Disclaimer of Warranties",
  "Limitation of Liability",
  "Indemnification",
  "Dispute Resolution & Arbitration",
  "Governing Law",
  "Changes to These Terms",
  "Severability",
  "Waiver",
  "Entire Agreement",
  "Information You Provide",
  "SMS / Messaging Terms & Conditions",
  "Contact Information",
];

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={`section-${n}`} className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
        {n}. {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
        {children}
      </div>
    </section>
  );
}

function LegalSection({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={`section-${n}`} className="rounded-2xl border border-[#1B3A5C]/20 bg-[#1B3A5C]/5 p-6 shadow-card sm:p-8">
      <h2 className="text-lg font-bold text-[#1B3A5C] sm:text-xl">
        {n}. {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#1B3A5C]/80">
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

export function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            ObeliskRX LLC · ObeliskRX.com · Last Updated: August 11, 2026
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-primary">Home</Link>
            <span>/</span>
            <span className="font-medium text-foreground">Terms of Service</span>
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
                      href={`#section-${i + 1}`}
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
                  Welcome to ObeliskRX. These Terms of Service ("Terms") govern your access to and use of ObeliskRX.com (the "Website") and your purchase of any products from ObeliskRX LLC ("ObeliskRX," "we," "our," or "us"). By accessing the Website or placing an order with us, you agree to be bound by these Terms. If you do not accept them, please do not use the Website or purchase our products.
                </p>
              </div>

              <Section n={1} title="Acceptance of Terms">
                <p>
                  By using the Website, you represent that you are at least 21 years of age and legally able to enter into a binding agreement. If you access the Website on behalf of a company, institution, or other organization, you further represent that you are authorized to bind that entity to these Terms.
                </p>
              </Section>

              <Section n={2} title="Eligibility">
                <p>
                  ObeliskRX products and services are made available only to qualified researchers, laboratory professionals, and organizations engaged in legitimate scientific research. We may accept or decline any customer or order at our sole discretion, and we may ask you to verify your research credentials or institutional affiliation at any time. If satisfactory verification is not provided, we may cancel your order or close your account.
                </p>
              </Section>

              <Section n={3} title="Products and Intended Use">
                <p>
                  Every product offered by ObeliskRX is supplied solely for laboratory research. None of our products or related statements have been evaluated by the U.S. Food and Drug Administration (FDA). By ordering from us, you acknowledge and agree that:
                </p>
                <BulletList items={[
                  "Products are sold exclusively for in-vitro research and laboratory applications;",
                  "Products are not for human or animal consumption and are not for diagnostic or therapeutic use;",
                  "Products are not intended to diagnose, treat, cure, or prevent any disease or condition;",
                  "No information on the Website constitutes medical advice, dosing guidance, or any recommendation for use in humans or animals;",
                  "You will comply with all applicable local, state, and federal laws governing the purchase, possession, and handling of research chemicals; and",
                  "You are a qualified researcher, or are purchasing on behalf of a legitimate research effort.",
                ]} />
              </Section>

              <Section n={4} title="Account Registration">
                <p>
                  You may open an account to place orders and track their status. You are responsible for keeping your login credentials confidential and for all activity that occurs under your account. You agree to provide accurate, current, and complete information and to keep it up to date.
                </p>
              </Section>

              <Section n={5} title="Orders and Payment">
                <p>By submitting an order, you agree that:</p>
                <BulletList items={[
                  "You will pay all applicable charges at the prices in effect when the charge is incurred;",
                  "You authorize us to bill your chosen payment method for the full order amount;",
                  "All orders are subject to our acceptance and to product availability;",
                  "We may decline or cancel any order at our discretion; and",
                  "Prices may change at any time without prior notice.",
                ]} />
              </Section>

              <Section n={6} title="Shipping and Delivery">
                <p>
                  We ship only to destinations within the United States. Any delivery time we quote is an estimate and is not guaranteed. Title and risk of loss transfer to you once the products are handed to the carrier. We are not liable for delays or losses caused by carriers, customs, or other events outside our reasonable control.
                </p>
              </Section>

              <Section n={7} title="Returns and Refunds">
                <p>
                  Our full policy is set out on our{" "}
                  <Link to="/refund-policy" className="font-semibold text-primary underline">
                    Returns &amp; Refunds page
                  </Link>
                  . We provide a one-time replacement only for products that arrive damaged in transit. Every damage claim must include photographic evidence and is subject to our review, and we honor no more than one replacement per customer, per order. Products that have been reconstituted are not eligible for replacement. We do not issue refunds for change of mind, dissatisfaction, or misuse, and we are not responsible for improper storage, handling, or reconstitution after delivery.
                </p>
              </Section>

              <Section n={8} title="Intellectual Property">
                <p>
                  All material on the Website - including text, graphics, logos, product imagery, page layout, and software - is owned by ObeliskRX or its licensors and is protected by copyright, trademark, and other laws. You may not copy, reproduce, distribute, modify, or create derivative works from any part of it without our prior written consent. "ObeliskRX," the ObeliskRX logo, and our related branding are trademarks of ObeliskRX LLC and may not be used without our written permission.
                </p>
              </Section>

              <Section n={9} title="Prohibited Conduct">
                <p>When using the Website or our products, you agree that you will not:</p>
                <BulletList items={[
                  "Use the Website for any unlawful purpose;",
                  "Misrepresent your identity, credentials, or affiliation;",
                  "Interfere with, disrupt, or overload the Website or its servers;",
                  "Attempt to gain unauthorized access to any part of the Website or its systems;",
                  "Use bots, scrapers, or other automated tools to access or harvest the Website;",
                  "Resell or redistribute our products without our written authorization;",
                  "Use any product in a manner inconsistent with its stated research purpose;",
                  "Discuss, promote, encourage, or engage in the dosing of any product in humans or animals, whether on the Website, in communications with us, or through any other channel; or",
                  "Market, label, or represent any ObeliskRX product as fit for human consumption, therapeutic use, or veterinary application.",
                ]} />
                <p className="mt-3 font-semibold text-gray-800">
                  Any breach of this section - and in particular any discussion or practice of human or animal dosing - may result in immediate suspension or closure of your account, cancellation of open orders, and a permanent ban from ObeliskRX, at our sole discretion.
                </p>
              </Section>

              <Section n={10} title="Termination">
                <p>
                  We may suspend or terminate your account and refuse present or future access to the Website at any time and for any reason, at our sole discretion. This includes, without limitation, breach of these Terms, suspected product misuse, failure to supply requested research credentials, or any conduct we determine to be harmful to our business, our customers, or the integrity of our operations. Termination does not release you from any obligation that accrued before termination, including indemnification.
                </p>
              </Section>

              <Section n={11} title="Affiliate & Referral Program">
                <p>ObeliskRX may, from time to time, operate an affiliate or referral program (the "Program") through which approved participants can earn commissions on qualifying orders placed via their referral links. If you take part, you agree that:</p>
                <div className="space-y-3 mt-2">
                  <div>
                    <p className="font-semibold text-gray-800">Eligibility &amp; Commissions:</p>
                    <p>Eligibility, commission rates, qualifying orders, and payout thresholds are set by ObeliskRX at our sole discretion and may be changed or withdrawn at any time without notice.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Payouts:</p>
                    <p>We determine whether and when commissions are paid. Payments may be held, delayed, reduced, or forfeited if we determine, at our discretion, that the Program terms have been breached or that referral activity is fraudulent, misleading, or otherwise contrary to these Terms.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Termination:</p>
                    <p>We may suspend or end your participation at any time, for any reason. On termination, any unpaid commissions may be forfeited.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Your Content:</p>
                    <p>You are solely responsible for all content, advertising, and claims you make in connection with the Program. We neither endorse nor take responsibility for affiliate-created materials, and all such content must comply with these Terms, including the restrictions on health claims, dosing information, and any representation of human or animal use.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Legal Compliance:</p>
                    <p>Affiliates must follow all applicable laws, including FTC disclosure requirements, and must not imply that our products are intended for any purpose other than laboratory research.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Indemnification:</p>
                    <p>You agree to indemnify and hold ObeliskRX harmless from any claim, damage, or liability arising out of your affiliate activities.</p>
                  </div>
                </div>
                <p className="mt-3">We may modify, pause, or discontinue the Program at any time without notice, and your continued participation constitutes acceptance of any changes.</p>
              </Section>

              <LegalSection n={12} title="Assumption of Risk">
                <p>
                  YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT YOUR PURCHASE, POSSESSION, HANDLING, STORAGE, AND USE OF ANY OBELISKRX PRODUCT IS UNDERTAKEN ENTIRELY AT YOUR OWN RISK. OBELISKRX SUPPLIES RESEARCH CHEMICALS INTENDED SOLELY FOR IN-VITRO LABORATORY USE. BY PURCHASING ANY PRODUCT, YOU VOLUNTARILY ASSUME ALL RISKS ASSOCIATED WITH IT, INCLUDING WITHOUT LIMITATION RISKS ARISING FROM IMPROPER STORAGE, HANDLING, CONTAMINATION, DEGRADATION, MISUSE, OR ANY APPLICATION OF THE PRODUCT TO A HUMAN OR ANIMAL. TO THE FULLEST EXTENT PERMITTED BY LAW, YOU WAIVE ANY AND ALL CLAIMS AGAINST OBELISKRX ARISING FROM YOUR USE OR MISUSE OF ANY PRODUCT.
                </p>
              </LegalSection>

              <LegalSection n={13} title="Disclaimer of Warranties">
                <p>
                  THE WEBSITE AND ALL PRODUCTS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, OBELISKRX DISCLAIMS ALL WARRANTIES, INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTY ARISING FROM COURSE OF DEALING OR TRADE USAGE. IN PARTICULAR, WE DO NOT WARRANT THAT: (A) ANY PRODUCT WILL MEET YOUR RESEARCH REQUIREMENTS OR PRODUCE ANY PARTICULAR RESULT; (B) PRODUCT QUALITY, PURITY, OR COMPOSITION WILL REMAIN UNCHANGED AFTER DELIVERY; (C) ANY INFORMATION, DATA, OR SCIENTIFIC REFERENCE ON THE WEBSITE IS COMPLETE, ACCURATE, OR CURRENT; OR (D) THE WEBSITE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. A CERTIFICATE OF ANALYSIS (COA) REFLECTS TESTING RESULTS AS OF THE TIME OF ANALYSIS AND IS NOT A WARRANTY OF FITNESS FOR ANY PARTICULAR USE.
                </p>
              </LegalSection>

              <LegalSection n={14} title="Limitation of Liability">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, OBELISKRX AND ITS OWNERS, OFFICERS, MEMBERS, EMPLOYEES, AGENTS, AND AFFILIATES WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE WEBSITE, YOUR PURCHASE OR USE OF PRODUCTS, OR ANY ACTION TAKEN IN RELIANCE ON WEBSITE CONTENT - INCLUDING WITHOUT LIMITATION DAMAGES FOR PERSONAL INJURY, ILLNESS, DEATH, PROPERTY DAMAGE, LOST PROFITS, LOST DATA, OR BUSINESS INTERRUPTION. OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THESE TERMS WILL NOT EXCEED THE AMOUNT YOU PAID TO OBELISKRX FOR THE SPECIFIC PRODUCT(S) GIVING RISE TO THE CLAIM. THIS LIMITATION APPLIES REGARDLESS OF THE LEGAL THEORY ASSERTED (CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE) AND EVEN IF OBELISKRX HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
              </LegalSection>

              <Section n={15} title="Indemnification">
                <p>You agree to indemnify, defend, and hold harmless ObeliskRX and its owners, officers, members, employees, agents, and affiliates (the "Indemnified Parties") from and against any and all claims, demands, actions, damages, losses, liabilities, judgments, settlements, fines, penalties, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:</p>
                <BulletList items={[
                  "Your use, misuse, or handling of any ObeliskRX product, including any personal injury, illness, death, or property damage resulting from administering, injecting, ingesting, or otherwise applying a product to any human or animal;",
                  "Any statement, claim, or representation you make to any third party about our products, including any health, weight-loss, or therapeutic claim, or any dosing or usage instruction for humans or animals;",
                  "Any advertising, marketing, social-media content, review, testimonial, or promotional material you create or distribute that references our products, whether as a customer, affiliate, or in any other capacity;",
                  "Any breach of these Terms, including the prohibited conduct described in Section 9;",
                  "Any violation of applicable law or third-party rights in connection with your purchase, possession, use, or distribution of products; or",
                  "Any regulatory action, investigation, or enforcement proceeding brought against ObeliskRX as a result of your actions, statements, or product use.",
                ]} />
                <p className="mt-3">This obligation survives termination of your account and these Terms. We may assume the exclusive defense and control of any matter subject to indemnification, at your expense, and you agree not to settle any such matter without our prior written consent.</p>
              </Section>

              {/* Arbitration - special styling */}
              <section id="section-16" className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-card sm:p-8">
                <h2 className="text-lg font-bold text-amber-900 sm:text-xl">16. Dispute Resolution &amp; Arbitration</h2>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-amber-700">Please read this section carefully - it affects your legal rights.</p>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-amber-900/85">
                  <div>
                    <p className="font-semibold text-amber-900">Binding Arbitration:</p>
                    <p>Any dispute, claim, or controversy arising out of or relating to these Terms, your use of the Website, or any product purchased from ObeliskRX will be resolved exclusively by final and binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules, before a single arbitrator seated in Palm Beach County, Florida.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">Class Action Waiver:</p>
                    <p>YOU AGREE THAT ALL PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT AS A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION, AND YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION OR CLASS-WIDE ARBITRATION AGAINST OBELISKRX.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">Small Claims Exception:</p>
                    <p>Either party may still bring an individual claim in small claims court if the claim qualifies for that court's jurisdiction.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">Injunctive Relief:</p>
                    <p>Nothing in this section prevents ObeliskRX from seeking injunctive or other equitable relief in any court of competent jurisdiction to protect its intellectual property or to prevent irreparable harm.</p>
                  </div>
                  <p className="font-semibold text-amber-950">By accepting these Terms, you acknowledge that you are giving up your right to a trial by jury and your right to participate in a class action.</p>
                </div>
              </section>

              <Section n={17} title="Governing Law">
                <p>
                  These Terms are governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict-of-laws principles. To the extent any dispute is not subject to arbitration, it will be brought exclusively in the state or federal courts located in Palm Beach County, Florida, and you consent to the personal jurisdiction of those courts.
                </p>
              </Section>

              <Section n={18} title="Changes to These Terms">
                <p>
                  We may modify these Terms at any time. Changes take effect when posted to the Website, and your continued use of the Website afterward constitutes acceptance of the revised Terms. You are responsible for reviewing these Terms periodically for updates.
                </p>
              </Section>

              <Section n={19} title="Severability">
                <p>
                  If any provision of these Terms is held invalid, illegal, or unenforceable by a court of competent jurisdiction, that finding will not affect the remaining provisions, which will continue in full force and effect.
                </p>
              </Section>

              <Section n={20} title="Waiver">
                <p>
                  Our failure to enforce any right or provision of these Terms does not waive that right or provision. Any waiver is effective only if made in writing and signed by ObeliskRX, and no single or partial exercise of any right or remedy precludes any further exercise of it or of any other right or remedy.
                </p>
              </Section>

              <Section n={21} title="Entire Agreement">
                <p>
                  These Terms, together with our{" "}
                  <Link to="/privacy-policy" className="font-semibold text-primary underline">Privacy Policy</Link>,
                  any disclaimer, our{" "}
                  <Link to="/refund-policy" className="font-semibold text-primary underline">Returns &amp; Refunds policy</Link>,
                  and any other policies referenced here, constitute the entire agreement between you and ObeliskRX regarding your use of the Website and your purchase of products, and supersede all prior or contemporaneous communications, whether oral or written. No statement or promise made by any ObeliskRX employee, agent, or representative - through customer support, email, social media, or any other channel - modifies these Terms unless set out in a written amendment signed by an authorized officer of ObeliskRX.
                </p>
              </Section>

              <Section n={22} title="Information You Provide; Our Rights to Use, Share, and Transfer">
                <p>By creating an account, placing an order, subscribing to communications, or otherwise interacting with the Website, you provide information about yourself and your activity (collectively, "Your Information"). Your Information may include identifiers (such as name, email address, mailing address, and phone number), order and purchase history, payment metadata, device and browsing data, IP address, location data, your communications with us, affiliate referral data, and inferences drawn from any of the foregoing.</p>
                <p>You grant ObeliskRX a perpetual, irrevocable, worldwide, royalty-free, fully paid-up, sublicensable, and transferable license to collect, store, use, process, analyze, combine, disclose, share, transfer, and otherwise handle Your Information for any lawful purpose, including without limitation:</p>
                <BulletList items={[
                  "Operating, securing, improving, and personalizing the Website, products, and services;",
                  "Fulfilling orders, processing payments, providing customer support, and meeting our legal obligations;",
                  "Sending you transactional, account, service, and - where you have consented - marketing communications about ObeliskRX products and services;",
                  "Creating aggregated, de-identified, or anonymized data sets, which ObeliskRX owns and may use without restriction;",
                  "Conducting research, analytics, forecasting, segmentation, fraud prevention, and risk-scoring; and",
                  "Transferring or assigning Your Information, along with your rights and obligations under these Terms, to any successor or acquirer in connection with a merger, acquisition, reorganization, sale of assets, financing, or similar transaction.",
                ]} />
                <p>You may opt out of marketing communications at any time using the unsubscribe link in any marketing email or by replying STOP to any marketing text message; transactional and service messages will continue. The licenses and consents in this Section survive termination of your account and these Terms.</p>
              </Section>

              <Section n={23} title="SMS / Messaging Terms & Conditions">
                <p className="text-xs text-muted-foreground italic">This Section applies only if you opt in to receive text messages from ObeliskRX.</p>
                <div className="mt-3 rounded-xl border border-border bg-surface p-4 text-xs text-gray-600">
                  <p className="font-bold text-gray-800">ObeliskRX LLC</p>
                  <p>1489 W. Palmetto Park Rd., Suite 500, Boca Raton, FL 33486, USA</p>
                  <p>Email: <a href="mailto:Contact@ObeliskRX.com" className="text-primary underline">Contact@ObeliskRX.com</a></p>
                </div>
                <div className="space-y-3 mt-3">
                  <div>
                    <p className="font-semibold text-gray-800">General:</p>
                    <p>When you opt in, we will send a message confirming your signup. By opting in, you consent to receive recurring automated marketing and informational text messages from ObeliskRX. Message frequency varies. Message and data rates may apply. Your carrier is not liable for delayed or undelivered messages. Consent to receive marketing messages is not a condition of purchase.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Cancellation:</p>
                    <p>Reply STOP to unsubscribe. After you unsubscribe, we will send one confirmation message and then stop. To resume messages, simply opt in again.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Help:</p>
                    <p>For support, email <a href="mailto:Contact@ObeliskRX.com" className="text-primary underline">Contact@ObeliskRX.com</a>, or reply HELP where supported.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Transfer of Number:</p>
                    <p>Before changing or transferring your mobile number, reply STOP from the original number or notify us at Contact@ObeliskRX.com.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Changes:</p>
                    <p>We may change or end our messaging program at any time, effective upon posting. Continued enrollment constitutes acceptance.</p>
                  </div>
                </div>
              </Section>

              {/* Contact */}
              <section id="section-24" className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-card sm:p-8 text-center">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">24. Contact Information</h2>
                <p className="mt-2 text-sm text-gray-600">For questions about these Terms, please contact us:</p>
                <div className="mt-4 inline-block rounded-xl bg-white p-5 shadow-sm border border-gray-200 text-left">
                  <p className="font-bold text-gray-900">ObeliskRX LLC</p>
                  <p className="mt-1 text-sm text-gray-600">1489 W. Palmetto Park Rd., Suite 500</p>
                  <p className="text-sm text-gray-600">Boca Raton, FL 33486, USA</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Email:{" "}
                    <a href="mailto:Contact@ObeliskRX.com" className="font-semibold text-primary underline">
                      Contact@ObeliskRX.com
                    </a>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Business Hours: Monday – Friday, 9:00 AM – 5:00 PM EST</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
