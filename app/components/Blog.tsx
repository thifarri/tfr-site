import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const blogPosts = [
  {
    title: 'Importância do SPDA em Instalações Elétricas',
    description: 'Entenda como o Sistema de Proteção contra Descargas Atmosféricas protege suas instalações.',
    date: '15 Mai 2026',
    readTime: '5 min'
  },
  {
    title: 'NR12: Segurança em Máquinas e Equipamentos',
    description: 'Conheça as principais diretrizes da norma regulamentadora para automação industrial.',
    date: '10 Mai 2026',
    readTime: '7 min'
  },
  {
    title: 'Cabeamento Estruturado: Boas Práticas',
    description: 'Dicas essenciais para implementar uma infraestrutura de rede eficiente e organizada.',
    date: '05 Mai 2026',
    readTime: '6 min'
  }
];

export function Blog() {
  return (
    <section id="blog" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: '#050A30', color: '#FFFFFF' }}>
            Blog
          </div>
          <h2 className="text-3xl lg:text-5xl mb-4" style={{ color: '#050A30' }}>
            Últimas Publicações
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fique por dentro das novidades e tendências em engenharia elétrica.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Card 
              key={index} 
              className="border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white"
            >
              <CardHeader>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <CardTitle className="group-hover:opacity-80 transition-opacity" style={{ color: '#050A30' }}>
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  {post.description}
                </CardDescription>
                <button className="flex items-center gap-2 hover:gap-3 transition-all" style={{ color: '#050A30' }}>
                  Ler mais
                  <ArrowRight size={16} />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            variant="outline"
            style={{ borderColor: '#050A30', color: '#050A30' }}
            className="hover:bg-gray-50"
          >
            Ver Todos os Artigos
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
}
