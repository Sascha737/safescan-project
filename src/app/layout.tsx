import './globals.css';
import Header from '../components/Header';
import Providers from '../components/Providers';

export const metadata = {
  title: 'SafeScan',
  description: 'A beginner-friendly web security scanner',
};

// App layout with header and providers
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Providers>
          <Header />
          <main className="p-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

