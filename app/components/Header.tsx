import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold" style={{ color: '#050A30' }}>
              TFR Projetos
            </h1>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="hover:opacity-70 transition-opacity" style={{ color: '#050A30' }}>
              Início
            </a>
            <a href="#servicos" className="hover:opacity-70 transition-opacity" style={{ color: '#050A30' }}>
              Serviços
            </a>
            <a href="#sobre" className="hover:opacity-70 transition-opacity" style={{ color: '#050A30' }}>
              Sobre
            </a>
            <a href="#blog" className="hover:opacity-70 transition-opacity" style={{ color: '#050A30' }}>
              Blog
            </a>
            <Button 
              style={{ backgroundColor: '#050A30' }}
              className="hover:opacity-90"
            >
              Orçamento
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: '#050A30' }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <a 
                href="#home" 
                className="py-2 hover:opacity-70 transition-opacity" 
                style={{ color: '#050A30' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </a>
              <a 
                href="#servicos" 
                className="py-2 hover:opacity-70 transition-opacity" 
                style={{ color: '#050A30' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </a>
              <a 
                href="#sobre" 
                className="py-2 hover:opacity-70 transition-opacity" 
                style={{ color: '#050A30' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </a>
              <a 
                href="#blog" 
                className="py-2 hover:opacity-70 transition-opacity" 
                style={{ color: '#050A30' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </a>
              <Button 
                style={{ backgroundColor: '#050A30' }}
                className="hover:opacity-90 w-full"
              >
                Orçamento
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
