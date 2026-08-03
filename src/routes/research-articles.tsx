import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ExternalLink, FlaskConical } from "lucide-react";

export const Route = createFileRoute("/research-articles")({
  head: () => ({
    meta: [
      { title: "Peptide Research Reference Library   ObeliskRX" },
      {
        name: "description",
        content:
          "A standalone bibliography of published research on peptides and related compounds. Every reference includes a direct, working link to PubMed, PMC, or the publishing journal.",
      },
      { property: "og:title", content: "Peptide Research Reference Library   ObeliskRX" },
      { property: "og:url", content: "/research-articles" },
    ],
    links: [{ rel: "canonical", href: "/research-articles" }],
  }),
  component: ResearchArticles,
});

type Reference = {
  n: number;
  citation: string;
  url: string;
};

type Section = {
  num: number;
  compound: string;
  refs: Reference[];
};

const sections: Section[] = [
  {
    num: 1,
    compound: "BPC-157",
    refs: [
      { n: 1, citation: 'Józwiak M, Bauer M, Kamysz W, Kleczkowska P. "Multifunctionality and Possible Medical Application of the BPC 157 Peptide   Literature and Patent Review." Pharmaceuticals. 2025;18(2):185.', url: "https://pubmed.ncbi.nlm.nih.gov/40005999/" },
      { n: 2, citation: 'Vasireddi N, Hahamyan H, Salata MJ, et al. "Emerging Use of BPC-157 in Orthopaedic Sports Medicine: A Systematic Review." Am J Sports Med. 2025.', url: "https://pubmed.ncbi.nlm.nih.gov/40756949/" },
      { n: 3, citation: 'Mateescu DM, et al. "BPC-157 as an Investigational Peptide Therapeutic: Biopharmaceutical Challenges, Formulation Strategies, and Translational Development Barriers." Pharmaceutics. 2026;18(5):625.', url: "https://pubmed.ncbi.nlm.nih.gov/42198317/" },
      { n: 4, citation: 'Lee E, Burgess A. "Safety of Intravenous Infusion of BPC157 in Humans: A Pilot Study." 2025.', url: "https://pubmed.ncbi.nlm.nih.gov/40131143/" },
      { n: 5, citation: 'Sikiric P, Boban Blagaic A, Strbe S, et al. "The Stable Gastric Pentadecapeptide BPC 157: Pleiotropic Beneficial Activity and Its Possible Relations with Neurotransmitter Activity." Pharmaceuticals. 2024;17:461.', url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11053547/" },
    ],
  },
  {
    num: 2,
    compound: "TB-500 (Thymosin Beta-4)",
    refs: [
      { n: 6, citation: 'Mayfield CK, Bolia IK, Feingold CL, et al. "Injectable Peptide Therapy: A Primer for Orthopaedic and Sports Medicine Physicians." Am J Sports Med. 2026;54(1):223-229.', url: "https://pubmed.ncbi.nlm.nih.gov/41476424/" },
      { n: 7, citation: 'McGuire F, Hughes E, Maak T, Cushman DM. "Thymosin Beta-4 and TB-500 in Tissue Healing, Regeneration, and Musculoskeletal Repair: A Scoping Review." Appl Sci. 2026;16(12):6202.', url: "https://www.mdpi.com/2076-3417/16/12/6202" },
      { n: 8, citation: 'Malinda KM, Sidhu GS, Mani H, et al. "Thymosin β4 Accelerates Wound Healing." J Invest Dermatol. 1999;113:364-368.', url: "https://pubmed.ncbi.nlm.nih.gov/10469335/" },
      { n: 9, citation: 'Rahaman KA, Muresan AR, Min H, et al. "Simultaneous Quantification of TB-500 and Its Metabolites in In Vitro Experiments and Rats by UHPLC-Q-Exactive Orbitrap MS/MS." J Chromatogr B. 2024;1235:124033.', url: "https://pubmed.ncbi.nlm.nih.gov/38382158/" },
      { n: 10, citation: 'Oliveira KS, Roldão JA. "Synthetic Thymosin β-4 (TB-500): Transforming Healing and Tissue Repair in Dentistry." Conference proceedings review, 2025.', url: "https://static.even3.com/anais/1367936.pdf" },
    ],
  },
  {
    num: 3,
    compound: "CJC-1295",
    refs: [
      { n: 11, citation: 'Teichman SL, Neale A, Lawrence B, et al. "Prolonged Stimulation of Growth Hormone (GH) and Insulin-Like Growth Factor I Secretion by CJC-1295, a Long-Acting Analog of GH-Releasing Hormone, in Healthy Adults." J Clin Endocrinol Metab. 2006;91(3):799-805.', url: "https://pubmed.ncbi.nlm.nih.gov/16352683/" },
      { n: 12, citation: '"Once-Daily Administration of CJC-1295, a Long-Acting Growth Hormone-Releasing Hormone (GHRH) Analog, Normalizes Growth in the GHRH Knockout Mouse."', url: "https://pubmed.ncbi.nlm.nih.gov/16822960/" },
      { n: 13, citation: '"Pulsatile Secretion of Growth Hormone (GH) Persists During Continuous Stimulation by CJC-1295, a Long-Acting GH-Releasing Hormone Analog." J Clin Endocrinol Metab. 2006;91(12):4792-4797.', url: "https://pubmed.ncbi.nlm.nih.gov/17018654/" },
      { n: 14, citation: '"Qualitative Identification of Growth Hormone-Releasing Hormones in Human Plasma by Means of Immunoaffinity Purification and LC-HRMS/MS." (anti-doping detection methodology for CJC-1295)', url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4830873/" },
      { n: 15, citation: 'Mayfield CK, et al. "Injectable Peptide Therapy: A Primer for Orthopaedic and Sports Medicine Physicians"   covers CJC-1295/ipamorelin combination data. Am J Sports Med. 2026.', url: "https://pubmed.ncbi.nlm.nih.gov/41476424/" },
    ],
  },
  {
    num: 4,
    compound: "Ipamorelin",
    refs: [
      { n: 16, citation: 'Raun K, Hansen BS, Johansen NL, et al. "Ipamorelin, the First Selective Growth Hormone Secretagogue." Eur J Endocrinol. 1998;139(5):552-561.', url: "https://pubmed.ncbi.nlm.nih.gov/9849822/" },
      { n: 17, citation: 'Venkova K, Mann W, Nelson R, Greenwood-Van Meerveld B. "Efficacy of Ipamorelin, a Novel Ghrelin Mimetic, in a Rodent Model of Postoperative Ileus." J Pharmacol Exp Ther. 2009;329:1110-1116.', url: "https://pubmed.ncbi.nlm.nih.gov/19289567/" },
      { n: 18, citation: '"Prospective, Randomized, Controlled, Proof-of-Concept Study of the Ghrelin Mimetic Ipamorelin for the Management of Postoperative Ileus in Bowel Resection Patients." Int J Colorectal Dis. 2014. (Phase 2 human trial, NCT00672074)', url: "https://link.springer.com/article/10.1007/s00384-014-2030-8" },
      { n: 19, citation: 'Tack J, Depoortere I, Bisschops R, et al. "Influence of Ghrelin on Interdigestive Gastrointestinal Motility in Humans." Gut. 2006;55(3):327-333.', url: "https://pubmed.ncbi.nlm.nih.gov/16216827/" },
      { n: 20, citation: '"Ghrelin and Functional Dyspepsia." Review covering ghrelin-receptor agonist prokinetic mechanisms including ipamorelin.', url: "https://pubmed.ncbi.nlm.nih.gov/20721353/" },
    ],
  },
  {
    num: 5,
    compound: "Semaglutide",
    refs: [
      { n: 21, citation: 'Wilding JPH, Batterham RL, Calanna S, et al. "Once-Weekly Semaglutide in Adults with Overweight or Obesity" (STEP 1). N Engl J Med. 2021;385(1).', url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2032183" },
      { n: 22, citation: 'Garvey WT, Batterham RL, Bhatta M, et al. "Two-Year Effects of Semaglutide in Adults with Overweight or Obesity: The STEP 5 Trial." Nat Med. 2022.', url: "https://pubmed.ncbi.nlm.nih.gov/36216945/" },
      { n: 23, citation: 'STEP-HFpEF Trial: "Semaglutide in HFpEF Across Obesity Class and by Body Weight Reduction."', url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10504076/" },
      { n: 24, citation: 'Weghuber D, Barrett T, Barrientos-Pérez M, et al. "Once-Weekly Semaglutide in Adolescents with Obesity" (STEP TEENS). N Engl J Med.', url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2208601" },
      { n: 25, citation: '"Semaglutide for the Treatment of Overweight and Obesity: A Review" (cross-trial summary of STEP 1,2,3,4,5,8). 2022.', url: "https://pubmed.ncbi.nlm.nih.gov/36254579/" },
    ],
  },
  {
    num: 6,
    compound: "Tirzepatide",
    refs: [
      { n: 26, citation: 'Jastreboff AM, Aronne LJ, Ahmad NN, et al. "Tirzepatide Once Weekly for the Treatment of Obesity" (SURMOUNT-1). N Engl J Med. 2022;387(3).', url: "https://pubmed.ncbi.nlm.nih.gov/35658024/" },
      { n: 27, citation: '"Tirzepatide After Intensive Lifestyle Intervention in Adults with Overweight or Obesity" (SURMOUNT-3).', url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10667099/" },
      { n: 28, citation: '"Weight Reduction Over Time in Tirzepatide-Treated Participants by Early Weight Loss Response: Post Hoc Analysis in SURMOUNT-1." 2025.', url: "https://pubmed.ncbi.nlm.nih.gov/40677091/" },
      { n: 29, citation: '"Tirzepatide Leads to Weight Reduction in People with Obesity Due to MC4R Deficiency" (SURMOUNT-1 genetic subgroup analysis).', url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12532586/" },
      { n: 30, citation: '"The Efficacy and Safety of Tirzepatide in Patients with Diabetes and/or Obesity: Systematic Review and Meta-Analysis of Randomized Clinical Trials." 2025.', url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12114739/" },
    ],
  },
  {
    num: 7,
    compound: "Retatrutide",
    refs: [
      { n: 31, citation: '"Efficacy and Safety of Retatrutide, a GIP, GLP-1, and Glucagon Receptor Agonist, in People with Type 2 Diabetes and Inadequate Glycaemic Control" (TRANSCEND-T2D-1). Lancet, 2026.', url: "https://www.sciencedirect.com/science/article/abs/pii/S0140673626009670" },
      { n: 32, citation: 'Eli Lilly. "Lilly\'s Triple Agonist, Retatrutide, Delivered Powerful Weight Loss in Pivotal Phase 3 Obesity Trial" (TRIUMPH-1). May 2026.', url: "https://www.prnewswire.com/news-releases/lillys-triple-agonist-retatrutide-delivered-powerful-weight-loss-in-pivotal-phase-3-obesity-trial-302778859.html" },
      { n: 33, citation: 'Jastreboff AM, Kaplan LM, Frías JP, et al. "Triple-Hormone-Receptor Agonist Retatrutide for Obesity   A Phase 2 Trial." N Engl J Med. 2023;389(6):514-526.', url: "https://pubmed.ncbi.nlm.nih.gov/37366315/" },
      { n: 34, citation: 'Eli Lilly. "Lilly\'s Triple Agonist, Retatrutide, Delivered Weight Loss of Up to an Average of 71.2 lbs Along with Substantial Relief from Osteoarthritis Pain" (TRIUMPH-4). Dec 2025.', url: "https://investor.lilly.com/news-releases/news-release-details/lillys-triple-agonist-retatrutide-delivered-weight-loss-average" },
      { n: 35, citation: "ClinicalTrials.gov record for TRIUMPH-4 (retatrutide, obesity/overweight with knee osteoarthritis).", url: "https://clinicaltrials.gov/study/NCT05931367" },
    ],
  },
  {
    num: 8,
    compound: "NAD+ / NAD+ Precursors (NMN, NR)",
    refs: [
      { n: 36, citation: '"The Therapeutic Perspective of NAD+ Precursors in Age-Related Diseases." 2024.', url: "https://pubmed.ncbi.nlm.nih.gov/38340651/" },
      { n: 37, citation: '"NAD+ Precursor Supplementation in Human Ageing: Clinical Evidence and Challenges." Nat Metab. 2025.', url: "https://pubmed.ncbi.nlm.nih.gov/41083806/" },
      { n: 38, citation: 'Brakedal B, Dölle C, Riemer F, et al. "The NADPARK Study: A Randomized Phase I Trial of Nicotinamide Riboside Supplementation in Parkinson\'s Disease." Cell Metab. 2022;34(3):396-407.', url: "https://pubmed.ncbi.nlm.nih.gov/35235774/" },
      { n: 39, citation: '"Towards Personalized Nicotinamide Mononucleotide (NMN) Supplementation: NAD Concentration"   dose-ranging RCT, 80 adults.', url: "https://pubmed.ncbi.nlm.nih.gov/38430946/" },
      { n: 40, citation: '"Effects of NAD+ Precursor Supplementation on Glucose and Lipid Metabolism in Humans: A Meta-Analysis."', url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8932245/" },
    ],
  },
  {
    num: 9,
    compound: "MOTS-c",
    refs: [
      { n: 41, citation: 'Lee C, Zeng J, Drew BG, et al. "The Mitochondrial-Derived Peptide MOTS-c Promotes Metabolic Homeostasis and Reduces Obesity and Insulin Resistance." Cell Metab. 2015;21(3):443-454.', url: "https://www.cell.com/cell-metabolism/fulltext/S1550-4131(15)00061-3" },
      { n: 42, citation: 'Kim KH, Son JM, Benayoun BA, Lee C. "The Mitochondrial-Encoded Peptide MOTS-c Translocates to the Nucleus to Regulate Nuclear Gene Expression in Response to Metabolic Stress." Cell Metab. 2018;28:516-524.', url: "https://www.cell.com/cell-metabolism/fulltext/S1550-4131(18)30390-5" },
      { n: 43, citation: '"MOTS-c: A Novel Mitochondrial-Derived Peptide Regulating Muscle and Fat Metabolism."', url: "https://pubmed.ncbi.nlm.nih.gov/27216708/" },
      { n: 44, citation: '"Mitochondria-Derived Peptide MOTS-c: Effects and Mechanisms Related to Stress, Metabolism and Aging."', url: "https://pubmed.ncbi.nlm.nih.gov/36670507/" },
      { n: 45, citation: '"Mitochondrial-Encoded Peptide MOTS-c Prevents Pancreatic Islet Cell Senescence to Delay Diabetes." Exp Mol Med. 2025.', url: "https://www.nature.com/articles/s12276-025-01521-1" },
    ],
  },
  {
    num: 10,
    compound: "Epithalon (Epitalon)",
    refs: [
      { n: 46, citation: 'Khavinson VKh, Bondarev IE, Butyugov AA. "Epithalon Peptide Induces Telomerase Activity and Telomere Elongation in Human Somatic Cells." Bull Exp Biol Med. 2003.', url: "https://pubmed.ncbi.nlm.nih.gov/12937682/" },
      { n: 47, citation: '"Overview of Epitalon   Highly Bioactive Pineal Tetrapeptide with Promising Properties." 2025.', url: "https://pubmed.ncbi.nlm.nih.gov/40141333/" },
      { n: 48, citation: '"Overview of Epitalon   Highly Bioactive Pineal Tetrapeptide with Promising Properties" (open-access version with mechanism figures).', url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11943447/" },
      { n: 49, citation: 'Korkushko OV, Khavinson VKh, Shatilo VB, Antonyk-Sheglova IA. "Peptide Geroprotector from the Pituitary Gland Inhibits Rapid Aging of Elderly People: Results of 15-Year Follow-Up." (randomized comparative study, epithalamin)', url: "https://pubmed.ncbi.nlm.nih.gov/22451889/" },
      { n: 50, citation: 'Anisimov VN, Khavinson VKh, Popovich IG, et al. "Effect of Epitalon on Biomarkers of Aging, Life Span and Spontaneous Tumor Incidence in Female Swiss-Derived SHR Mice."', url: "https://pubmed.ncbi.nlm.nih.gov/14501183/" },
    ],
  },
  {
    num: 11,
    compound: "Semax",
    refs: [
      { n: 51, citation: 'Dolotov OV, Seredenina TS, Levitskaya NG, et al. "The Heptapeptide SEMAX Stimulates BDNF Expression in Different Areas of the Rat Brain In Vivo." Dokl Biol Sci. 2003.', url: "https://pubmed.ncbi.nlm.nih.gov/14556513/" },
      { n: 52, citation: 'Shadrina M, Kolomin T, Agapova T, et al. "Comparison of the Temporary Dynamics of NGF and BDNF Gene Expression in Rat Hippocampus, Frontal Cortex, and Retina Under Semax Action."', url: "https://pubmed.ncbi.nlm.nih.gov/19662538/" },
      { n: 53, citation: '"[Effect of Semax on the Temporary Dynamics of Brain-Derived Neurotrophic Factor and Nerve Growth Factor Gene Expression in the Rat Hippocampus and Frontal Cortex]."', url: "https://pubmed.ncbi.nlm.nih.gov/18756821/" },
      { n: 54, citation: 'Medvedeva EV, Dmitrieva VG, Povarova OV, et al. "The Peptide Semax Affects the Expression of Genes Related to the Immune and Vascular Systems in Rat Brain Focal Ischemia: Genome-Wide Transcriptional Analysis." BMC Genomics. 2014.', url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3987924/" },
      { n: 55, citation: 'Gusev EI, Martynov MYu, Kostenko EV, Petrova LV, Bobyreva SN. "The Efficacy of Semax in the Treatment of Patients at Different Stages of Ischemic Stroke." Zh Nevrol Psikhiatr. 2018.', url: "https://pubmed.ncbi.nlm.nih.gov/29798983/" },
    ],
  },
  {
    num: 12,
    compound: "Selank",
    refs: [
      { n: 56, citation: 'Kolik LG, et al. "Selank, a Peptide Analog of Tuftsin, Attenuates Aversive Signs of Morphine Withdrawal in Rats." Bull Exp Biol Med.', url: "https://pubmed.ncbi.nlm.nih.gov/36322304/" },
      { n: 57, citation: '"Functional Connectomic Approach to Studying Selank and Semax Effects." 2020. (fMRI, 52 healthy participants)', url: "https://pubmed.ncbi.nlm.nih.gov/32342318/" },
      { n: 58, citation: 'Volkova A, Shadrina M, Kolomin T, et al. "Selank Administration Affects the Expression of Some Genes Involved in GABAergic Neurotransmission." Front Pharmacol. 2016;7:31.', url: "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2016.00031/full" },
      { n: 59, citation: '"GABA, Selank, and Olanzapine Affect the Expression of Genes Involved in GABAergic Neurotransmission in IMR-32 Cells." Front Pharmacol. 2017.', url: "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2017.00089/full" },
      { n: 60, citation: '"Selank Peptide Causes Changes in Gene Expression in the Hippocampus of Rats in the Early Hours After Acute Restraint Stress." Nanobiotechnology Reports.', url: "https://link.springer.com/article/10.1134/S2635167624601335" },
    ],
  },
  {
    num: 13,
    compound: "IGF-1 LR3",
    refs: [
      { n: 61, citation: 'Tomas FM, Knowles SE, Owens PC, et al. "Insulin-like Growth Factor-I (IGF-I) and Especially IGF-I Variants Are Anabolic in Dexamethasone-Treated Rats." Biochem J. 1992;282(Pt 1):91-97.', url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1130894" },
      { n: 62, citation: 'Tomas FM, et al. "Long R3 Insulin-like Growth Factor-I (IGF-I) Infusion Stimulates Organ Growth but Reduces Plasma IGF-I, IGF-II and IGF Binding Protein Concentrations in the Guinea Pig."', url: "https://pubmed.ncbi.nlm.nih.gov/7561636/" },
      { n: 63, citation: 'Tomas FM. "Insulin-like Growth Factor-I (IGF-I) Analogue, LR(3)IGF-I, Ameliorates the Loss of Body Weight but Not of Skeletal Muscle During Food Restriction." Growth Horm IGF Res. 2001;11(2):92-103.', url: "https://pubmed.ncbi.nlm.nih.gov/11472075/" },
      { n: 64, citation: '"Intranasal Long R3 Insulin-Like Growth Factor-1 Treatment." 2024/2025 study.', url: "https://pubmed.ncbi.nlm.nih.gov/39610283/" },
      { n: 65, citation: '"Mechanisms of IGF-1-Mediated Regulation of Skeletal Muscle Hypertrophy and Atrophy." Mechanism review covering IGF-1/IGF-1 LR3 signaling pathways.', url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7564605/" },
    ],
  },
  {
    num: 14,
    compound: "Tesamorelin",
    refs: [
      { n: 66, citation: '"Spotlight on Tesamorelin in HIV-Associated Lipodystrophy." 2011.', url: "https://pubmed.ncbi.nlm.nih.gov/22050344/" },
      { n: 67, citation: '"Effects of Tesamorelin (TH9507), a Growth Hormone-Releasing Factor Analog, in HIV-Infected Patients with Excess Abdominal Fat: Pooled Analysis of Two Phase 3 Trials with Safety Extension Data."', url: "https://pubmed.ncbi.nlm.nih.gov/20554713/" },
      { n: 68, citation: '"Effect of Tesamorelin on Visceral Fat and Liver Fat in HIV-Infected Patients with Abdominal Fat Accumulation: A Randomized Clinical Trial."', url: "https://pubmed.ncbi.nlm.nih.gov/25038357/" },
      { n: 69, citation: '"Reduction in Visceral Adiposity Is Associated with an Improved Metabolic Profile in HIV-Infected Patients Receiving Tesamorelin."', url: "https://pubmed.ncbi.nlm.nih.gov/22495074/" },
      { n: 70, citation: '"Body Composition, Hepatic Fat, Metabolic, and Safety Outcomes of Tesamorelin: A Meta-Analysis of RCTs." 2026.', url: "https://pubmed.ncbi.nlm.nih.gov/41545261/" },
    ],
  },
  {
    num: 15,
    compound: "GHK-Cu (Copper Peptide)",
    refs: [
      { n: 71, citation: 'Maquart FX, Bellon G, Chaqour B, et al. "In Vivo Stimulation of Connective Tissue Accumulation by the Tripeptide-Copper Complex Glycyl-L-Histidyl-L-Lysine-Cu2+ in Rat Experimental Wounds." J Clin Invest. 1993;92:2368-2376.', url: "https://www.jci.org/articles/view/116842" },
      { n: 72, citation: '"Regenerative and Protective Actions of the GHK-Cu Peptide in the Light of the New Gene Data."', url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6073405/" },
      { n: 73, citation: '"Skin Regenerative and Anti-Cancer Actions of Copper Peptides."', url: "https://www.mdpi.com/2079-9284/5/2/29" },
      { n: 74, citation: '"Copper–GHK Increases Integrin Expression and p63 Positivity by Keratinocytes." Arch Dermatol Res.', url: "https://link.springer.com/article/10.1007/s00403-009-0942-x" },
      { n: 75, citation: '"Expression and Activation of Matrix Metalloproteinases in Wounds: Modulation by the Tripeptide–Copper Complex Glycyl-L-Histidyl-L-Lysine-Cu2+."', url: "https://www.sciencedirect.com/science/article/pii/S0022202X15405147" },
    ],
  },
];

function ResearchArticles() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="border-b border-border bg-card py-14">
        <div className="container-page text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            <FlaskConical size={12} />
            Independent Research Data
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Peptide Research Reference Library
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Independent research data page   verified direct links only
          </p>
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-primary">Home</Link>
            <span>/</span>
            <span className="font-medium text-foreground">Research Articles</span>
          </div>
        </div>
      </div>

      <div className="container-page py-14">
        <div className="mx-auto max-w-4xl space-y-10">

          {/* About This Page */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <BookOpen size={18} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-foreground">About This Page</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This page is a standalone bibliography of published research on peptides and related compounds.
                  It is not a product page, does not sell or promote any product, and is not linked to any product listing.
                  Every reference below includes a direct, working link to the source (PubMed, PMC, the publishing journal,
                  or   for pending clinical trial data not yet in a journal   the primary press release or ClinicalTrials.gov record).
                  Content here is provided for general research and educational reference only.
                </p>
              </div>
            </div>
          </section>

          {/* Quick Jump */}
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.num}
                href={`#section-${s.num}`}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                {s.num}. {s.compound}
              </a>
            ))}
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <section
              key={section.num}
              id={`section-${section.num}`}
              className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
            >
              <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-foreground">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  {section.num}
                </span>
                {section.compound}
              </h2>
              <ol className="space-y-4">
                {section.refs.map((ref) => (
                  <li key={ref.n} className="flex gap-3 text-sm">
                    <span className="mt-0.5 w-6 shrink-0 text-xs font-bold text-primary">
                      {ref.n}.
                    </span>
                    <div className="min-w-0">
                      <p className="leading-relaxed text-foreground/80">{ref.citation}</p>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 break-all text-xs text-primary underline underline-offset-2 transition-opacity hover:opacity-70"
                      >
                        {ref.url}
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground">
            All links verified at time of publication. ObeliskRX is not affiliated with any of the cited authors, journals, or institutions.
          </p>
        </div>
      </div>
    </div>
  );
}
