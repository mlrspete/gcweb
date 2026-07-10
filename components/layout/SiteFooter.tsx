import { reviewSystemContent } from "@/content/reviewSystem";
import { siteContent } from "@/content/site";

const footerContent = reviewSystemContent.footer;

export function SiteFooter() {
  return (
    <footer
      data-site-footer
      className="bg-deep-ocean-navy px-5 py-10 text-pearl-white sm:px-8 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-8 border-t border-pearl-white/[0.12] pt-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-extrabold">{siteContent.wordmark}</p>
          <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-clear-water-blue/75">
            {footerContent.positioning}
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-pearl-white/[0.78]"
          aria-label="Footer"
        >
          {footerContent.links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-seafoam">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-[88rem] text-xs font-semibold leading-6 text-clear-water-blue/60">
        {footerContent.bottomComplianceLine}
      </p>
    </footer>
  );
}
