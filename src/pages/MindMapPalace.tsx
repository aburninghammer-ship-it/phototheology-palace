import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { MindMapPalace as MindMapPalaceComponent } from '@/components/mind-map';

export default function MindMapPalacePage() {
  const [searchParams] = useSearchParams();
  const initialText = searchParams.get('text') || '';
  const initialMode = (searchParams.get('mode') as any) || 'scholar';

  return (
    <>
      <Helmet>
        <title>Mind Map Palace - Phototheology</title>
        <meta
          name="description"
          content="Map any text to the 8-floor Phototheology Palace framework. Discover Christ-centered patterns, sanctuary connections, and deeper insights."
        />
      </Helmet>

      {/* Full height container - component handles all layout */}
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-background via-background to-palace-purple/5">
        <MindMapPalaceComponent
          initialText={initialText}
          initialMode={initialMode}
        />
      </div>
    </>
  );
}
