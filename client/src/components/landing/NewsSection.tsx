
import React, { useState } from 'react';
import { Share2, X, Link as LinkIcon, Twitter, Linkedin, Mail, Calendar, ArrowRight } from 'lucide-react';

interface Article {
  id: string;
  image: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
}

// --- Share Modal Component ---
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, article }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const handleShare = (platform: 'twitter' | 'linkedin' | 'email') => {
    const text = encodeURIComponent(article.title);
    const url = encodeURIComponent(article.url);

    let link = '';
    switch (platform) {
      case 'twitter':
        link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        link = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        link = `mailto:?subject=${text}&body=Mira esta noticia de Treevü: ${url}`;
        break;
    }
    window.open(link, '_blank');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(article.url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up" onClick={onClose}>
      <div className="bg-treevu-surface border border-treevu-active rounded-2xl w-full max-w-md p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-display font-bold text-white mb-2">Compartir Noticia</h3>
        <p className="text-sm text-gray-400 mb-6">"{article.title}"</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => handleShare('twitter')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] border border-white/10 transition-all text-gray-300 font-medium"
          >
            <Twitter className="w-4 h-4" /> Twitter
          </button>
          <button 
            onClick={() => handleShare('linkedin')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-[#0A66C2]/20 hover:text-[#0A66C2] border border-white/10 transition-all text-gray-300 font-medium"
          >
            <Linkedin className="w-4 h-4" /> LinkedIn
          </button>
          <button 
            onClick={() => handleShare('email')}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-gray-700 border border-white/10 transition-all text-gray-300 font-medium"
          >
            <Mail className="w-4 h-4" /> Email
          </button>
          <button 
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all font-medium ${copied ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/50' : 'bg-white/5 hover:bg-gray-700 text-gray-300 border-white/10'}`}
          >
            <LinkIcon className="w-4 h-4" /> {copied ? '¡Copiado!' : 'Copiar Link'}
          </button>
        </div>

        <div className="bg-treevu-base p-3 rounded-lg border border-treevu-active flex items-center justify-between">
           <span className="text-xs text-gray-500 truncate mr-2">{article.url}</span>
        </div>
      </div>
    </div>
  );
};

// --- News Card Component ---
interface NewsCardProps {
  article: Article;
  onShare: (article: Article) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onShare }) => {
  return (
    <div className="group bg-treevu-surface rounded-2xl border border-treevu-active overflow-hidden hover:border-brand-primary/30 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">{article.category}</span>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            onShare(article);
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-treevu-surface/90 hover:bg-brand-primary hover:text-treevu-base flex items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all shadow-lg"
          aria-label="Compartir"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{article.date}</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">
          {article.title}
        </h3>
        
        <p className="text-sm text-treevu-muted mb-6 line-clamp-3 flex-1">
          {article.excerpt}
        </p>
        
        <a href={article.url} className="inline-flex items-center text-sm font-bold text-white hover:text-brand-primary transition-colors">
          Leer artículo <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

// --- Main News Section ---
const NewsSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const news: Article[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80',
      category: 'Fintech Trends',
      date: '12 Oct, 2023',
      title: 'El fin del "Payday Loan": Por qué el salario on-demand es el futuro',
      excerpt: 'Analizamos cómo las empresas líderes están adoptando el EWA (Earned Wage Access) para eliminar el estrés financiero de sus colaboradores sin afectar su flujo de caja.',
      url: 'https://treevu.app/blog/fin-payday-loan'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      category: 'Bienestar Laboral',
      date: '28 Sep, 2023',
      title: 'Reporte 2024: La correlación entre salud financiera y productividad',
      excerpt: 'Un estudio de Treevü Insights revela que el 45% de la rotación laboral en Retail se debe a problemas de liquidez a corto plazo.',
      url: 'https://treevu.app/blog/reporte-2024'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
      category: 'Treevü News',
      date: '15 Sep, 2023',
      title: 'Treevü levanta ronda Seed para expandir su IA en México y Perú',
      excerpt: 'Con el respaldo de VCs regionales, aceleramos el desarrollo de nuestro motor "Cognitive Core" para predecir riesgos de fuga con un 85% de precisión.',
      url: 'https://treevu.app/news/seed-round'
    }
  ];

  return (
    <section className="py-24 bg-treevu-base border-t border-treevu-active relative">
       {/* Background Glow */}
       <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-primary opacity-[0.02] rounded-full blur-[128px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-brand-primary font-semibold tracking-widest uppercase text-xs mb-2 block">
              Treevü Insights
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Novedades & Educación
            </h2>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full hover:bg-white/5">
            Ver todo el blog <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((article) => (
            <NewsCard 
              key={article.id} 
              article={article} 
              onShare={(a) => setSelectedArticle(a)} 
            />
          ))}
        </div>
        
        <div className="mt-8 md:hidden text-center">
            <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors border border-white/10 px-6 py-3 rounded-full hover:bg-white/5">
                Ver todo el blog <ArrowRight className="w-4 h-4" />
            </a>
        </div>
      </div>

      <ShareModal 
        isOpen={!!selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
        article={selectedArticle} 
      />
    </section>
  );
};

export default NewsSection;
