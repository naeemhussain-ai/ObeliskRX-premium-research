import p2t from "@/assets/products/2T-Peptide-20mg-Metabolic $130.00.jpg";
import p3r from "@/assets/products/3R-Peptide-10mg-Metabolic $70.00 - $130.00 (2).jpg";
import bpc from "@/assets/products/BPC-157-10mg-Recovery $99.00.jpg";
import cjc from "@/assets/products/CJC-1295NO-DAC-5mg-Growth $49.99.jpg";
import epi from "@/assets/products/Epithalon-50mg-Longevity $149.99.jpg";
import ghk from "@/assets/products/GHK-Cu-50mg-Longevity $49.99.jpg";
import igf from "@/assets/products/IGF-LR3-1mg-Metabolic $69.00.jpg";
import ipa from "@/assets/products/Ipamorelin-5mg-Metabolic $56.00.jpg";
import klow from "@/assets/products/KLOW Blends-80mg-Signature blends $100.99.jpg";
import mots from "@/assets/products/MOTSC-20mg-Growth $80.99.jpg";
import nad from "@/assets/products/NAD-500mg-longevity $69.99 - $100.00.jpg";
import selank from "@/assets/products/Selank-10mg-Neuro $29.99 - $59.99.jpg";
import semax from "@/assets/products/Semax-10mg-Neuro $29.99.jpg";
import tb500 from "@/assets/products/TB-500-10mg-Recovery $49.99.jpg";
import tesa from "@/assets/products/Tesamorelin-10mg-Growth $69.99.jpg";

export type Product = {
  slug: string;
  name: string;
  series: string;
  image: string;
  price: number;
  priceMax?: number;
  oldPrice?: number;
  discount: number;
  sizes: string[];
  description: string;
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    slug: "2t-peptide",
    name: "2(T) Peptide",
    series: "Metabolic Series",
    image: p2t,
    price: 130,
    oldPrice: 199.99,
    discount: 35,
    sizes: ["20mg"],
    description:
      "A 39-amino-acid synthetic peptide functioning as a dual agonist at the GIP and GLP-1 receptors, studied for its role in glycemic and metabolic research.",
    specs: [
      { label: "CAS Number", value: "2023788-19-2" },
      { label: "Molecular Formula", value: "C225H348N48O68" },
      { label: "Molecular Weight", value: "4,813.45 g/mol" },
      { label: "Amino Acids", value: "39" },
    ],
  },
  {
    slug: "3r-peptide",
    name: "3(R) Peptide",
    series: "Metabolic Series",
    image: p3r,
    price: 70,
    priceMax: 130,
    discount: 35,
    sizes: ["10mg", "20mg"],
    description:
      "A 39 amino acid synthetic peptide engineered as a triple agonist at the GIP, GLP-1, and glucagon receptors, studied for its role in metabolic and glucose-regulation research.",
    specs: [
      { label: "CAS Number", value: "2381089-83-2" },
      { label: "Molecular Formula", value: "C221H342N46O68" },
      { label: "Molecular Weight", value: "4,731.33 g/mol" },
      { label: "Amino Acids", value: "39" },
    ],
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    series: "Recovery Series",
    image: bpc,
    price: 99,
    oldPrice: 122.99,
    discount: 20,
    sizes: ["10mg"],
    description:
      "A 15-amino-acid synthetic peptide fragment studied in laboratory models for its role in angiogenesis, tissue signaling, and cellular repair processes.",
    specs: [
      { label: "CAS Number", value: "137525-51-0" },
      { label: "Amino Acids", value: "15" },
      { label: "Type", value: "Synthetic pentadecapeptide" },
    ],
  },
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 No DAC",
    series: "Growth Series",
    image: cjc,
    price: 49.99,
    oldPrice: 76.99,
    discount: 35,
    sizes: ["5mg"],
    description:
      "A 29-amino-acid synthetic analog of growth hormone-releasing hormone (Mod GRF 1-29), studied for its role in growth hormone signaling research.",
    specs: [
      { label: "Molecular Formula", value: "C152H252N44O42" },
      { label: "Molecular Weight", value: "~3,367 g/mol" },
      { label: "Amino Acids", value: "29" },
    ],
  },
  {
    slug: "epithalon",
    name: "Epithalon",
    series: "Longevity Series",
    image: epi,
    price: 149.99,
    oldPrice: 230.99,
    discount: 35,
    sizes: ["50mg"],
    description:
      "A synthetic tetrapeptide modeled on the amino acid composition of epithalamin, studied for its role in telomerase activity and cellular aging research.",
    specs: [
      { label: "CAS Number", value: "307297-39-8" },
      { label: "Sequence", value: "Ala-Glu-Asp-Gly" },
      { label: "Molecular Formula", value: "C14H22N4O9" },
      { label: "Molecular Weight", value: "390.34 g/mol" },
    ],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    series: "Longevity Series",
    image: ghk,
    price: 49.99,
    oldPrice: 76.99,
    discount: 35,
    sizes: ["50mg"],
    description:
      "A naturally occurring copper-binding tripeptide, studied in laboratory research for its role in collagen synthesis, tissue remodeling, and cellular signaling.",
    specs: [
      { label: "CAS Number", value: "89030-95-5 (copper complex)" },
      { label: "Sequence", value: "Gly-His-Lys" },
      { label: "Molecular Weight", value: "340.38 g/mol (tripeptide)" },
    ],
  },
  {
    slug: "igf-lr3",
    name: "IGF-LR3",
    series: "Metabolic Series",
    image: igf,
    price: 69,
    oldPrice: 107.99,
    discount: 36,
    sizes: ["1mg"],
    description: "",
    specs: [],
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    series: "Metabolic Series",
    image: ipa,
    price: 56,
    oldPrice: 85.99,
    discount: 35,
    sizes: ["5mg"],
    description: "",
    specs: [],
  },
  {
    slug: "klow-blend",
    name: "KLOW Blend",
    series: "Signature Blends",
    image: klow,
    price: 100.99,
    oldPrice: 153.99,
    discount: 34,
    sizes: ["80mg"],
    description:
      "A four-compound research formulation combining GHK-Cu (50mg), BPC-157 (10mg), TB-500 (10mg), and KPV (10mg), supplied for laboratory studies examining tissue repair, cellular signaling, and regenerative research pathways.",
    specs: [
      { label: "Composition", value: "GHK-Cu (CAS 89030-95-5) + BPC-157 (CAS 137525-51-0) + TB-500 (CAS 77591-33-4) + KPV (CAS 75435-82-2)" },
      { label: "Total", value: "80mg" },
    ],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    series: "Growth Series",
    image: mots,
    price: 80.99,
    oldPrice: 122.99,
    discount: 34,
    sizes: ["20mg"],
    description:
      "A 16-amino-acid mitochondrial-derived peptide, studied in laboratory research for its role in cellular energy regulation and metabolic signaling.",
    specs: [
      { label: "Molecular Formula", value: "C101H152N28O22S2" },
      { label: "Molecular Weight", value: "2,174.64 g/mol" },
      { label: "Amino Acids", value: "16" },
    ],
  },
  {
    slug: "nad",
    name: "NAD+",
    series: "Longevity Series",
    image: nad,
    price: 69.99,
    priceMax: 100,
    discount: 35,
    sizes: ["500mg", "1000mg"],
    description:
      "A naturally occurring coenzyme central to cellular energy metabolism and redox reactions, studied in laboratory research for its role in mitochondrial function and cellular aging pathways. Available in 500mg and 1000mg.",
    specs: [
      { label: "CAS Number", value: "53-84-9" },
      { label: "Molecular Formula", value: "C21H27N7O14P2" },
      { label: "Molecular Weight", value: "663.43 g/mol" },
    ],
  },
  {
    slug: "selank",
    name: "Selank",
    series: "Neuro Series",
    image: selank,
    price: 29.99,
    priceMax: 59.99,
    discount: 35,
    sizes: ["10mg", "20mg"],
    description:
      "A synthetic heptapeptide analog of tuftsin, studied in laboratory research for its role in neurochemical and behavioral signaling pathways.",
    specs: [
      { label: "CAS Number", value: "129954-34-3" },
      { label: "Sequence", value: "Thr-Lys-Pro-Arg-Pro-Gly-Pro" },
      { label: "Molecular Formula", value: "C33H57N11O9" },
      { label: "Molecular Weight", value: "751.87 g/mol" },
      { label: "Amino Acids", value: "7" },
    ],
  },
  {
    slug: "semax",
    name: "Semax",
    series: "Neuro Series",
    image: semax,
    price: 29.99,
    oldPrice: 45.99,
    discount: 35,
    sizes: ["10mg"],
    description:
      "A synthetic heptapeptide derived from ACTH(4-10), studied in laboratory research for its role in neurotrophic factor expression and cognitive signaling pathways.",
    specs: [
      { label: "CAS Number", value: "80714-61-0" },
      { label: "Molecular Formula", value: "C37H51N9O10S" },
      { label: "Molecular Weight", value: "813.93 g/mol" },
      { label: "Amino Acids", value: "7" },
    ],
  },
  {
    slug: "tb-500",
    name: "TB-500",
    series: "Recovery Series",
    image: tb500,
    price: 49.99,
    oldPrice: 76.99,
    discount: 35,
    sizes: ["10mg"],
    description:
      "A 43-amino-acid peptide corresponding to Thymosin Beta-4, studied for its role in actin regulation, cellular migration, and tissue repair signaling in laboratory models.",
    specs: [
      { label: "CAS Number", value: "77591-33-4" },
      { label: "Molecular Formula", value: "C212H350N56O78S" },
      { label: "Molecular Weight", value: "4,963.44 g/mol" },
      { label: "Amino Acids", value: "43" },
    ],
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    series: "Growth Series",
    image: tesa,
    price: 69.99,
    oldPrice: 107.99,
    discount: 35,
    sizes: ["10mg"],
    description:
      "A 44-amino-acid synthetic analog of growth hormone-releasing hormone, modified for enhanced stability, studied for its role in growth hormone secretion research.",
    specs: [
      { label: "CAS Number", value: "218949-48-5" },
      { label: "Amino Acids", value: "44" },
    ],
  },
];

export const catalogPageOne = products.slice(0, 12);
export const featuredProducts = products.slice(0, 7);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPrice = (n: number) =>
  `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const priceLabel = (p: Product) =>
  p.priceMax ? `${formatPrice(p.price)} — ${formatPrice(p.priceMax)}` : formatPrice(p.price);
