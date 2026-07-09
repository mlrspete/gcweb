import { siteContent } from "@/content/site";

const footerLinks = [
  { label: "Pricing", href: "#pricing" },
  { label: "Compliance", href: "#compliance" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Refund Policy", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="bg-deep-ocean-navy px-5 py-10 text-pearl-white sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 border-t border-pearl-white/[0.12] pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-extrabold">{siteContent.wordmark}</p>
          <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-clear-water-blue/75">
            Compliance-first local visibility campaigns built around genuine
            experiences and honest feedback.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-pearl-white/[0.78]">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-seafoam">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
