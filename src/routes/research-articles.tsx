import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/research-articles")({
  head: () => ({
    meta: [
      { title: "Research Articles — ObeliskRX Peptide Science" },
      {
        name: "description",
        content:
          "Reference reading on peptide research: purity testing, certificates of analysis, handling, and study design notes from ObeliskRX.",
      },
      { property: "og:title", content: "Research Articles — ObeliskRX" },
      {
        property: "og:description",
        content: "Reference reading on peptide purity, COAs, and laboratory handling.",
      },
      { property: "og:url", content: "/research-articles" },
    ],
    links: [{ rel: "canonical", href: "/research-articles" }],
  }),
  component: ResearchArticles,
});

const articles = [
  {
    title: "How to read a certificate of analysis",
    series: "Quality & Testing",
    excerpt:
      "HPLC purity, mass spectrometry identity confirmation, and what each line on a COA actually tells you about a batch.",
  },
  {
    title: "Reconstitution and storage fundamentals",
    series: "Laboratory Handling",
    excerpt:
      "Bacteriostatic water ratios, lyophilized stability, and cold-chain practices that preserve peptide integrity.",
  },
  {
    title: "Metabolic series: mechanisms under study",
    series: "Compound Notes",
    excerpt:
      "An overview of GIP, GLP-1, and glucagon receptor agonism as investigated in current metabolic literature.",
  },
  {
    title: "Third-party testing: why it matters",
    series: "Quality & Testing",
    excerpt:
      "Independent verification versus supplier-reported purity, and how to spot documentation gaps before ordering.",
  },
];

function ResearchArticles() {
  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold">Research Articles</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        / <span className="font-medium text-foreground">Research Articles</span>
      </p>

      <div className="grid gap-6 py-12 sm:grid-cols-2">
        {articles.map((a) => (
          <article
            key={a.title}
            className="rounded-lg bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
          >
            {/* ARTICLE IMAGE: add a cover photo for this article when available */}
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {a.series}
            </span>
            <h2 className="mt-3 text-lg font-bold">{a.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Read article <ArrowRight size={14} />
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
