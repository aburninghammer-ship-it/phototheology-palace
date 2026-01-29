import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface JsonLdData {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  image?: string;
  jsonLd?: JsonLdData | JsonLdData[];
}

const BASE_URL = "https://phototheologybible.com";
const DEFAULT_IMAGE = `${BASE_URL}/phototheology-hero-og.png`;

const organizationJsonLd: JsonLdData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Phototheology",
  url: BASE_URL,
  logo: `${BASE_URL}/pwa-512x512.png`,
  description: "Bible learning suite using the Palace method for Scripture memorization and study.",
  sameAs: []
};

const websiteJsonLd: JsonLdData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Phototheology Bible Learning Suite",
  url: BASE_URL,
  description: "Master Scripture through the 8-floor Palace method."
};

export const SEO = ({
  title = "Phototheology Bible Learning Suite",
  description = "The complete Bible learning suite. Master Scripture through the 8-floor Palace method — store God's Word as images, patterns, and structures with Christ-centered interpretation.",
  canonical,
  noindex = false,
  image = DEFAULT_IMAGE,
  jsonLd
}: SEOProps) => {
  const location = useLocation();
  const canonicalUrl = canonical || `${BASE_URL}${location.pathname}`;
  const fullTitle = title === "Phototheology Bible Learning Suite" ? title : `${title} | Phototheology`;

  const isHome = location.pathname === "/" || location.pathname === "/landing" || location.pathname === "/gatehouse";
  const allJsonLd = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    : isHome
      ? [organizationJsonLd, websiteJsonLd]
      : [];

  const breadcrumbJsonLd: JsonLdData | null = !isHome && location.pathname !== "/" ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: fullTitle, item: canonicalUrl }
    ]
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Phototheology Bible Learning Suite" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {allJsonLd.map((data, i) => (
        <script key={`jsonld-${i}`} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
      {breadcrumbJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
    </Helmet>
  );
};
