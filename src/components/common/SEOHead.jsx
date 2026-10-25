import { useEffect } from 'react';

const SITE_NAME = 'axiscaculator';
const SITE_URL = 'https://axiscaculator.com'; // Production domain representation

/**
 * SEOHead component updates the document title, meta description, canonical URL,
 * Open Graph tags, and structured data dynamically.
 */
export function SEOHead({
  title,
  description,
  canonicalPath = '',
  schema = null,
}) {
  const schemaString = schema ? JSON.stringify(schema) : null;

  useEffect(() => {
    // 1. Update Title
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 3. Update Canonical Link
    const canonicalHref = `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalHref;

    // 4. Update Open Graph Tags
    const updateOg = (property, content) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.content = content;
    };

    updateOg('og:title', fullTitle);
    updateOg('og:description', description);
    updateOg('og:url', canonicalHref);
    updateOg('og:site_name', SITE_NAME);
    updateOg('og:type', 'website');

    // 5. Update Structured Data (Schema.org JSON-LD)
    let schemaScript = document.getElementById('seo-json-ld');
    if (schemaString) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'seo-json-ld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = schemaString;
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, canonicalPath, schemaString]);

  return null;
}
