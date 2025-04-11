
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminNavbar from "@/components/admin/admin-navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings, Users, Database, Shield, Activity, Terminal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function MasterPage() {
  const { toast } = useToast();
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [showPerformanceDialog, setShowPerformanceDialog] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  const { data: systemLogs } = useQuery({
    queryKey: ['systemLogs'],
    queryFn: async () => {
      const response = await fetch('/api/admin/system/logs');
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json();
    },
    enabled: showLogsDialog
  });

  useEffect(() => {
    let interval;
    if (showPerformanceDialog) {
      const fetchMetrics = async () => {
        try {
          const response = await fetch('/api/admin/system/performance');
          if (response.ok) {
            const data = await response.json();
            setPerformanceMetrics(data);
          }
        } catch (error) {
          console.error('Error fetching metrics:', error);
        }
      };
      fetchMetrics();
      interval = setInterval(fetchMetrics, 5000);
    }
    return () => clearInterval(interval);
  }, [showPerformanceDialog]);

  const backupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/system/backup', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to create backup');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Backup do sistema realizado com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao realizar backup do sistema",
        variant: "destructive",
      });
    }
  });

  const maintenanceMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/system/maintenance', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to perform maintenance');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Manutenção realizada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao realizar manutenção",
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
          onClick: () => backupMutation.mutate()
        },
        {
          name: "Logs do Sistema",
          onClick: () => setShowLogsDialog(true)
        },
        {
          name: "Manutenção do Sistema",
          onClick: () => maintenanceMutation.mutate()
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
          onClick: () => setShowPerformanceDialog(true)
        },
        {
          name: "Uso de Recursos",
          onClick: () => setShowPerformanceDialog(true)
        },
        {
          name: "Alertas",
          onClick: () => toast({
            title: "Sistema de Alertas",
            description: "Nenhum alerta crítico no momento",
          })
        }
      ]
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
                      onClick={action.onClick}
                    >
                      {action.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Logs do Sistema</DialogTitle>
            <DialogDescription>
              Histórico de atividades do sistema
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            {systemLogs?.map((log, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded">
                <p className="text-sm">{log.message}</p>
                <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPerformanceDialog} onOpenChange={setShowPerformanceDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Métricas de Performance</DialogTitle>
            <DialogDescription>
              Monitoramento em tempo real dos recursos do sistema
            </DialogDescription>
          </DialogHeader>
          {performanceMetrics && (
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>CPU</span>
                  <span>{performanceMetrics.cpuUsage.toFixed(1)}%</span>
                </div>
                <Progress value={performanceMetrics.cpuUsage} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Memória</span>
                  <span>{performanceMetrics.memoryUsage.toFixed(1)}%</span>
                </div>
                <Progress value={performanceMetrics.memoryUsage} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Disco</span>
                  <span>{performanceMetrics.diskUsage.toFixed(1)}%</span>
                </div>
                <Progress value={performanceMetrics.diskUsage} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold">{performanceMetrics.activeUsers}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Tempo de Resposta</p>
                  <p className="text-2xl font-bold">{performanceMetrics.responseTime.toFixed(0)}ms</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
