import type { Metadata } from 'next';
import './globals.css';
import { AtelierProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import ToastContainer from '@/components/ToastContainer';

export const metadata: Metadata = {
  title: 'GETTOO® APPAREL • Heavyweight Tees & Custom Embroidery Lab',
  description: 'Engineered 240–280 GSM heavyweight streetwear t-shirts. Custom high-density embroidery, boxy drop-shoulder fits, and limited archival drops. 100% prepaid PayU checkout.',
  keywords: 'heavyweight t-shirt, 280 gsm t-shirt, streetwear tees, custom embroidery t-shirt, boxy fit tee, puff print embroidery, PayU apparel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#F8F8FA] text-[#0A0A0C] min-h-screen flex flex-col antialiased selection:bg-[#CCFF00] selection:text-black">
        <AtelierProvider>
          <Navbar />
          <main className="flex-1 pb-16 lg:pb-0">
            {children}
          </main>
          <Footer />
          <MobileNav />
          <CartDrawer />
          <WishlistDrawer />
          <ToastContainer />
        </AtelierProvider>
      </body>
    </html>
  );
}

