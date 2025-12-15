import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
}) => {
  const siteName = "FH General Equipment";
  const fullTitle = title
    ? `${title} | ${siteName}`
    : siteName;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{fullTitle}</title>
      {description && (
        <meta name="description" content={description} />
      )}
      {keywords && (
        <meta name="keywords" content={keywords} />
      )}
      {canonical && (
        <link rel="canonical" href={canonical} />
      )}

      {/* Open Graph (Social Preview) */}
      <meta property="og:title" content={fullTitle} />
      <meta
        property="og:description"
        content={description}
      />
      <meta property="og:type" content="website" />
      {canonical && (
        <meta property="og:url" content={canonical} />
      )}
      {ogImage && (
        <meta property="og:image" content={ogImage} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta
        name="twitter:description"
        content={description}
      />
      {ogImage && (
        <meta name="twitter:image" content={ogImage} />
      )}
    </Helmet>
  );
};

export default SEO;
