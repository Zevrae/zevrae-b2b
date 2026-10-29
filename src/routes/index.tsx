import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Hero } from "@/components/zevrae/Hero";
import { Process } from "@/components/zevrae/Process";
import {
  Nav,
  ScrollThread,
  Reveal,
  Capabilities,
  Finale,
  Footer,
} from "@/components/zevrae/Sections";
import { Catalogue } from "@/components/zevrae/Catalogue";
import { Reviews } from "@/components/zevrae/Reviews";
import { QuoteFlow } from "@/components/zevrae/QuoteFlow";
import { ContactModal } from "@/components/zevrae/ContactModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZEVRAE — Follow the Thread | Apparel Manufacturing" },
      {
        name: "description",
        content:
          "ZEVRAE turns ideas into finished, branded garments. Bulk apparel, private label and custom manufacturing for modern brands.",
      },
      { property: "og:title", content: "ZEVRAE — Your Brand. Our Production." },
      {
        property: "og:description",
        content:
          "Custom apparel manufacturing, private label and bulk production for modern brands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const start = () => setOpen(true);
  const contact = () => setContactOpen(true);

  return (
    <main id="top">
      <Nav onStart={start} />
      <ScrollThread />
      <Hero />
      <Process />
      <Reveal onStart={start} />
      <Capabilities />
      <Catalogue />
      <Reviews />
      <Finale onContact={contact} />
      <Footer />
      <QuoteFlow open={open} onClose={() => setOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}
