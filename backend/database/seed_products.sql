-- ================================================
--  ObeliskRX   Product Seed Data (16 products)
--  schema.sql ke BAAD import karo
-- ================================================

USE obeliskrx_db;

INSERT INTO products (slug, name, series, description, price, price_max, old_price, discount, sizes, specs, image_url) VALUES

-- ── Metabolic Series ────────────────────────────────
(
  '2t-peptide',
  '2(T) Peptide',
  'Metabolic Series',
  'A 39-amino-acid synthetic peptide functioning as a dual agonist at the GIP and GLP-1 receptors, studied for its role in glycemic and metabolic research.',
  130.00, NULL, 199.99, 35,
  '["20mg"]',
  '[{"label":"CAS Number","value":"2023788-19-2"},{"label":"Molecular Formula","value":"C225H348N48O68"},{"label":"Molecular Weight","value":"4,813.45 g/mol"},{"label":"Amino Acids","value":"39"}]',
  '2T-Peptide-20mg.jpg'
),
(
  '3r-peptide',
  '3(R) Peptide',
  'Metabolic Series',
  'A 39-amino-acid synthetic peptide engineered as a triple agonist at the GIP, GLP-1, and glucagon receptors, studied for its role in metabolic and glucose-regulation research.',
  70.00, 130.00, NULL, 35,
  '["10mg","20mg"]',
  '[{"label":"CAS Number","value":"2381089-83-2"},{"label":"Molecular Formula","value":"C221H342N46O68"},{"label":"Molecular Weight","value":"4,731.33 g/mol"},{"label":"Amino Acids","value":"39"}]',
  '3R-Peptide-10mg.jpg'
),
(
  'igf-lr3',
  'IGF-LR3',
  'Metabolic Series',
  '',
  69.00, NULL, 107.99, 36,
  '["1mg"]',
  '[]',
  'IGF-LR3-1mg.jpg'
),
(
  'ipamorelin',
  'Ipamorelin',
  'Metabolic Series',
  '',
  56.00, NULL, 85.99, 35,
  '["5mg"]',
  '[]',
  'Ipamorelin-5mg.jpg'
),

-- ── Recovery Series ─────────────────────────────────
(
  'bpc-157',
  'BPC-157',
  'Recovery Series',
  'A 15-amino-acid synthetic peptide fragment studied in laboratory models for its role in angiogenesis, tissue signaling, and cellular repair processes.',
  99.00, NULL, 122.99, 20,
  '["10mg"]',
  '[{"label":"CAS Number","value":"137525-51-0"},{"label":"Amino Acids","value":"15"},{"label":"Type","value":"Synthetic pentadecapeptide"}]',
  'BPC-157-10mg.jpg'
),
(
  'tb-500',
  'TB-500',
  'Recovery Series',
  'A 43-amino-acid peptide corresponding to Thymosin Beta-4, studied for its role in actin regulation, cellular migration, and tissue repair signaling in laboratory models.',
  49.99, NULL, 76.99, 35,
  '["10mg"]',
  '[{"label":"CAS Number","value":"77591-33-4"},{"label":"Molecular Formula","value":"C212H350N56O78S"},{"label":"Molecular Weight","value":"4,963.44 g/mol"},{"label":"Amino Acids","value":"43"}]',
  'TB-500-10mg.jpg'
),
(
  'bpc-157-tb-500-blend',
  'BPC-157 / TB-500 Blend',
  'Recovery Series',
  'A combined formulation of BPC-157 and TB-500 in equal proportion, supplied for laboratory research examining their overlapping roles in tissue repair and cellular signaling pathways.',
  129.99, NULL, 199.99, 35,
  '["20mg"]',
  '[{"label":"Composition","value":"BPC-157 (CAS 137525-51-0) + TB-500 (CAS 77591-33-4)"},{"label":"Ratio","value":"1:1"}]',
  'BPC-TB-Blend-20mg.jpg'
),

-- ── Longevity Series ─────────────────────────────────
(
  'nad',
  'NAD+',
  'Longevity Series',
  'A naturally occurring coenzyme central to cellular energy metabolism and redox reactions, studied in laboratory research for its role in mitochondrial function and cellular aging pathways. Available in 500mg and 1000mg.',
  69.99, 100.00, NULL, 35,
  '["500mg","1000mg"]',
  '[{"label":"CAS Number","value":"53-84-9"},{"label":"Molecular Formula","value":"C21H27N7O14P2"},{"label":"Molecular Weight","value":"663.43 g/mol"},{"label":"Vial Size","value":"10mL"}]',
  'NAD-500mg.jpg'
),
(
  'epithalon',
  'Epithalon',
  'Longevity Series',
  'A synthetic tetrapeptide modeled on the amino acid composition of epithalamin, studied for its role in telomerase activity and cellular aging research.',
  149.99, NULL, 230.99, 35,
  '["50mg"]',
  '[{"label":"CAS Number","value":"307297-39-8"},{"label":"Sequence","value":"Ala-Glu-Asp-Gly"},{"label":"Molecular Formula","value":"C14H22N4O9"},{"label":"Molecular Weight","value":"390.34 g/mol"}]',
  'Epithalon-50mg.jpg'
),
(
  'ghk-cu',
  'GHK-Cu',
  'Longevity Series',
  'A naturally occurring copper-binding tripeptide, studied in laboratory research for its role in collagen synthesis, tissue remodeling, and cellular signaling.',
  49.99, NULL, 76.99, 35,
  '["50mg"]',
  '[{"label":"CAS Number","value":"89030-95-5 (copper complex)"},{"label":"Sequence","value":"Gly-His-Lys"},{"label":"Molecular Weight","value":"340.38 g/mol (tripeptide)"}]',
  'GHK-Cu-50mg.jpg'
),

-- ── Growth Series ────────────────────────────────────
(
  'cjc-1295-no-dac',
  'CJC-1295 No DAC',
  'Growth Series',
  'A 29-amino-acid synthetic analog of growth hormone-releasing hormone (Mod GRF 1-29), studied for its role in growth hormone signaling research.',
  49.99, NULL, 76.99, 35,
  '["5mg"]',
  '[{"label":"Molecular Formula","value":"C152H252N44O42"},{"label":"Molecular Weight","value":"~3,367 g/mol"},{"label":"Amino Acids","value":"29"}]',
  'CJC-1295-No-DAC-5mg.jpg'
),
(
  'tesamorelin',
  'Tesamorelin',
  'Growth Series',
  'A 44-amino-acid synthetic analog of growth hormone-releasing hormone, modified for enhanced stability, studied for its role in growth hormone secretion research.',
  69.99, NULL, 107.99, 35,
  '["10mg"]',
  '[{"label":"CAS Number","value":"218949-48-5"},{"label":"Amino Acids","value":"44"}]',
  'Tesamorelin-10mg.jpg'
),
(
  'mots-c',
  'MOTS-c',
  'Growth Series',
  'A 16-amino-acid mitochondrial-derived peptide, studied in laboratory research for its role in cellular energy regulation and metabolic signaling.',
  80.99, NULL, 122.99, 34,
  '["20mg"]',
  '[{"label":"Molecular Formula","value":"C101H152N28O22S2"},{"label":"Molecular Weight","value":"2,174.64 g/mol"},{"label":"Amino Acids","value":"16"}]',
  'MOTS-c-20mg.jpg'
),

-- ── Neuro Series ─────────────────────────────────────
(
  'selank',
  'Selank',
  'Neuro Series',
  'A synthetic heptapeptide analog of tuftsin, studied in laboratory research for its role in neurochemical and behavioral signaling pathways.',
  29.99, 59.99, NULL, 35,
  '["10mg","20mg"]',
  '[{"label":"CAS Number","value":"129954-34-3"},{"label":"Sequence","value":"Thr-Lys-Pro-Arg-Pro-Gly-Pro"},{"label":"Molecular Formula","value":"C33H57N11O9"},{"label":"Molecular Weight","value":"751.87 g/mol"},{"label":"Amino Acids","value":"7"}]',
  'Selank-10mg.jpg'
),
(
  'semax',
  'Semax',
  'Neuro Series',
  'A synthetic heptapeptide derived from ACTH(4-10), studied in laboratory research for its role in neurotrophic factor expression and cognitive signaling pathways.',
  29.99, NULL, 45.99, 35,
  '["10mg"]',
  '[{"label":"CAS Number","value":"80714-61-0"},{"label":"Molecular Formula","value":"C37H51N9O10S"},{"label":"Molecular Weight","value":"813.93 g/mol"},{"label":"Amino Acids","value":"7"}]',
  'Semax-10mg.jpg'
),

-- ── Signature Blends ─────────────────────────────────
(
  'klow-blend',
  'KLOW Blend',
  'Signature Blends',
  'A four-compound research formulation combining GHK-Cu (50mg), BPC-157 (10mg), TB-500 (10mg), and KPV (10mg), supplied for laboratory studies examining tissue repair, cellular signaling, and regenerative research pathways.',
  100.99, NULL, 153.99, 34,
  '["80mg"]',
  '[{"label":"Composition","value":"GHK-Cu (CAS 89030-95-5) + BPC-157 (CAS 137525-51-0) + TB-500 (CAS 77591-33-4) + KPV (CAS 75435-82-2)"},{"label":"Total","value":"80mg"}]',
  'KLOW-Blend-80mg.jpg'
);
