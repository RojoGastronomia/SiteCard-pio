import { Link } from "wouter";
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-['Pacifico'] text-2xl text-primary">Rojo Gastronomia</span>
            </Link>
            <p className="text-gray-600 mt-2 text-sm">Soluções gastronômicas para todos os tipos de eventos</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Sobre</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Nossa História</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Equipe</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Sustentabilidade</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Serviços</h3>
              <ul className="space-y-2">
                <li><Link href="/events" className="text-gray-600 hover:text-gray-900 text-sm">Eventos Corporativos</Link></li>
                <li><Link href="/events" className="text-gray-600 hover:text-gray-900 text-sm">Casamentos</Link></li>
                <li><Link href="/events" className="text-gray-600 hover:text-gray-900 text-sm">Aniversários</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Contato</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600 text-sm">
                  <MapPin className="mr-2" size={16} />
                  Av. Paulista, 1000 - São Paulo
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <Phone className="mr-2" size={16} />
                  (11) 99999-9999
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <Mail className="mr-2" size={16} />
                  contato@rojogastronomia.com
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2023 Rojo Gastronomia. Todos os direitos reservados.</p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
