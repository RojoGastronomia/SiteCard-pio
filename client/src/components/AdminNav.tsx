import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function AdminNav() {
  const { role } = useAuth();

  if (role !== "Administrador") {
    return null;
  }

  return (
    <nav className="bg-primary/10 p-4 mb-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-3 text-primary">Painel Administrativo</h2>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/dashboard">
          <a className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors">
            Dashboard
          </a>
        </Link>
        <Link href="/admin/events">
          <a className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors">
            Gerenciar Eventos
          </a>
        </Link>
        <Link href="/admin/orders">
          <a className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors">
            Gerenciar Pedidos
          </a>
        </Link>
        <Link href="/admin/menus">
          <a className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors">
            Gerenciar Cardápios
          </a>
        </Link>
        <Link href="/admin/users">
          <a className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors">
            Gerenciar Usuários
          </a>
        </Link>
        <Link href="/admin/master">
          <a className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors">
            Configurações Master
          </a>
        </Link>
      </div>
    </nav>
  );
} 