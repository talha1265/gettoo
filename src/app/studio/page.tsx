import React from 'react';
import CustomizerStudio from '@/components/CustomizerStudio';

export const metadata = {
  title: 'Custom T-Shirt Embroidery Lab • GETTOO® APPAREL',
  description: 'Design your custom embroidered heavyweight t-shirt. Monograms, custom uploaded vector artwork, 240–280 GSM blanks, and 3D puff stitching.',
};

export default function StudioPage() {
  return (
    <div className="bg-[#F8F8FA] min-h-screen">
      <CustomizerStudio />
    </div>
  );
}

