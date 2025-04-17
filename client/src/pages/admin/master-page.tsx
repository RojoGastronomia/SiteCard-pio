import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings, Shield, Database, Activity, Terminal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Define interface for performance data
interface PerformanceData {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export default function MasterPage() {
  const { toast } = useToast();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Queries para monitoramento em tempo real
  const { data: performance } = useQuery<PerformanceData>({
    queryKey: ["/api/admin/system/performance"],
    refetchInterval: 3000,
    initialData: { cpuUsage: 0, memoryUsage: 0, diskUsage: 0 }
  });

  // Mutation genérica para ações que não retornam dados
  const actionMutation = useMutation({
    mutationFn: async (endpoint: string) => {
      const response = await fetch(endpoint, { method: "POST" });
      if (!response.ok) throw new Error("Erro na operação");
      return response.json();
    },
    onSuccess: (_, endpoint) => {
      toast({
        title: "Sucesso",
        description: `Operação realizada com sucesso!`,
      });
      setSelectedAction(null);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const modules = [
    {
      title: "Gerenciamento de Sistema",
      icon: <Settings className="w-8 h-8 text-primary" />,
      description: "Configurações avançadas do sistema",
      actions: [
        {
          name: "Backup do Sistema",
          handler: () => actionMutation.mutate("/api/admin/system/backup")
        },
        {
          name: "Logs do Sistema",
          handler: () => setSelectedAction("logs")
        },
        {
          name: "Configurações Globais",
          handler: () => setSelectedAction("settings")
        }
      ]
    },
    {
      title: "Controle de Acesso",
      icon: <Shield className="w-8 h-8 text-primary" />,
      description: "Gestão de permissões e acessos",
      actions: [
        {
          name: "Permissões",
          handler: () => setSelectedAction("permissions")
        },
        {
          name: "Roles",
          handler: () => setSelectedAction("roles")
        },
        {
          name: "Tokens de API",
          handler: () => setSelectedAction("tokens")
        }
      ]
    },
    {
      title: "Banco de Dados",
      icon: <Database className="w-8 h-8 text-primary" />,
      description: "Administração do banco de dados",
      actions: [
        {
          name: "Backup",
          handler: () => actionMutation.mutate("/api/admin/database/backup")
        },
        {
          name: "Otimização",
          handler: () => actionMutation.mutate("/api/admin/database/optimize")
        },
        {
          name: "Manutenção",
          handler: () => actionMutation.mutate("/api/admin/database/maintenance")
        }
      ]
    },
    {
      title: "Monitoramento",
      icon: <Activity className="w-8 h-8 text-primary" />,
      description: "Métricas e desempenho do sistema",
      actions: [
        {
          name: "Performance",
          handler: () => setSelectedAction("performance")
        },
        {
          name: "Uso de Recursos",
          handler: () => setSelectedAction("resources")
        },
        {
          name: "Alertas",
          handler: () => setSelectedAction("alerts")
        }
      ]
    },
    {
      title: "Ferramentas Avançadas",
      icon: <Terminal className="w-8 h-8 text-primary" />,
      description: "Ferramentas administrativas avançadas",
      actions: [
        {
          name: "Console",
          handler: () => setSelectedAction("console")
        },
        {
          name: "Cache",
          handler: () => setSelectedAction("cache")
        },
        {
          name: "Indexação",
          handler: () => actionMutation.mutate("/api/admin/tools/indexing")
        }
      ]
    }
  ];

  return (
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
                    onClick={action.handler}
                    disabled={isLoading}
                  >
                    {action.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Diálogo para exibir informações detalhadas */}
      <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAction && selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedAction === "performance" && performance && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>CPU</span>
                    <span>{Math.round(performance.cpuUsage)}%</span>
                  </div>
                  <Progress value={performance.cpuUsage} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Memória</span>
                    <span>{Math.round(performance.memoryUsage)}%</span>
                  </div>
                  <Progress value={performance.memoryUsage} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Disco</span>
                    <span>{Math.round(performance.diskUsage)}%</span>
                  </div>
                  <Progress value={performance.diskUsage} />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
