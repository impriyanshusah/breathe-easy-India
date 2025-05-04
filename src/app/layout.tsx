import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Updated import
import { GeistMono } from 'geist/font/mono'; // Updated import
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster


export const metadata: Metadata = {
  title: 'BreatheEasy India', // Update title
  description: 'Check current and predicted Air Quality Index (AQI) for cities in India.', // Update description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
