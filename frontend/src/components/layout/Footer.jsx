import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <Leaf className="h-8 w-8 text-primary transition-transform duration-500 group-hover:rotate-12" />
              <span className="text-2xl font-bold text-gray-900 truncate">
                Be-Eco<span className="text-primary">Friendly</span>
              </span>
            </Link>
            <p className="text-gray-600 mb-6">
              Empowering your sustainable journey with curated eco-friendly products for a better tomorrow.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-primary hover:bg-mint rounded-lg transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-primary hover:bg-mint rounded-lg transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-primary hover:bg-mint rounded-lg transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-primary hover:bg-mint rounded-lg transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-gray-800 mb-6 font-primary uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-primary transition-colors font-medium">Shop All</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors font-medium">Our Story</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors font-medium">Contact Us</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-primary transition-colors font-medium">My Account</Link>
              </li>
            </ul>
          </div>

          {/* Site Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-gray-800 mb-6 font-primary uppercase tracking-wider text-sm">Policies</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-primary transition-colors font-medium">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-primary transition-colors font-medium">Return Policy</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors font-medium">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors font-medium">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-gray-800 mb-6 font-primary uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-600">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-sm">123 Green Street, Eco City, EC 12345</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">support@be-ecofriendly.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            © {currentYear} Be-EcoFriendly. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors font-medium">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors font-medium">Terms</a>
            <a href="#" className="hover:text-primary transition-colors font-medium">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
