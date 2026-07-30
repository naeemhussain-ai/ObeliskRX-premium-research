import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Hero Header */}
      <div className="relative overflow-hidden border-b border-border bg-surface py-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/6 blur-[80px]" />
        </div>
        <div className="container-page relative z-10 text-center">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[11px] font-bold tracking-widest text-primary uppercase">
            Store Policies
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Returns, Refunds & Damage Protection Policy
          </h1>
          {/* Breadcrumb */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">
              Returns, Refunds & Damage Protection Policy
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-page py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* 1. All Sales Are Final */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              1. All Sales Are Final
            </h2>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-primary">
              All sales through ObeliskRX LLC are final. We do not accept returns, exchanges,
              cancellations, or refunds once an order has been placed and payment submitted.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Because research compounds cannot be re-certified, restocked, or safely
              redistributed once they’ve left our facility, returned merchandise cannot be accepted
              under normal circumstances. This applies to, without limitation:
            </p>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 text-xs font-medium text-gray-700">
              {[
                "Change of mind",
                "Ordering the wrong item or quantity",
                "Dissatisfaction with research outcomes",
                "Improper handling or storage after delivery",
                "Carrier shipping delays",
                "Failure to review product descriptions or disclaimers",
                "Packages marked “Delivered” by the carrier",
                "Buyer misunderstanding of product-use classification",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                  <span className="size-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2. How Replacement Claims Work */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              2. How Replacement Claims Work
            </h2>

            {/* 3 Steps Process */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-surface p-5">
                <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  Step 1
                </span>
                <h3 className="mt-3 text-sm font-bold text-gray-900">Document the issue</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Photograph the damaged product and packaging as soon as it arrives. Photo evidence is required for every damage claim.
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-surface p-5">
                <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  Step 2
                </span>
                <h3 className="mt-3 text-sm font-bold text-gray-900">Contact us</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Email{" "}
                  <a href="mailto:Contact@ObeliskRX.com" className="font-semibold text-primary underline">
                    Contact@ObeliskRX.com
                  </a>{" "}
                  with your order number and photos. We respond within 24 hours.
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-surface p-5">
                <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  Step 3
                </span>
                <h3 className="mt-3 text-sm font-bold text-gray-900">Receive replacement</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Once damage is verified, we’ll ship a one-time replacement at no cost. All claims are subject to review.
                </p>
              </div>
            </div>

            {/* Eligibility Lists */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  Eligible for replacement:
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-emerald-800">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1 rounded-full bg-emerald-600 shrink-0" />
                    Products damaged in transit (photo evidence required)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1 rounded-full bg-emerald-600 shrink-0" />
                    Defective products that fail to meet purity standards
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1 rounded-full bg-emerald-600 shrink-0" />
                    Incorrect items shipped
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-rose-900">
                  <XCircle size={18} className="text-rose-600 shrink-0" />
                  Not eligible for replacement:
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-rose-800">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1 rounded-full bg-rose-600 shrink-0" />
                    Reconstituted products
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1 rounded-full bg-rose-600 shrink-0" />
                    Damage claims without photo evidence
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1 rounded-full bg-rose-600 shrink-0" />
                    Products improperly stored after delivery
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1 rounded-full bg-rose-600 shrink-0" />
                    Products without proof of purchase
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Important Disclaimer */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-amber-900 sm:text-2xl">
              <ShieldAlert size={22} className="text-amber-600 shrink-0" />
              3. Important Disclaimer
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-amber-900/90">
              <p>
                All products are sold strictly for laboratory and research use. ObeliskRX LLC is not
                responsible for misuse, improper storage, or reconstitution of any product.
              </p>
              <p>
                Replacements are issued solely for verified transit damage — not for change of
                mind, dissatisfaction, or any other reason.
              </p>
              <p>
                Excessive or suspicious claims may result in account review and denial of future
                replacement requests. ObeliskRX LLC reserves the right to deny any replacement
                request at its sole discretion.
              </p>
              <p className="font-semibold text-amber-950">
                Placing an order constitutes acknowledgment and acceptance of this policy.
              </p>
            </div>
          </section>

          {/* 4. No Returns of Opened or Tampered Products */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              4. No Returns of Opened or Tampered Products
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              For safety, contamination-prevention, and product-integrity reasons, ObeliskRX LLC
              will never accept returns of any product that has been opened, reconstituted,
              punctured, unsealed, tampered with, improperly stored, or otherwise mishandled after
              delivery. Any sign of tampering or misuse automatically voids eligibility for
              replacement.
            </p>
          </section>

          {/* 5. Shipping & Delivery Liability */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              5. Shipping & Delivery Liability
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Once an order is transferred to the shipping carrier, the carrier assumes
              responsibility for transit and delivery. ObeliskRX LLC is not responsible for:
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-xs font-medium text-gray-700">
              {[
                "Carrier delays",
                "Customs delays or seizures",
                "Lost or stolen packages after delivery confirmation",
                "Incorrect shipping addresses entered by the customer",
                "Carrier error",
                "Weather-related disruptions",
                "International import restrictions",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                  <span className="size-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-medium text-gray-500">
              Customers are responsible for confirming shipping information is accurate before submitting payment.
            </p>
          </section>

          {/* 6. Order Cancellations */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              6. Order Cancellations
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Orders cannot be canceled once payment has processed. If an order hasn’t yet entered
              fulfillment, ObeliskRX LLC may attempt to accommodate a cancellation request as a
              courtesy, at its sole discretion — cancellation is never guaranteed.
            </p>
          </section>

          {/* 7. Chargebacks & Payment Disputes */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              7. Chargebacks & Payment Disputes
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                By completing a purchase, you agree not to initiate fraudulent or unwarranted
                chargebacks or payment disputes. ObeliskRX LLC reserves the right to contest any
                chargeback using order confirmations, tracking records, delivery confirmation,
                customer communications, IP logs, fraud-prevention data, and evidence of policy
                acceptance.
              </p>
              <p className="font-semibold text-gray-900">
                Fraudulent disputes may result in permanent account bans, refusal of future service,
                reporting to fraud-prevention databases, and collection action where permitted by
                law.
              </p>
            </div>
          </section>

          {/* 8. Limitation of Liability */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              8. Limitation of Liability
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                Under no circumstances shall ObeliskRX LLC, its owners, employees, affiliates,
                suppliers, or agents be liable for indirect, incidental, special, consequential, or
                punitive damages arising from use or misuse of products, improper handling or
                storage, research outcomes, shipping delays, delivery failures, third-party carrier
                issues, or regulatory action.
              </p>
              <p className="font-semibold text-gray-900">
                All products are used entirely at the purchaser’s own risk and responsibility.
              </p>
            </div>
          </section>

          {/* 9. Policy Modifications */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              9. Policy Modifications
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              ObeliskRX LLC reserves the right to modify, update, or change this policy at any time
              without prior notice. The version posted on the website at the time of purchase
              governs the transaction.
            </p>
          </section>

          {/* 10. Contact Information */}
          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-card sm:p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              10. Contact Information
            </h2>
            <p className="mt-2 text-sm text-gray-600">For order-related support:</p>
            <div className="mt-4 inline-block rounded-xl bg-white p-4 shadow-sm border border-gray-200 text-left">
              <p className="font-bold text-gray-900">ObeliskRX LLC</p>
              <p className="mt-1 text-sm text-gray-600">
                Email:{" "}
                <a href="mailto:Contact@ObeliskRX.com" className="font-semibold text-primary underline">
                  Contact@ObeliskRX.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
