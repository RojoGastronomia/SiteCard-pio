import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminNavbar() {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto py-3 gap-2">
          <Link href="/admin/dashboard">
            <Button className={`rounded-full ${window.location.pathname === '/admin/dashboard' ? '' : 'variant-outline'}`}>Dashboard</Button>
          </Link>
          <Link href="/admin/events">
            <Button variant={window.location.pathname === '/admin/events' ? 'default' : 'outline'} className="rounded-full">Eventos</Button>
          </Link>
          <Link href="/admin/users">
            <Button variant={window.location.pathname === '/admin/users' ? 'default' : 'outline'} className="rounded-full">Usuários</Button>
          </Link>
          <Link href="/admin/menus">
            <Button variant={window.location.pathname === '/admin/menus' ? 'default' : 'outline'} className="rounded-full">Cardápios</Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant={window.location.pathname === '/admin/orders' ? 'default' : 'outline'} className="rounded-full">Pedidos</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}