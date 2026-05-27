import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { ToastProvider } from './ui';

export default function Layout() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-rice-paper">
        <Header />
        <main className="flex-1 pt-16 pb-16 md:pb-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
