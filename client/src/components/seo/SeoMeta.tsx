import { Helmet } from 'react-helmet';

interface SeoMetaProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  imageUrl?: string;
}

export const SeoMeta = ({ 
  title, 
  description = 'Experience the ultimate gaming platform with AiGameBoy. Play games created by leading AI models, compete on leaderboards, and create your own AI-powered games!',
  canonicalUrl = '/',
  imageUrl = 'https://aigameboy.replit.app/aigameboy-og.svg'
}: SeoMetaProps) => {
  const baseTitle = 'AiGameBoy | AI-Powered Gaming Platform';
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`https://aigameboy.replit.app${canonicalUrl}`} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://aigameboy.replit.app${canonicalUrl}`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://aigameboy.replit.app${canonicalUrl}`} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
    </Helmet>
  );
};
