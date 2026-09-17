import qrImg from "@/assets/payment-qr.png";

export function PaymentInstructions() {
  return (
    <div className="rounded-2xl border border-border bg-card p-2 shadow-card sm:p-3">
      <img src={qrImg} alt="ObeliskRX Payment Options - Zelle and Cash App QR codes" className="w-full rounded-xl" />
    </div>
  );
}
