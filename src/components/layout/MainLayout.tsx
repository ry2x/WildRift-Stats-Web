import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white  transition-colors">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
