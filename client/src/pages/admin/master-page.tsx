
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminNavbar from "@/components/admin/admin-navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings, Users, Database, Shield, Activity, Terminal } from "lucide-react";

export default function MasterPage() {
  const { toast } = useToast();

  const modules = [
    {
      title: "Gerenciamento de Sistema",
      icon: <Settings className="w-8 h-8 text-primary" />,
      description: "Configurações avançadas do sistema",
      actions: ["Backup do Sistema", "Logs do Sistema", "Configurações Globais"]
    },
    {
      title: "Controle de Acesso",
      icon: <Shield className="w-8 h-8 text-primary" />,
      description: "Gestão de permissões e acessos",
      actions: ["Permissões", "Roles", "Tokens de API"]
    },
    {
      title: "Banco de Dados",
      icon: <Database className="w-8 h-8 text-primary" />,
      description: "Administração do banco de dados",
      actions: ["Backup", "Otimização", "Manutenção"]
    },
    {
      title: "Monitoramento",
      icon: <Activity className="w-8 h-8 text-primary" />,
      description: "Métricas e desempenho do sistema",
      actions: ["Performance", "Uso de Recursos", "Alertas"]
    },
    {
      title: "Ferramentas Avançadas",
      icon: <Terminal className="w-8 h-8 text-primary" />,
      description: "Ferramentas administrativas avançadas",
      actions: ["Console", "Cache", "Indexação"]
    }
  ];

  return (
    <>
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Painel Master</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {module.icon}
                  <div>
                    <CardTitle>{module.title}</CardTitle>
                    <p className="text-sm text-gray-500">{module.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        toast({
                          title: "Ação em desenvolvimento",
                          description: `A funcionalidade "${action}" será implementada em breve.`,
                        });
                      }}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
