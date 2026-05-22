import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section id="home" className="pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 rounded-full mb-6" style={{ backgroundColor: '#050A30', color: '#FFFFFF' }}>
              Atuação em todo território nacional
            </div>
            <h2 className="text-4xl lg:text-6xl mb-6" style={{ color: '#050A30' }}>
              Soluções em Engenharia Elétrica
            </h2>
            <p className="text-lg lg:text-xl mb-8 text-gray-600">
              Desenvolvemos projetos elétricos completos com excelência técnica e segurança, atendendo residências, indústrias e empresas em todo o Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                style={{ backgroundColor: '#050A30' }}
                className="hover:opacity-90 text-lg"
              >
                Solicitar Orçamento
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                style={{ borderColor: '#050A30', color: '#050A30' }}
                className="hover:bg-gray-50 text-lg"
              >
                Nossos Serviços
              </Button>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-md lg:max-w-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1542621334-a254cf47733d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwZW5naW5lZXJpbmclMjBwcm9qZWN0JTIwYmx1ZXByaW50JTIwcGxhbnN8ZW58MXx8fHwxNzc5NDcwNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Projetos de engenharia elétrica"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
