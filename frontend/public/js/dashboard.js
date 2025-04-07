// Objeto global com os dados dos eventos
const eventos = {
    'evento1': {
        titulo: 'Casamento Maria & João',
        data: '15',
        dataCompleta: 'Sábado, 15 de Julho',
        horario: '14:00',
        local: 'Salão de Festas',
        convidados: '150',
        status: 'Confirmado',
        descricao: 'Casamento tradicional com cerimônia religiosa seguida de recepção.'
    },
    'evento2': {
        titulo: 'Aniversário Pedro',
        data: '18',
        dataCompleta: 'Terça, 18 de Julho',
        horario: '19:00',
        local: 'Espaço Festas',
        convidados: '80',
        status: 'Confirmado',
        descricao: 'Festa de aniversário com tema esportivo.'
    },
    'evento3': {
        titulo: 'Evento Corporativo Tech',
        data: '22',
        dataCompleta: 'Sexta, 22 de Julho',
        horario: '09:00',
        local: 'Centro de Convenções',
        convidados: '200',
        status: 'Em Andamento',
        descricao: 'Conferência anual de tecnologia com workshops e palestras.'
    }
};

// Objeto para armazenar as instâncias dos gráficos
const charts = {};

// Função para mostrar o modal
function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

// Função para mudar o tipo de gráfico
function changeChartType(modalId, type) {
    const chart = charts[modalId];
    if (!chart) return;

    // Obter a configuração atual completa
    const currentOption = chart.getOption();

    // Atualizar o tipo e adicionar configurações específicas para cada tipo
    currentOption.series.forEach(serie => {
        serie.type = type;
        
        if (type === 'line') {
            // Configurações específicas para gráficos de linha
            serie.smooth = true;
            serie.showSymbol = true;
            serie.symbolSize = 8;
            serie.lineStyle = {
                width: 3
            };
            serie.areaStyle = {
                opacity: 0.1,
                color: serie.itemStyle.color instanceof Object ? 
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: serie.itemStyle.color.colorStops[0].color },
                        { offset: 1, color: 'rgba(255, 255, 255, 0)' }
                    ]) :
                    serie.itemStyle.color
            };
            serie.emphasis = {
                focus: 'series',
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#fff',
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
            };
            // Ajustar a legenda para linha
            currentOption.legend.orient = 'horizontal';
            currentOption.legend.left = 'center';
            currentOption.legend.bottom = '5%';
        } else if (type === 'pie') {
            // Configurações específicas para gráficos de pizza
            delete serie.smooth;
            delete serie.showSymbol;
            delete serie.symbolSize;
            delete serie.lineStyle;
            delete serie.areaStyle;
            
            // Configurar o gráfico de pizza
            serie.radius = ['40%', '70%'];
            serie.center = ['50%', '50%'];
            serie.itemStyle = {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            };
            serie.label = {
                show: true,
                position: 'outside',
                formatter: '{b}: {d}%',
                color: '#666',
                fontSize: 12,
                fontWeight: 'normal',
                alignTo: 'edge',
                edgeDistance: '10%'
            };
            serie.labelLine = {
                show: true,
                length: 15,
                length2: 10,
                smooth: true
            };
            serie.emphasis = {
                label: {
                    show: true,
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            };
            
            // Ajustar a legenda para pizza
            currentOption.legend.orient = 'horizontal';
            currentOption.legend.left = 'center';
            currentOption.legend.bottom = '5%';
            
            // Ajustar o grid para pizza
            currentOption.grid = {
                top: '5%',
                bottom: '15%',
                left: '5%',
                right: '5%',
                containLabel: true
            };

            // Ajustar o tooltip para pizza
            currentOption.tooltip = {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#ccc',
                borderWidth: 1,
                textStyle: {
                    color: '#333'
                }
            };
        } else {
            // Configurações para gráfico de barras
            delete serie.smooth;
            delete serie.showSymbol;
            delete serie.symbolSize;
            delete serie.lineStyle;
            delete serie.areaStyle;
            delete serie.emphasis;
            
            // Ajustar a legenda para barras
            currentOption.legend.orient = 'horizontal';
            currentOption.legend.left = 'center';
            currentOption.legend.bottom = '5%';
        }
    });

    // Limpar o gráfico atual antes de aplicar as novas opções
    chart.clear();
    chart.setOption(currentOption);

    // Atualizar botões ativos
    const modal = document.getElementById(modalId);
    modal.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        }
    });
}

let currentEventoId = null;

// Função para mostrar o modal de edição
function showEditEvent() {
    const evento = eventos[currentEventoId];
    if (evento) {
        // Preencher o formulário com os dados atuais
        document.getElementById('editTitulo').value = evento.titulo;
        document.getElementById('editData').value = formatDateForInput(evento.dataCompleta);
        document.getElementById('editHorario').value = evento.horario;
        document.getElementById('editLocal').value = evento.local;
        document.getElementById('editConvidados').value = evento.convidados;
        document.getElementById('editStatus').value = evento.status;
        document.getElementById('editDescricao').value = evento.descricao;

        // Fechar o modal de detalhes
        const detailsModal = bootstrap.Modal.getInstance(document.getElementById('eventoDetailsModal'));
        detailsModal.hide();

        // Abrir o modal de edição
        const editModal = new bootstrap.Modal(document.getElementById('editEventoModal'));
        editModal.show();
    }
}

// Função para salvar as alterações do evento
function saveEvento(event) {
    event.preventDefault();

    // Coletar os dados do formulário
    const updatedEvento = {
        titulo: document.getElementById('editTitulo').value,
        data: document.getElementById('editData').value.split('-')[2], // Pega apenas o dia
        dataCompleta: formatDateForDisplay(document.getElementById('editData').value),
        horario: document.getElementById('editHorario').value,
        local: document.getElementById('editLocal').value,
        convidados: document.getElementById('editConvidados').value,
        status: document.getElementById('editStatus').value,
        descricao: document.getElementById('editDescricao').value
    };

    // Atualizar o evento no objeto eventos
    eventos[currentEventoId] = updatedEvento;

    // Atualizar a exibição na lista de eventos
    updateEventoList();

    // Fechar o modal de edição
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editEventoModal'));
    editModal.hide();

    // Mostrar mensagem de sucesso
    showSuccessMessage('Evento atualizado com sucesso!');
}

// Função para formatar a data para o input date
function formatDateForInput(dateString) {
    const [dia, mes, ano] = dateString.split(' ');
    const meses = {
        'Janeiro': '01', 'Fevereiro': '02', 'Março': '03', 'Abril': '04',
        'Maio': '05', 'Junho': '06', 'Julho': '07', 'Agosto': '08',
        'Setembro': '09', 'Outubro': '10', 'Novembro': '11', 'Dezembro': '12'
    };
    return `${ano}-${meses[mes]}-${dia.padStart(2, '0')}`;
}

// Função para formatar a data para exibição
function formatDateForDisplay(dateString) {
    const [ano, mes, dia] = dateString.split('-');
    const meses = {
        '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
        '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
        '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
    };
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const data = new Date(ano, mes - 1, dia);
    return `${diasSemana[data.getDay()]}, ${dia} de ${meses[mes]}`;
}

// Função para atualizar a lista de eventos
function updateEventoList() {
    const eventosList = document.querySelector('.space-y-4');
    eventosList.innerHTML = '';

    Object.entries(eventos).forEach(([id, evento]) => {
        const eventoElement = document.createElement('div');
        eventoElement.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors';
        eventoElement.onclick = () => showEventDetails(id);

        const colorClass = id === 'evento1' ? 'indigo' : id === 'evento2' ? 'green' : 'yellow';
        
        eventoElement.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-${colorClass}-100 rounded-full flex items-center justify-center">
                    <span class="text-${colorClass}-600 font-medium">${evento.data}</span>
                </div>
                <div>
                    <h4 class="font-medium text-gray-900">${evento.titulo}</h4>
                    <p class="text-sm text-gray-500">${evento.dataCompleta}</p>
                </div>
            </div>
            <div class="text-sm text-gray-500">${evento.horario}</div>
        `;

        eventosList.appendChild(eventoElement);
    });
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Função para mostrar detalhes do evento
function showEventDetails(eventoId) {
    currentEventoId = eventoId;
    const evento = eventos[eventoId];
    if (evento) {
        document.getElementById('eventoTitulo').textContent = evento.titulo;
        document.getElementById('eventoData').textContent = evento.data;
        document.getElementById('eventoDataCompleta').textContent = evento.dataCompleta;
        document.getElementById('eventoHorario').textContent = evento.horario;
        document.getElementById('eventoLocal').textContent = evento.local;
        document.getElementById('eventoConvidados').textContent = evento.convidados;
        document.getElementById('eventoStatus').textContent = evento.status;
        document.getElementById('eventoDescricao').textContent = evento.descricao;
        
        const modal = new bootstrap.Modal(document.getElementById('eventoDetailsModal'));
        modal.show();
    }
}

// Função para criar novo evento
function createNewEvent(event) {
    event.preventDefault();
    
    // Coletar dados do formulário
    const newEvent = {
        id: Date.now(), // ID único baseado no timestamp
        titulo: document.getElementById('newTitulo').value,
        data: document.getElementById('newData').value,
        horario: document.getElementById('newHorario').value,
        local: document.getElementById('newLocal').value,
        convidados: parseInt(document.getElementById('newConvidados').value),
        status: document.getElementById('newStatus').value,
        descricao: document.getElementById('newDescricao').value
    };

    // Adicionar novo evento ao objeto eventos
    eventos[newEvent.id] = newEvent;

    // Atualizar a lista de eventos
    updateEventoList();

    // Fechar o modal e resetar o formulário
    const modal = bootstrap.Modal.getInstance(document.getElementById('newEventoModal'));
    modal.hide();
    document.getElementById('newEventForm').reset();

    // Mostrar mensagem de sucesso
    showSuccessMessage('Evento criado com sucesso!');
}

// Função para mostrar o modal de novo evento
function showNewEventModal() {
    const modal = new bootstrap.Modal(document.getElementById('newEventoModal'));
    modal.show();
}

// Função para fazer logout
function logout() {
    // Limpar dados da sessão
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    // Redirecionar para a página de login
    window.location.href = '/login.html';
}

// Inicializar os gráficos quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o gráfico de categorias
    const categoryChart = echarts.init(document.getElementById('categoryChart'));
    const categoryOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['Casamentos', 'Aniversários', 'Corporativos', 'Outros']
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
                name: 'Casamentos',
                type: 'bar',
                data: [5, 3, 7, 2, 4, 3],
                itemStyle: { color: '#4F46E5' }
            },
            {
                name: 'Aniversários',
                type: 'bar',
                data: [3, 2, 4, 1, 3, 2],
                itemStyle: { color: '#10B981' }
            },
            {
                name: 'Corporativos',
                type: 'bar',
                data: [2, 1, 3, 1, 2, 1],
                itemStyle: { color: '#F59E0B' }
            },
            {
                name: 'Outros',
                type: 'bar',
                data: [1, 1, 2, 1, 1, 1],
                itemStyle: { color: '#6B7280' }
            }
        ]
    };
    categoryChart.setOption(categoryOption);

    // Inicializar o gráfico de pizza
    const pieChart = echarts.init(document.getElementById('pieChart'));
    const pieOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['Casamentos', 'Aniversários', 'Corporativos', 'Outros']
        },
        series: [
            {
                name: 'Distribuição de Eventos',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 35, name: 'Casamentos', itemStyle: { color: '#4F46E5' } },
                    { value: 25, name: 'Aniversários', itemStyle: { color: '#10B981' } },
                    { value: 20, name: 'Corporativos', itemStyle: { color: '#F59E0B' } },
                    { value: 20, name: 'Outros', itemStyle: { color: '#6B7280' } }
                ]
            }
        ]
    };
    pieChart.setOption(pieOption);

    // Inicializar gráficos dos modais
    const modals = ['totalEventosModal', 'participantesModal', 'eventosMesModal', 'faturamentoModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        const chartElement = modal.querySelector('.chart-container');
        const chart = echarts.init(chartElement);
        charts[modalId] = chart;

        // Configuração base comum para todos os gráficos
        const baseOption = {
            animation: true,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#ccc',
                borderWidth: 1,
                textStyle: {
                    color: '#333'
                },
                formatter: function(params) {
                    let result = params[0].axisValue + '<br/>';
                    params.forEach(param => {
                        result += `${param.seriesName}: ${param.value}<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                bottom: '5%',
                textStyle: {
                    color: '#666'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '20%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: 0,
                    rotate: 30,
                    color: '#666'
                },
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#666'
                },
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                }
            }
        };

        // Configurações específicas para cada modal
        let specificOption = {};
        switch(modalId) {
            case 'totalEventosModal':
                specificOption = {
                    legend: {
                        data: ['Casamentos', 'Aniversários', 'Corporativos', 'Outros']
                    },
                    xAxis: {
                        data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
                    },
                    series: [
                        {
                            name: 'Casamentos',
                            type: 'bar',
                            data: [5, 3, 7, 2, 4, 3],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#FF6B6B' },
                                    { offset: 1, color: '#FF8E8E' }
                                ])
                            }
                        },
                        {
                            name: 'Aniversários',
                            type: 'bar',
                            data: [3, 2, 4, 1, 3, 2],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#4ECDC4' },
                                    { offset: 1, color: '#6EE7E0' }
                                ])
                            }
                        },
                        {
                            name: 'Corporativos',
                            type: 'bar',
                            data: [2, 1, 3, 1, 2, 1],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#45B7D1' },
                                    { offset: 1, color: '#65D7F1' }
                                ])
                            }
                        },
                        {
                            name: 'Outros',
                            type: 'bar',
                            data: [1, 1, 2, 1, 1, 1],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#96CEB4' },
                                    { offset: 1, color: '#B6EED4' }
                                ])
                            }
                        }
                    ]
                };
                break;
            case 'participantesModal':
                specificOption = {
                    legend: {
                        data: ['Novos', 'Ativos', 'Inativos']
                    },
                    xAxis: {
                        data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
                    },
                    series: [
                        {
                            name: 'Novos',
                            type: 'bar',
                            data: [150, 230, 224, 218, 135, 147],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#9B59B6' },
                                    { offset: 1, color: '#BB79D6' }
                                ])
                            }
                        },
                        {
                            name: 'Ativos',
                            type: 'bar',
                            data: [120, 200, 150, 180, 100, 120],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#3498DB' },
                                    { offset: 1, color: '#54B8FB' }
                                ])
                            }
                        },
                        {
                            name: 'Inativos',
                            type: 'bar',
                            data: [30, 30, 74, 38, 35, 27],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#E74C3C' },
                                    { offset: 1, color: '#FF6C5C' }
                                ])
                            }
                        }
                    ]
                };
                break;
            case 'eventosMesModal':
                specificOption = {
                    legend: {
                        data: ['Confirmados', 'Pendentes', 'Concluídos']
                    },
                    xAxis: {
                        data: ['1-5', '6-10', '11-15', '16-20', '21-25', '26-31']
                    },
                    series: [
                        {
                            name: 'Confirmados',
                            type: 'bar',
                            data: [3, 5, 4, 6, 7, 4],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#2ECC71' },
                                    { offset: 1, color: '#4EEC91' }
                                ])
                            }
                        },
                        {
                            name: 'Pendentes',
                            type: 'bar',
                            data: [2, 3, 2, 4, 3, 2],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#F1C40F' },
                                    { offset: 1, color: '#FFE42F' }
                                ])
                            }
                        },
                        {
                            name: 'Concluídos',
                            type: 'bar',
                            data: [1, 2, 2, 2, 4, 2],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#1ABC9C' },
                                    { offset: 1, color: '#3BDCBC' }
                                ])
                            }
                        }
                    ]
                };
                break;
            case 'faturamentoModal':
                specificOption = {
                    legend: {
                        data: ['Receita Total', 'Receita Líquida', 'Custos']
                    },
                    xAxis: {
                        data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    },
                    series: [
                        {
                            name: 'Receita Total',
                            type: 'bar',
                            data: [45000, 52000, 49000, 58000, 62000, 45678],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#8E44AD' },
                                    { offset: 1, color: '#AE64CD' }
                                ])
                            }
                        },
                        {
                            name: 'Receita Líquida',
                            type: 'bar',
                            data: [38000, 45000, 42000, 50000, 54000, 38000],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#16A085' },
                                    { offset: 1, color: '#36C0A5' }
                                ])
                            }
                        },
                        {
                            name: 'Custos',
                            type: 'bar',
                            data: [7000, 7000, 7000, 8000, 8000, 7667],
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#C0392B' },
                                    { offset: 1, color: '#E0594B' }
                                ])
                            }
                        }
                    ]
                };
                break;
        }

        // Combinar as opções base com as específicas
        const option = {
            ...baseOption,
            ...specificOption,
            series: specificOption.series // Garantir que as séries sejam mantidas
        };

        chart.setOption(option);

        // Adicionar event listener para redimensionar o gráfico quando o modal for aberto
        modal.addEventListener('shown.bs.modal', () => {
            setTimeout(() => {
                chart.resize();
            }, 100);
        });
    });

    // Adicionar event listeners para os botões de mudança de tipo
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            const type = this.dataset.type;
            changeChartType(modalId, type);
        });
    });

    // Adicionar event listeners para o formulário de novo evento
    document.getElementById('newEventForm').addEventListener('submit', createNewEvent);
    document.getElementById('createNewEventBtn').addEventListener('click', showNewEventModal);

    // Adicionar event listener para o botão de logout
    document.querySelector('.fa-sign-out-alt').parentElement.addEventListener('click', logout);
}); 