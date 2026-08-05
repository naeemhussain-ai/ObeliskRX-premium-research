import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useScrollAnimation";

// Import images from assets folder
import vidOpt from "@/assets/about-pic/c2-abus-vid-opt.jpg";
import membClub from "@/assets/about-pic/c2-abus-memb-club.jpg";
import tm1 from "@/assets/about-pic/c2-tm-p-1-opt.png";
import tm2 from "@/assets/about-pic/c2-tm-p-2-opt.png";
import tm3 from "@/assets/about-pic/c2-tm-p-3-opt.png";
import tm4 from "@/assets/about-pic/c2-tm-p-4-opt.png";
import tm5 from "@/assets/about-pic/c2-tm-p-5-opt.png";
import tm6 from "@/assets/about-pic/c2-tm-p-6-opt.png";
import tm7 from "@/assets/about-pic/c2-tm-p-7-opt.png";
import tm8 from "@/assets/about-pic/c2-tm-p-8-opt.png";
import tm9 from "@/assets/about-pic/c2-tm-p-9-opt.png";

const teamMembers = [
  { id: 1, img: tm1, name: "Team Member 1" },
  { id: 2, img: tm2, name: "Team Member 2" },
  { id: 3, img: tm3, name: "Team Member 3" },
  { id: 4, img: tm4, name: "Team Member 4" },
  { id: 5, img: tm5, name: "Team Member 5" },
  { id: 6, img: tm6, name: "Team Member 6" },
  { id: 7, img: tm7, name: "Team Member 7" },
  { id: 8, img: tm8, name: "Team Member 8" },
  { id: 9, img: tm9, name: "Team Member 9" },
];

const aboutParagraphs = [
  "Welcome to ObeliskRX, your source for rigorously documented peptides for laboratory and research use. Our mission is simple   give researchers material they can trust, backed by proof, not claims.",
  "Every compound we distribute is sourced from vetted manufacturers and independently tested before it ever reaches you. Each batch is verified by third-party lab analysis, with a certificate of analysis available for review   because in research, verification isn't optional, it's foundational.",
  "Our commitment to transparency extends to how we support you. Our team is responsive and knowledgeable, ready to answer questions about sourcing, testing, and documentation for any product in our catalog.",
  "We prioritize fast, reliable fulfillment so your research timeline stays on track   orders placed before cutoff ship the same day.",
  "ObeliskRX was founded on the belief that the research peptide industry should hold itself to a stricter standard of proof. As the field continues to evolve, we remain committed to documentation-first sourcing and uncompromising quality control on every product we carry.",
  "ObeliskRX is a research-use-only supplier. Our products are intended for laboratory and research applications only, not for human or animal consumption.",
];

export function AboutPage() {
  const [expanded, setExpanded] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // Animation hooks
  const [heroRef, heroVisible] = useStaggerAnimation<HTMLElement>();
  const [contentRef, contentVisible] = useStaggerAnimation<HTMLElement>();
  const [teamRef, teamVisible] = useStaggerAnimation<HTMLElement>();
  const [bottomRef, bottomVisible] = useStaggerAnimation<HTMLElement>();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-8">
      {/* ===== HERO SECTION ===== */}
      <section 
        ref={heroRef}
        className={`bg-[rgb(94,113,128)] py-16 md:py-20 px-4 animate-on-scroll ${heroVisible ? "animate-visible" : ""}`}
      >
        <div className="container-page">
          <h1 className="anim-fade-in-up text-4xl md:text-5xl font-bold text-white mb-6">Who We Are</h1>
          <p className="anim-fade-in-up animate-delay-1 text-white/90 text-base md:text-lg max-w-3xl leading-relaxed">
            Welcome to ObeliskRX, a research-use-only peptide supplier built on a single
            standard: documentation before distribution. We exist to give researchers the verified
            materials they need to move their work forward with confidence.
          </p>
        </div>
      </section>

      {/* ===== BODY CONTENT ===== */}
      <section 
        ref={contentRef}
        className={`max-w-4xl mx-auto py-12 md:py-16 px-4 animate-on-scroll animate-scale ${contentVisible ? "animate-visible" : ""}`}
      >
        <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
          {aboutParagraphs.slice(0, expanded ? undefined : 3).map((para, idx) => (
            <p key={idx} className="anim-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>{para}</p>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-6 inline-flex items-center gap-1 text-xs text-muted-foreground border border-border rounded-full px-4 py-2 hover:border-primary hover:text-primary transition-colors duration-300"
        >
          {expanded ? "Show Less" : "Read More"}
          <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </button>
      </section>

      {/* ===== MEET THE TEAM ===== */}
      <section 
        ref={teamRef}
        className={`container-page pb-16 animate-on-scroll ${teamVisible ? "animate-visible" : ""}`}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2 relative inline-block">
            Meet The Team
            <span className="absolute -bottom-2 left-1/4 h-1 w-1/2 rounded bg-primary" />
          </h2>
          <p className="text-muted-foreground mt-4 text-xs md:text-sm max-w-2xl mx-auto">
            Each member excels both professionally and personally, contributing their unique talents
            to create a harmonious and effective work environment.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {teamMembers.map((member, i) => (
            <div 
              key={member.id} 
              className="flex-shrink-0 group anim-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:border-primary"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ===== BOTTOM CARDS ===== */}
      <section 
        ref={bottomRef}
        className={`container-page pb-16 animate-on-scroll ${bottomVisible ? "animate-visible" : ""}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Video Card */}
          <div className="relative rounded-xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-72 group cursor-pointer shadow-card hover:shadow-card-hover transition-shadow">
            {isVideoOpen ? (
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/hCdF4adrbCA?autoplay=1" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="absolute inset-0"
              />
            ) : (
              <div className="w-full h-full relative" onClick={() => setIsVideoOpen(true)}>
                <img
                  src={vidOpt}
                  alt="How We Start Our Business"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/90 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(233,30,99,0.6)] transition-all duration-300">
                    <Play size={24} className="text-gray-800 ml-1 group-hover:text-primary transition-colors" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 p-6 z-10">
                  <h3 className="text-white text-lg md:text-xl font-semibold">How We Start Our Business</h3>
                </div>
              </div>
            )}
          </div>

          {/* Member Club Card */}
          <div className="relative rounded-xl overflow-hidden bg-primary h-72 flex items-center shadow-card hover:shadow-card-hover transition-shadow hover-glow">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 z-0" />
            <div className="relative z-10 p-8 md:p-10 max-w-[60%]">
              <h3 className="text-white text-xl md:text-2xl font-bold leading-snug">
                Become a Member<br />of the Club
              </h3>
            </div>
            <img
              src={membClub}
              alt="Become a Member"
              className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-top transition-transform duration-700 hover:scale-110 opacity-90 z-10"
            />
          </div>

        </div>
      </section>
    </div>
  );
}
