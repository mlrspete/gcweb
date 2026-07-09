import { Accordion } from "@/components/ui";
import { faqsContent } from "@/content/faqs";

export function FAQSection() {
  const midpoint = Math.ceil(faqsContent.items.length / 2);
  const columns = [
    faqsContent.items.slice(0, midpoint),
    faqsContent.items.slice(midpoint),
  ];

  return (
    <section
      id="faq"
      className="bg-pearl-white px-5 py-[4.5rem] text-deep-ocean-navy sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[88rem]">
        <h2 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
          {faqsContent.title}
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {columns.map((items, columnIndex) => (
            <Accordion
              key={columnIndex}
              items={items.map((item, index) => ({
                id: `faq-${columnIndex}-${index}`,
                title: item.question,
                content: item.answer,
                number: String(columnIndex * midpoint + index + 1).padStart(
                  2,
                  "0",
                ),
              }))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
