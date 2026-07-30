import p2t from "@/assets/products/2t-peptide-20mg-metabolic.jpg.asset.json";
import p3r from "@/assets/products/3r-peptide-10mg-metabolic.jpg.asset.json";
import bpc from "@/assets/products/bpc-157-10mg-recovery.jpg.asset.json";
import cjc from "@/assets/products/cjc-1295no-dac-5mg-growth.jpg.asset.json";
import epi from "@/assets/products/epithalon-50mg-longevity.jpg.asset.json";
import ghk from "@/assets/products/ghk-cu-50mg-longevity.jpg.asset.json";
import igf from "@/assets/products/igf-lr3-1mg-metabolic.jpg.asset.json";
import ipa from "@/assets/products/ipamorelin-5mg-metabolic.jpg.asset.json";
import klow from "@/assets/products/klow.jpg.asset.json";
import mots from "@/assets/products/motsc-20mg-growth.jpg.asset.json";
import nad from "@/assets/products/nad-500mg-longevity.jpg.asset.json";
import selank from "@/assets/products/selank-10mg-neuro.jpg.asset.json";
import semax from "@/assets/products/semax-10mg-neuro.jpg.asset.json";
import tb500 from "@/assets/products/tb-500-10mg-recovery.jpg.asset.json";
import tesa from "@/assets/products/tesamorelin-10mg-growth.jpg.asset.json";

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
    image: p2t.url,
    price: 130,
    oldPrice: 199.99,
    discount: 35,
    sizes: ["20mg"],
    description:
      "A dual GIP and GLP-1 receptor agonist studied for its role in metabolic and glucose-regulation research.",
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
    image: p3r.url,
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
    image: bpc.url,
    price: 99,
    oldPrice: 122.99,
    discount: 20,
    sizes: ["10mg"],
    description:
      "A synthetic pentadecapeptide derived from a protective protein found in gastric juice, widely studied in tissue-repair research.",
    specs: [
      { label: "CAS Number", value: "137525-51-0" },
      { label: "Molecular Formula", value: "C62H98N16O22" },
      { label: "Molecular Weight", value: "1,419.53 g/mol" },
      { label: "Amino Acids", value: "15" },
    ],
  },
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 No DAC",
    series: "Growth Series",
    image: cjc.url,
    price: 49.99,
    oldPrice: 76.99,
    discount: 36,
    sizes: ["5mg"],
    description:
      "A growth hormone releasing hormone analog studied for its influence on pulsatile growth hormone secretion.",
    specs: [
      { label: "CAS Number", value: "863288-34-0" },
      { label: "Molecular Formula", value: "C152H252N44O42" },
      { label: "Molecular Weight", value: "3,367.90 g/mol" },
      { label: "Amino Acids", value: "29" },
    ],
  },
  {
    slug: "epithalon",
    name: "Epithalon",
    series: "Longevity Series",
    image: epi.url,
    price: 149.99,
    oldPrice: 230.99,
    discount: 35,
    sizes: ["50mg"],
    description:
      "A synthetic tetrapeptide studied for its interaction with telomerase activity and cellular aging research.",
    specs: [
      { label: "CAS Number", value: "307297-39-8" },
      { label: "Molecular Formula", value: "C14H22N4O9" },
      { label: "Molecular Weight", value: "390.35 g/mol" },
      { label: "Amino Acids", value: "4" },
    ],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    series: "Longevity Series",
    image: ghk.url,
    price: 49.99,
    oldPrice: 76.99,
    discount: 35,
    sizes: ["50mg"],
    description:
      "A naturally occurring copper peptide complex studied in skin remodeling and tissue regeneration research.",
    specs: [
      { label: "CAS Number", value: "89030-95-5" },
      { label: "Molecular Formula", value: "C14H22N6O4Cu" },
      { label: "Molecular Weight", value: "401.93 g/mol" },
      { label: "Amino Acids", value: "3" },
    ],
  },
  {
    slug: "igf-lr3",
    name: "IGF-LR3",
    series: "Metabolic Series",
    image: igf.url,
    price: 69,
    oldPrice: 107.99,
    discount: 36,
    sizes: ["1mg"],
    description:
      "A long arginine analog of insulin-like growth factor 1, studied for its extended half-life in cellular growth research.",
    specs: [
      { label: "CAS Number", value: "946870-92-4" },
      { label: "Molecular Formula", value: "C400H625N111O115S9" },
      { label: "Molecular Weight", value: "9,111.00 g/mol" },
      { label: "Amino Acids", value: "83" },
    ],
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    series: "Metabolic Series",
    image: ipa.url,
    price: 56,
    oldPrice: 85.99,
    discount: 35,
    sizes: ["5mg"],
    description:
      "A selective growth hormone secretagogue pentapeptide studied for targeted GH release without cortisol elevation.",
    specs: [
      { label: "CAS Number", value: "170851-70-4" },
      { label: "Molecular Formula", value: "C38H49N9O5" },
      { label: "Molecular Weight", value: "711.85 g/mol" },
      { label: "Amino Acids", value: "5" },
    ],
  },
  {
    slug: "klow-blend",
    name: "KLOW Blend",
    series: "Signature Blends",
    image: klow.url,
    price: 100.99,
    oldPrice: 153.99,
    discount: 34,
    sizes: ["80mg"],
    description:
      "A signature research blend combining GHK-Cu, KPV, TB-500, and BPC-157 for combined repair-pathway studies.",
    specs: [
      { label: "Composition", value: "GHK-Cu, KPV, TB-500, BPC-157" },
      { label: "Total Mass", value: "80mg" },
      { label: "Form", value: "Lyophilized powder" },
      { label: "Purity", value: "99%+" },
    ],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    series: "Growth Series",
    image: mots.url,
    price: 80.99,
    oldPrice: 122.99,
    discount: 34,
    sizes: ["20mg"],
    description:
      "A mitochondrial-derived peptide studied for its role in metabolic homeostasis and cellular energy research.",
    specs: [
      { label: "CAS Number", value: "1627580-64-6" },
      { label: "Molecular Formula", value: "C101H152N28O22S2" },
      { label: "Molecular Weight", value: "2,174.60 g/mol" },
      { label: "Amino Acids", value: "16" },
    ],
  },
  {
    slug: "nad",
    name: "NAD+",
    series: "Longevity Series",
    image: nad.url,
    price: 69.99,
    priceMax: 100,
    discount: 36,
    sizes: ["500mg", "1000mg"],
    description:
      "Nicotinamide adenine dinucleotide, a coenzyme central to cellular metabolism and mitochondrial research.",
    specs: [
      { label: "CAS Number", value: "53-84-9" },
      { label: "Molecular Formula", value: "C21H27N7O14P2" },
      { label: "Molecular Weight", value: "663.43 g/mol" },
      { label: "Purity", value: "99%+" },
    ],
  },
  {
    slug: "selank",
    name: "Selank",
    series: "Neuro Series",
    image: selank.url,
    price: 29.99,
    priceMax: 59.99,
    discount: 36,
    sizes: ["10mg", "20mg"],
    description:
      "A synthetic heptapeptide analog of tuftsin studied in anxiolytic and cognitive neuroscience research.",
    specs: [
      { label: "CAS Number", value: "129954-34-3" },
      { label: "Molecular Formula", value: "C33H57N11O9" },
      { label: "Molecular Weight", value: "751.88 g/mol" },
      { label: "Amino Acids", value: "7" },
    ],
  },
  {
    slug: "semax",
    name: "Semax",
    series: "Neuro Series",
    image: semax.url,
    price: 29.99,
    oldPrice: 45.99,
    discount: 35,
    sizes: ["10mg"],
    description:
      "A synthetic ACTH(4-10) analog studied for neuroprotective and nootropic mechanisms.",
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
    image: tb500.url,
    price: 49.99,
    oldPrice: 76.99,
    discount: 35,
    sizes: ["10mg"],
    description:
      "A synthetic fragment of thymosin beta-4 studied for actin regulation and tissue repair research.",
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
    image: tesa.url,
    price: 69.99,
    oldPrice: 107.99,
    discount: 35,
    sizes: ["10mg"],
    description:
      "A stabilized growth hormone releasing factor analog studied for adipose tissue and metabolic research.",
    specs: [
      { label: "CAS Number", value: "218949-48-5" },
      { label: "Molecular Formula", value: "C221H366N72O67S" },
      { label: "Molecular Weight", value: "5,135.86 g/mol" },
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
