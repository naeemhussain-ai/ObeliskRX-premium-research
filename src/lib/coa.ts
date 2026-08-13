import coaRt20Page1 from "@/assets/certificates/COART20_page-1.jpg";
import coaRt20Page2 from "@/assets/certificates/COART20_page-2.jpg";
import coaNad1000 from "@/assets/certificates/COANAD1000.jpg";

export type CoaEntry = {
  purity: string;
  lot: string;
  tested: string;
  images: string[];
};

export const coaData: Record<string, CoaEntry> = {
  "3r-peptide": { purity: "99.93%", lot: "RT20", tested: "Jul 30, 2026", images: [coaRt20Page1, coaRt20Page2] },
  nad: { purity: "99.86%", lot: "01", tested: "Jun 30, 2026", images: [coaNad1000] },
};

export const getCoa = (slug: string) => coaData[slug];
