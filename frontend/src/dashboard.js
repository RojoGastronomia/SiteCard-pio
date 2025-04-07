// Dashboard functionality
import api, { authService, menuService, eventService } from './services/api.js';
import axios from 'axios';

class DashboardPage {
  constructor() {
    this.eventos = [];
    this.filtroAtual = 'ativos';
    this.categorias = ['Festival Gastronômico', 'Curso Culinário', 'Degustação', 'Jantar Especial'];
    this.dadosMes = {
      'Jan': {}, 'Fev': {}, 'Mar': {}, 'Abr': {}, 'Mai': {}, 'Jun': {},
    };
  }

  async init() {
    try {
      // Inicializar o dashboard
      await this.carregarDados();
      this.setupEventListeners();
      this.initChart();
    } catch (error) {
      console.error('Erro ao inicializar o dashboard:', error);
      alert('Erro ao carregar dados. Por favor, tente novamente mais tarde.');
    }
  }

  async carregarDados() {
    try {
      // Simular dados da API para eventos
      // Em produção, substituir por chamadas reais à API
      const response = await axios.get('/api/eventos');
      this.eventos = response.data || this.getDadosSimulados();

      // Atualizar estatísticas
      this.atualizarEstatisticas();
      
      // Renderizar lista de eventos
      this.renderizarListaEventos();
      
      // Renderizar próximos eventos
      this.renderizarProximosEventos();
      
      // Preparar dados para o gráfico
      this.prepararDadosGrafico();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      
      // Usar dados simulados em caso de erro
      this.eventos = this.getDadosSimulados();
      
      // Atualizar com dados simulados
      this.atualizarEstatisticas();
      this.renderizarListaEventos();
      this.renderizarProximosEventos();
      this.prepararDadosGrafico();
    }
  }

  getDadosSimulados() {
    // Gerar dados simulados para desenvolvimento
    return [
      {
        id: 1,
        titulo: 'Festival Gastronômico',
        descricao: 'Um festival gastronômico incrível com os melhores chefs nacionais e internacionais.',
        data: '2024-06-25T19:00:00',
        local: 'Parque Municipal',
        imagem: 'https://public.readdy.ai/ai/img_res/efd31c48395c27fc337b9c0d3e5c2d90.jpg',
        categoria: 'Festival Gastronômico',
        status: 'ativo',
        participantes: 500,
        capacidade: 1000,
        organizador: 'Produções Culturais SA',
        itens: [
          { nome: 'Ingresso VIP', preco: 250.00 },
          { nome: 'Área Lounge', preco: 150.00 },
          { nome: 'Kit Festa', preco: 80.00 }
        ]
      },
      {
        id: 2,
        titulo: 'Workshop de Comida Italiana',
        descricao: 'Aprenda a fazer massas e molhos autênticos com chefs especializados.',
        data: '2024-06-28T14:00:00',
        local: 'Centro Gastronômico',
        imagem: 'https://public.readdy.ai/ai/img_res/31469430d4bd36f73fd76bd0cf151557.jpg',
        categoria: 'Curso Culinário',
        status: 'pendente',
        participantes: 25,
        capacidade: 30,
        organizador: 'Escola de Culinária Mediterrânea',
        itens: [
          { nome: 'Ingresso Básico', preco: 120.00 },
          { nome: 'Kit de Utensílios', preco: 80.00 }
        ]
      },
      {
        id: 3,
        titulo: 'Cinema ao Ar Livre com Gastronomia',
        descricao: 'Uma experiência única de cinema com menu especial preparado por chefs renomados.',
        data: '2024-06-30T20:00:00',
        local: 'Jardim Botânico',
        imagem: 'https://public.readdy.ai/ai/img_res/5e31bc48395c27fc337b9c0d3e5c2d9f.jpg',
        categoria: 'Jantar Especial',
        status: 'ativo',
        participantes: 150,
        capacidade: 200,
        organizador: 'Cinema Gourmet',
        itens: [
          { nome: 'Ingresso Premium', preco: 180.00 },
          { nome: 'Menu Degustação', preco: 120.00 },
          { nome: 'Taça de Vinho', preco: 50.00 }
        ]
      },
      {
        id: 4,
        titulo: 'Degustação de Vinhos',
        descricao: 'Degustação de vinhos finos acompanhados de queijos selecionados.',
        data: '2024-07-05T19:00:00',
        local: 'Vinícola Central',
        imagem: 'https://public.readdy.ai/ai/img_res/afc31c48395c27fc337b9c0d3e5c2d76.jpg',
        categoria: 'Degustação',
        status: 'ativo',
        participantes: 40,
        capacidade: 50,
        organizador: 'Associação de Sommeliers',
        itens: [
          { nome: 'Entrada Padrão', preco: 100.00 },
          { nome: 'Kit Degustação Premium', preco: 150.00 }
        ]
      },
      {
        id: 5,
        titulo: 'Festival de Comida de Rua',
        descricao: 'O melhor da gastronomia de rua em um só lugar.',
        data: '2024-07-10T12:00:00',
        local: 'Praça Central',
        imagem: 'https://public.readdy.ai/ai/img_res/efd31c48395c27fc337b9c0d3e5c2d90.jpg',
        categoria: 'Festival Gastronômico',
        status: 'pendente',
        participantes: 800,
        capacidade: 2000,
        organizador: 'Associação de Food Trucks',
        itens: [
          { nome: 'Passaporte Gastronômico', preco: 90.00 },
          { nome: 'Ticket VIP', preco: 150.00 }
        ]
      }
    ];
  }

  atualizarEstatisticas() {
    // Atualizar contador de eventos
    document.getElementById('totalEventos').textContent = this.eventos.length;
    
    // Calcular total de participantes
    const totalParticipantes = this.eventos.reduce((total, evento) => total + evento.participantes, 0);
    document.getElementById('totalParticipantes').textContent = totalParticipantes;
    
    // Contar eventos do mês atual
    const hoje = new Date();
    const eventosMes = this.eventos.filter(evento => {
      const dataEvento = new Date(evento.data);
      return dataEvento.getMonth() === hoje.getMonth() && dataEvento.getFullYear() === hoje.getFullYear();
    }).length;
    
    document.getElementById('eventosMes').textContent = eventosMes;
  }

  renderizarListaEventos() {
    const listaEventos = document.getElementById('listaEventos');
    listaEventos.innerHTML = '';
    
    // Filtrar eventos de acordo com o filtro atual
    const eventosFiltrados = this.filtrarEventos(this.eventos, this.filtroAtual);
    
    if (eventosFiltrados.length === 0) {
      listaEventos.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">Nenhum evento encontrado com os filtros atuais.</div>';
      return;
    }
    
    // Renderizar cada evento
    eventosFiltrados.forEach(evento => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg border border-gray-200 overflow-hidden';
      
      // Formatar data
      const dataEvento = new Date(evento.data);
      const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(dataEvento);
      
      // Definir classe e texto de acordo com o status
      let statusClass = '';
      switch (evento.status) {
        case 'ativo':
          statusClass = 'bg-green-100 text-green-800';
          break;
        case 'pendente':
          statusClass = 'bg-yellow-100 text-yellow-800';
          break;
        case 'concluido':
          statusClass = 'bg-gray-100 text-gray-800';
          break;
        default:
          statusClass = 'bg-blue-100 text-blue-800';
      }
      
      card.innerHTML = `
        <img src="${evento.imagem}" class="w-full h-48 object-cover" alt="${evento.titulo}">
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900">${evento.titulo}</h3>
          <div class="mt-2 flex items-center text-sm text-gray-500">
            <i class="ri-calendar-line mr-2"></i>
            ${dataFormatada}
          </div>
          <div class="mt-2 flex items-center text-sm text-gray-500">
            <i class="ri-map-pin-line mr-2"></i>
            ${evento.local}
          </div>
          <div class="mt-2 flex items-center text-sm text-gray-500">
            <i class="ri-user-line mr-2"></i>
            ${evento.participantes}/${evento.capacidade} participantes
          </div>
          <div class="mt-4 flex justify-between items-center">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
              ${evento.status.charAt(0).toUpperCase() + evento.status.slice(1)}
            </span>
            <button data-id="${evento.id}" class="verDetalhes !rounded-button bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90 cursor-pointer whitespace-nowrap">
              Ver Detalhes
            </button>
          </div>
        </div>
      `;
      
      listaEventos.appendChild(card);
    });
    
    // Adicionar evento de clique nos botões de detalhes
    document.querySelectorAll('.verDetalhes').forEach(btn => {
      btn.addEventListener('click', () => {
        const eventoId = parseInt(btn.getAttribute('data-id'));
        this.mostrarDetalhesEvento(eventoId);
      });
    });
  }

  renderizarProximosEventos() {
    const container = document.getElementById('proximosEventosContainer');
    container.innerHTML = '';
    
    // Ordenar eventos por data
    const hoje = new Date();
    const proximos = this.eventos
      .filter(evento => new Date(evento.data) >= hoje)
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .slice(0, 3); // Limitar a 3 próximos eventos
    
    if (proximos.length === 0) {
      container.innerHTML = '<div class="text-center py-4 text-gray-500">Nenhum evento próximo encontrado.</div>';
      return;
    }
    
    proximos.forEach(evento => {
      // Formatar data
      const dataEvento = new Date(evento.data);
      const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(dataEvento);
      
      // Definir ícone de acordo com a categoria
      let icone = 'ri-restaurant-line';
      if (evento.categoria === 'Curso Culinário') {
        icone = 'ri-book-open-line';
      } else if (evento.categoria === 'Degustação') {
        icone = 'ri-goblet-line';
      } else if (evento.categoria === 'Jantar Especial') {
        icone = 'ri-restaurant-2-line';
      }
      
      // Definir classe para o status
      let statusClass = '';
      switch (evento.status) {
        case 'ativo':
          statusClass = 'bg-green-100 text-green-800';
          break;
        case 'pendente':
          statusClass = 'bg-yellow-100 text-yellow-800';
          break;
        default:
          statusClass = 'bg-blue-100 text-blue-800';
      }
      
      const eventoElement = document.createElement('div');
      eventoElement.className = 'flex items-center space-x-4';
      eventoElement.innerHTML = `
        <div class="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg">
          <i class="${icone} text-primary"></i>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-medium text-gray-900">${evento.titulo}</h4>
          <p class="text-sm text-gray-500">${dataFormatada}</p>
        </div>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
          ${evento.status.charAt(0).toUpperCase() + evento.status.slice(1)}
        </span>
      `;
      
      container.appendChild(eventoElement);
    });
  }

  prepararDadosGrafico() {
    // Preparar dados para o gráfico por categoria
    // Esta é uma simulação - em produção, esses dados viriam da API
    
    // Reset dados do mês
    Object.keys(this.dadosMes).forEach(mes => {
      this.dadosMes[mes] = {};
      this.categorias.forEach(categoria => {
        this.dadosMes[mes][categoria] = 0;
      });
    });
    
    // Populando dados simulados para o gráfico
    this.dadosMes['Jan']['Festival Gastronômico'] = 12;
    this.dadosMes['Jan']['Curso Culinário'] = 8;
    this.dadosMes['Jan']['Degustação'] = 6;
    this.dadosMes['Jan']['Jantar Especial'] = 4;
    
    this.dadosMes['Fev']['Festival Gastronômico'] = 15;
    this.dadosMes['Fev']['Curso Culinário'] = 10;
    this.dadosMes['Fev']['Degustação'] = 8;
    this.dadosMes['Fev']['Jantar Especial'] = 6;
    
    this.dadosMes['Mar']['Festival Gastronômico'] = 18;
    this.dadosMes['Mar']['Curso Culinário'] = 12;
    this.dadosMes['Mar']['Degustação'] = 9;
    this.dadosMes['Mar']['Jantar Especial'] = 7;
    
    this.dadosMes['Abr']['Festival Gastronômico'] = 14;
    this.dadosMes['Abr']['Curso Culinário'] = 9;
    this.dadosMes['Abr']['Degustação'] = 7;
    this.dadosMes['Abr']['Jantar Especial'] = 5;
    
    this.dadosMes['Mai']['Festival Gastronômico'] = 16;
    this.dadosMes['Mai']['Curso Culinário'] = 11;
    this.dadosMes['Mai']['Degustação'] = 8;
    this.dadosMes['Mai']['Jantar Especial'] = 6;
    
    this.dadosMes['Jun']['Festival Gastronômico'] = 20;
    this.dadosMes['Jun']['Curso Culinário'] = 13;
    this.dadosMes['Jun']['Degustação'] = 10;
    this.dadosMes['Jun']['Jantar Especial'] = 8;
    
    // Atualizar gráfico
    this.updateChart();
  }

  initChart() {
    // Inicializar gráfico usando ECharts
    this.categoryChart = echarts.init(document.getElementById('categoryChart'));
    this.updateChart();
    
    // Ajustar gráfico quando a janela for redimensionada
    window.addEventListener('resize', () => {
      this.categoryChart.resize();
    });
  }

  updateChart() {
    if (!this.categoryChart) return;
    
    // Preparar dados para o gráfico
    const series = this.categorias.map((categoria, index) => {
      const colors = [
        'rgba(87, 181, 231, 1)',
        'rgba(141, 211, 199, 1)',
        'rgba(251, 191, 114, 1)',
        'rgba(252, 141, 98, 1)'
      ];
      
      return {
        name: categoria,
        type: 'line',
        smooth: true,
        data: Object.keys(this.dadosMes).map(mes => this.dadosMes[mes][categoria]),
        itemStyle: {
          color: colors[index % colors.length]
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: colors[index % colors.length].replace('1)', '0.1)')
            }, {
              offset: 1,
              color: colors[index % colors.length].replace('1)', '0)')
            }]
          }
        }
      };
    });
    
    const option = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textStyle: {
          color: '#1f2937'
        }
      },
      legend: {
        data: this.categorias,
        textStyle: {
          color: '#1f2937'
        }
      },
      grid: {
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: Object.keys(this.dadosMes),
        axisLine: {
          lineStyle: {
            color: '#1f2937'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#1f2937'
          }
        }
      },
      series: series
    };
    
    this.categoryChart.setOption(option);
  }

  filtrarEventos(eventos, filtro) {
    if (filtro === 'todos') {
      return eventos;
    }
    
    return eventos.filter(evento => evento.status === filtro);
  }

  mostrarDetalhesEvento(eventoId) {
    const evento = this.eventos.find(e => e.id === eventoId);
    if (!evento) return;
    
    // Preencher dados do modal
    document.getElementById('modalEventoTitulo').textContent = evento.titulo;
    document.getElementById('modalEventoImagem').src = evento.imagem;
    document.getElementById('modalEventoImagem').alt = evento.titulo;
    
    // Formatar data e hora
    const dataEvento = new Date(evento.data);
    const dataHoraFormatada = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dataEvento);
    
    document.getElementById('modalEventoData').textContent = dataHoraFormatada;
    document.getElementById('modalEventoLocal').textContent = evento.local;
    document.getElementById('modalEventoOrganizador').textContent = `Organizador: ${evento.organizador}`;
    document.getElementById('modalEventoDescricao').textContent = evento.descricao;
    
    // Limpar e preencher itens disponíveis
    const itensContainer = document.getElementById('itensDisponiveis');
    itensContainer.innerHTML = '';
    
    evento.itens.forEach((item, index) => {
      const itemElement = document.createElement('label');
      itemElement.className = 'flex items-center';
      itemElement.innerHTML = `
        <input type="checkbox" class="rounded text-primary focus:ring-primary itemCheck" data-price="${item.preco}" id="item${index}">
        <span class="ml-2 text-sm text-gray-900">${item.nome} (R$ ${item.preco.toFixed(2)})</span>
      `;
      itensContainer.appendChild(itemElement);
    });
    
    // Atualizar total inicial
    this.atualizarTotal();
    
    // Adicionar eventos para atualizar o total
    document.querySelectorAll('.itemCheck').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.atualizarTotal());
    });
    
    document.getElementById('numeroParticipantes').addEventListener('change', () => this.atualizarTotal());
    
    // Exibir modal
    document.getElementById('eventModal').classList.remove('hidden');
  }

  atualizarTotal() {
    const numeroParticipantes = parseInt(document.getElementById('numeroParticipantes').value) || 1;
    let total = 0;
    
    // Somar valores dos itens selecionados
    document.querySelectorAll('.itemCheck:checked').forEach(item => {
      total += parseFloat(item.getAttribute('data-price'));
    });
    
    // Multiplicar pelo número de participantes
    total *= numeroParticipantes;
    
    // Atualizar o elemento de total
    document.getElementById('totalParticipacao').textContent = `R$ ${total.toFixed(2)}`;
  }

  setupEventListeners() {
    // Configurar filtros de eventos
    document.querySelectorAll('.filtroEventos').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remover classe ativa de todos os botões
        document.querySelectorAll('.filtroEventos').forEach(b => {
          b.classList.remove('text-primary', 'border-primary');
          b.classList.add('text-gray-500', 'border-transparent');
        });
        
        // Adicionar classe ativa ao botão clicado
        btn.classList.remove('text-gray-500', 'border-transparent');
        btn.classList.add('text-primary', 'border-primary');
        
        // Atualizar filtro e renderizar eventos
        this.filtroAtual = btn.getAttribute('data-filter');
        this.renderizarListaEventos();
      });
    });
    
    // Botão de criar evento
    document.getElementById('criarEventoBtn').addEventListener('click', () => {
      alert('Funcionalidade de criar evento será implementada em breve!');
    });
    
    // Botão de confirmar participação
    document.getElementById('confirmarParticipacao').addEventListener('click', () => {
      alert('Participação confirmada com sucesso!');
      this.fecharModalEvento();
    });
    
    // Fechar modal quando clicar no botão de fechar
    window.closeEventModal = () => {
      this.fecharModalEvento();
    };
  }

  fecharModalEvento() {
    document.getElementById('eventModal').classList.add('hidden');
  }
}
// Função para mostrar o modal
function showModal(modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
}

// Função para mudar o tipo do gráfico
function changeChartType(chartId, type) {
  const chart = echarts.getInstanceByDom(document.getElementById(chartId));
  if (chart) {
      const option = chart.getOption();
      option.series.forEach(series => {
          series.type = type;
      });
      chart.setOption(option);
  }
}

// Inicializar os gráficos quando os modais forem abertos
document.addEventListener('DOMContentLoaded', function() {
  const totalEventosModal = document.getElementById('totalEventosModal');
  const participantesModal = document.getElementById('participantesModal');
  const eventosMesModal = document.getElementById('eventosMesModal');

  let totalEventosChart = null;
  let participantesChart = null;
  let eventosMesChart = null;

  totalEventosModal.addEventListener('shown.bs.modal', function() {
      if (!totalEventosChart) {
          totalEventosChart = echarts.init(document.getElementById('totalEventosChart'));
          const option = {
              tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'shadow' }
              },
              legend: {
                  data: ['Ativos', 'Pendentes', 'Concluídos']
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: {
                  type: 'category',
                  data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                  {
                      name: 'Ativos',
                      type: 'bar',
                      data: [12, 8, 15, 5, 10, 7],
                      itemStyle: { color: '#198754' }
                  },
                  {
                      name: 'Pendentes',
                      type: 'bar',
                      data: [3, 2, 4, 1, 3, 2],
                      itemStyle: { color: '#ffc107' }
                  },
                  {
                      name: 'Concluídos',
                      type: 'bar',
                      data: [8, 6, 10, 3, 7, 5],
                      itemStyle: { color: '#0dcaf0' }
                  }
              ]
          };
          totalEventosChart.setOption(option);
      }
      totalEventosChart.resize();
  });

  participantesModal.addEventListener('shown.bs.modal', function() {
      if (!participantesChart) {
          participantesChart = echarts.init(document.getElementById('participantesChart'));
          const option = {
              tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'shadow' }
              },
              legend: {
                  data: ['Novos', 'Ativos', 'Inativos']
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: {
                  type: 'category',
                  data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                  {
                      name: 'Novos',
                      type: 'bar',
                      data: [5, 3, 7, 2, 4, 3],
                      itemStyle: { color: '#198754' }
                  },
                  {
                      name: 'Ativos',
                      type: 'bar',
                      data: [15, 12, 18, 10, 14, 11],
                      itemStyle: { color: '#0dcaf0' }
                  },
                  {
                      name: 'Inativos',
                      type: 'bar',
                      data: [2, 1, 3, 1, 2, 1],
                      itemStyle: { color: '#dc3545' }
                  }
              ]
          };
          participantesChart.setOption(option);
      }
      participantesChart.resize();
  });

  eventosMesModal.addEventListener('shown.bs.modal', function() {
      if (!eventosMesChart) {
          eventosMesChart = echarts.init(document.getElementById('eventosMesChart'));
          const option = {
              tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'shadow' }
              },
              legend: {
                  data: ['Eventos']
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: {
                  type: 'category',
                  data: ['1-5', '6-10', '11-15', '16-20', '21-25', '26-31']
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                  {
                      name: 'Eventos',
                      type: 'bar',
                      data: [3, 5, 4, 6, 7, 4],
                      itemStyle: { color: '#198754' }
                  }
              ]
          };
          eventosMesChart.setOption(option);
      }
      eventosMesChart.resize();
  });

  // Redimensionar os gráficos quando a janela for redimensionada
  window.addEventListener('resize', function() {
      if (totalEventosChart) totalEventosChart.resize();
      if (participantesChart) participantesChart.resize();
      if (eventosMesChart) eventosMesChart.resize();
  });
});

// Inicializar a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new DashboardPage();
  dashboard.init();
});

export default DashboardPage; 