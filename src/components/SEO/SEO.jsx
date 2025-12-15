import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, canonical, ogImage }) => {
  const siteName = "FH General Equipment";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{fullTitle}</title>

      {description && (
        <meta name="description" content={description} />
      )}

      <meta name="robots" content="index, follow" />

      {canonical && (
        <link rel="canonical" href={canonical} />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:type" content="website" />

      {description && (
        <meta property="og:description" content={description} />
      )}

      {canonical && (
        <meta property="og:url" content={canonical} />
      )}

      {ogImage && (
        <meta property="og:image" content={ogImage} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />

      {description && (
        <meta name="twitter:description" content={description} />
      )}

      {ogImage && (
        <meta name="twitter:image" content={ogImage} />
      )}
    </Helmet>
  );
};

export default SEO;