import { useState } from "react";
import { ArrowRight } from "lucide-react";
import logoImg from "@/assets/obeliskrx-logo.png";
import { Checkbox } from "@/components/ui/checkbox";

export const AGE_GATE_KEY = "obeliskrx-age-verified";

export function isAgeVerified(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(AGE_GATE_KEY) === "1";
  } catch {
    return false;
  }
}

export function AgeGate({ onVerified }: { onVerified: () => void }) {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [researcherConfirmed, setResearcherConfirmed] = useState(false);
  const [error, setError] = useState(false);

  function handleEnter() {
    if (!ageConfirmed) {
      setError(true);
      return;
    }
    try {
      window.localStorage.setItem(AGE_GATE_KEY, "1");
    } catch {
      // localStorage unavailable - proceed for this visit anyway
    }
    onVerified();
  }

  function handleExit() {
    window.location.href = "https://www.google.com";
  }

  return (
    <div className="fixed inset-0 z-[999999] flex min-h-screen w-full flex-col items-center justify-center overflow-y-auto bg-surface px-4 py-12">
      <img src={logoImg} alt="ObeliskRX" className="mb-8 h-16 w-auto sm:h-20" />

      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Age &amp; Researcher Verification</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          ObeliskRX sells research peptides exclusively to qualified researchers and laboratories for
          in-vitro and laboratory use. Please confirm before continuing.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/50">
            <Checkbox
              checked={ageConfirmed}
              onCheckedChange={(checked) => {
                setAgeConfirmed(checked === true);
                if (checked === true) setError(false);
              }}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground">
              I am at least <span className="font-semibold">21 years of age</span>.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/50">
            <Checkbox
              checked={researcherConfirmed}
              onCheckedChange={(checked) => setResearcherConfirmed(checked === true)}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground">
              I confirm I am a <span className="font-semibold">qualified researcher</span> purchasing for{" "}
              <span className="font-semibold">in vitro / laboratory research</span> only - not for human or
              veterinary use.
            </span>
          </label>
        </div>

        {error && (
          <p className="mt-3 text-xs font-medium text-red-600">
            Please confirm you are at least 21 years of age to continue.
          </p>
        )}

        <button
          type="button"
          onClick={handleEnter}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0B1F3A]/90"
        >
          Enter ObeliskRX
          <ArrowRight size={16} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleExit}
        className="mt-6 text-sm font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
      >
        Not a qualified researcher? Exit
      </button>
    </div>
  );
}
