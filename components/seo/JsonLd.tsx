type JsonLdProps = {
  data: Record<string, unknown>;
};

function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
