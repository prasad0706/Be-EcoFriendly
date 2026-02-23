import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 md:pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 mb-12">
          {/* Brand */}
          <div className="col-span-1 text-center md:text-left">
            <Link to="/" className="flex items-center justify-center md:justify-start space-x-2 mb-6 group">
              <Leaf className="h-7 w-7 text-primary transition-transform duration-500 group-hover:rotate-12" />
              <span className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter">
                Be-<span className="text-primary italic">EcoFriendly</span>
              </span>
            </Link>
            <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-8 max-w-xs mx-auto md:mx-0">
              Curated essentials for a sustainable lifestyle. Performance meets eco-consciousness.
            </p>
            <div className="flex justify-center md:justify-start space-x-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 bg-gray-50 text-gray-400 hover:text-white hover:bg-primary rounded-xl transition-all border border-transparent hover:border-primary/20">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 text-center md:text-left">
            <h3 className="font-black text-gray-900 mb-6 uppercase tracking-[0.2em] text-[10px]">Explorer</h3>
            <ul className="space-y-4">
              {[
                { name: 'Shop All', path: '/shop' },
                { name: 'Sustainability', path: '/sustainability' },
                { name: 'Daily Deals', path: '/deals' },
                { name: 'Community', path: '/community' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-[10px] md:text-xs font-bold text-gray-500 hover:text-primary transition-all uppercase tracking-widest flex items-center justify-center md:justify-start gap-2 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="col-span-1 text-center md:text-left">
            <h3 className="font-black text-gray-900 mb-6 uppercase tracking-[0.2em] text-[10px]">Support</h3>
            <ul className="space-y-4">
              {['Shipping', 'Returns', 'Privacy', 'Compliance'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-[10px] md:text-xs font-bold text-gray-500 hover:text-primary transition-all uppercase tracking-widest flex items-center justify-center md:justify-start gap-2 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 text-center md:text-left">
            <h3 className="font-black text-gray-900 mb-6 uppercase tracking-[0.2em] text-[10px]">Connect</h3>
            <ul className="space-y-5">
              <li className="flex flex-col md:flex-row items-center md:items-start md:space-x-3 text-gray-500">
                <MapPin className="h-4 w-4 text-primary md:mt-0.5 shrink-0 mb-2 md:mb-0" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Global HQ, Eco City, 101</span>
              </li>
              <li className="flex flex-col md:flex-row items-center md:items-start md:space-x-3 text-gray-500">
                <Mail className="h-4 w-4 text-primary md:mt-0.5 shrink-0 mb-2 md:mb-0" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">hello@be-ecofriendly.live</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            © {currentYear} Be-ecofriendly Collective. No Carbon Left Behind.
          </p>
          <div className="flex space-x-8 text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-primary transition-colors">Digital Integrity</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Core</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
