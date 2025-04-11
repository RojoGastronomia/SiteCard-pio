import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

export default function AdminNavbar() {
  const [location] = useLocation();

  return (
    <>
      <Navbar />
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 gap-2">
            <Link href="/admin/dashboard">
              <Button variant={location === '/admin/dashboard' ? 'default' : 'outline'} className="rounded-full">Dashboard</Button>
            </Link>
            <Link href="/admin/events">
              <Button variant={location === '/admin/events' ? 'default' : 'outline'} className="rounded-full">Eventos</Button>
            </Link>
            <Link href="/admin/users">
              <Button variant={location === '/admin/users' ? 'default' : 'outline'} className="rounded-full">Usuários</Button>
            </Link>
            <Link href="/admin/menus">
              <Button variant={location === '/admin/menus' ? 'default' : 'outline'} className="rounded-full">Cardápios</Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant={location === '/admin/orders' ? 'default' : 'outline'} className="rounded-full">Pedidos</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}