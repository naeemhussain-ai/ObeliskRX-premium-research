import zelleImg from "@/assets/payment-zelle.png";
import cashappImg from "@/assets/payment-cashapp.png";

export function PaymentInstructions() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-black text-foreground">Payment Options</h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Fast &middot; Secure &middot; Simple
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <img src={zelleImg} alt="Pay with Zelle" className="w-full rounded-xl border border-border shadow-sm" />
        <img src={cashappImg} alt="Pay with Cash App" className="w-full rounded-xl border border-border shadow-sm" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground">Important Instructions</p>
        <p className="mt-2 text-sm text-muted-foreground">When sending funds, please only include:</p>
        <p className="mt-2 rounded-lg bg-primary-soft px-4 py-2 text-center text-sm font-bold text-[#0B1F3A]">
          Order Number and Full Name
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Do not include any additional information. Orders with extra notes will be rejected.
        </p>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Questions or concerns? Call or text ObeliskRX at{" "}
        <a href="tel:+15615718899" className="font-semibold text-primary hover:underline">
          561-571-8899
        </a>
      </p>
    </div>
  );
}
