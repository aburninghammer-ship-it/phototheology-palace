import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { PalaceAudioTour } from '@/components/palace/PalaceAudioTour';

export default function PalaceTour() {
  return (
    <>
      <Helmet>
        <title>Tour the Palace - Phototheology</title>
        <meta name="description" content="Take a guided audio tour of the Phototheology Palace. Reginald explains each room while Jeeves applies the principles to Scripture." />
      </Helmet>
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PalaceAudioTour />
      </div>
    </>
  );
}
