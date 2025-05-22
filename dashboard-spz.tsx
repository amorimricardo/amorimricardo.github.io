import React, { useState, useEffect } from 'react';
import { Building, Settings, Users, BarChart3, MapPin, Plus, Trash2, Edit, Save, X } from 'lucide-react';

const SistemaObra = () => {
  const [paginaAtual, setPaginaAtual] = useState('dashboard');
  
  // Estados principais
  const [configuracaoObra, setConfiguracaoObra] = useState({
    nome: 'Edifício Residencial Premium',
    pavimentos: 12,
    apartamentosPorAndar: 3
  });

  const [servicos, setServicos] = useState([
    { id: 1, nome: 'Alvenaria', cor: '#3b82f6', prioridade: 1 },
    { id: 2, nome: 'Inst. Elétricas', cor: '#eab308', prioridade: 2 },
    { id: 3, nome: 'Reboco', cor: '#22c55e', prioridade: 3 },
    { id: 4, nome: 'Contrapiso', cor: '#a855f7', prioridade: 4 },
    { id: 5, nome: 'Pintura', cor: '#ec4899', prioridade: 5 }
  ]);

  const [equipes, setEquipes] = useState([
    { id: 1, nome: 'Equipe Alpha', membros: 4, especialidade: 'Alvenaria', status: 'ativa' },
    { id: 2, nome: 'Equipe Beta', membros: 3, especialidade: 'Inst. Elétricas', status: 'ativa' },
    { id: 3, nome: 'Equipe Gamma', membros: 5, especialidade: 'Reboco', status: 'ativa' }
  ]);

  // Gerar dados de progresso
  const [dadosProgresso, setDadosProgresso] = useState(() => {
    const dados = {};
    for (let pav = 1; pav <= 12; pav++) {
      dados[pav] = {};
      for (let apt = 1; apt <= 3; apt++) {
        dados[pav][apt] = {};
        servicos.forEach(servico => {
          dados[pav][apt][servico.id] = Math.floor(Math.random() * 101);
        });
      }
    }
    return dados;
  });

  // Atribuições de equipes
  const [atribuicoes, setAtribuicoes] = useState([
    { id: 1, equipeId: 1, pavimento: 12, apartamento: 1, servicoId: 1, dataInicio: '2024-05-20' },
    { id: 2, equipeId: 2, pavimento: 11, apartamento: 2, servicoId: 2, dataInicio: '2024-05-21' },
    { id: 3, equipeId: 3, pavimento: 10, apartamento: 3, servicoId: 3, dataInicio: '2024-05-22' }
  ]);

  // Navegação
  const navegacao = [
    { id: 'dashboard', nome: 'Dashboard', icone: BarChart3 },
    { id: 'configuracao', nome: 'Configuração', icone: Settings },
    { id: 'servicos', nome: 'Serviços', icone: Building },
    { id: 'progresso', nome: 'Progresso', icone: BarChart3 },
    { id: 'equipes', nome: 'Equipes', icone: Users },
    { id: 'atribuicoes', nome: 'Atribuições', icone: MapPin }
  ];

  // Componente Header
  const Header = () => (
    <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sistema de Gestão de Obra
          </h1>
          <div className="text-white/70 text-sm">
            {configuracaoObra.nome}
          </div>
        </div>
      </div>
    </div>
  );

  // Navegação lateral
  const NavegacaoLateral = () => (
    <div className="w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 h-screen sticky top-0">
      <div className="p-6">
        <nav className="space-y-2">
          {navegacao.map(item => {
            const Icon = item.icone;
            return (
              <button
                key={item.id}
                onClick={() => setPaginaAtual(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  paginaAtual === item.id 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.nome}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );

  // Página Dashboard
  const Dashboard = () => {
    const [apartamentoSelecionado, setApartamentoSelecionado] = useState(null);

    const getCorProgresso = (porcentagem) => {
      if (porcentagem === 0) return 'bg-red-400';
      if (porcentagem < 30) return 'bg-red-500';
      if (porcentagem < 70) return 'bg-yellow-500';
      if (porcentagem < 100) return 'bg-blue-500';
      return 'bg-green-500';
    };

    const getProgressoMedio = (pavimento, apartamento) => {
      const progressos = Object.values(dadosProgresso[pavimento]?.[apartamento] || {});
      return progressos.length ? Math.round(progressos.reduce((a, b) => a + b, 0) / progressos.length) : 0;
    };

    const ApartamentoCard = ({ pavimento, apartamento }) => {
      const progressoMedio = getProgressoMedio(pavimento, apartamento);
      const isSelected = apartamentoSelecionado?.pavimento === pavimento && apartamentoSelecionado?.apartamento === apartamento;
      
      return (
        <div
          className={`relative p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-lg border border-white/20 ${
            isSelected ? 'ring-2 ring-blue-400 bg-white/30' : 'bg-white/10 hover:bg-white/20'
          }`}
          onClick={() => setApartamentoSelecionado({ pavimento, apartamento })}
        >
          <div className="text-center mb-2">
            <h3 className="text-sm font-bold text-white">Apt {pavimento}{apartamento.toString().padStart(2, '0')}</h3>
            <div className="text-xs text-gray-300">Coluna {apartamento}</div>
          </div>
          
          <div className="space-y-1">
            {servicos.map(servico => {
              const progresso = dadosProgresso[pavimento]?.[apartamento]?.[servico.id] || 0;
              return (
                <div key={servico.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: servico.cor }}></div>
                  <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getCorProgresso(progresso)}`}
                      style={{ width: `${progresso}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-white font-medium">{progresso}%</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-2 pt-2 border-t border-white/20">
            <div className="text-center">
              <span className="text-xs text-gray-300">Progresso Geral</span>
              <div className={`text-lg font-bold ${getCorProgresso(progressoMedio).replace('bg-', 'text-')}`}>
                {progressoMedio}%
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {/* Estatísticas gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {servicos.map(servico => {
            const progressoTotal = [];
            for (let pav = 1; pav <= configuracaoObra.pavimentos; pav++) {
              for (let apt = 1; apt <= configuracaoObra.apartamentosPorAndar; apt++) {
                progressoTotal.push(dadosProgresso[pav]?.[apt]?.[servico.id] || 0);
              }
            }
            const media = Math.round(progressoTotal.reduce((a, b) => a + b, 0) / progressoTotal.length);
            
            return (
              <div key={servico.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
                <h4 className="text-white font-semibold mb-2">{servico.nome}</h4>
                <div className={`text-2xl font-bold mb-2 ${getCorProgresso(media).replace('bg-', 'text-')}`}>
                  {media}%
                </div>
                <div className="bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getCorProgresso(media)}`}
                    style={{ width: `${media}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid de pavimentos */}
        <div className="grid gap-4">
          {Array.from({ length: configuracaoObra.pavimentos }, (_, i) => configuracaoObra.pavimentos - i).map(pavimento => (
            <div key={pavimento} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-3">
                    <div className="text-white font-bold text-lg">{pavimento}º</div>
                    <div className="text-white text-xs">Andar</div>
                  </div>
                </div>
                
                <div className="flex-1 grid gap-4" style={{gridTemplateColumns: `repeat(${configuracaoObra.apartamentosPorAndar}, 1fr)`}}>
                  {Array.from({ length: configuracaoObra.apartamentosPorAndar }, (_, i) => i + 1).map(apartamento => (
                    <ApartamentoCard key={apartamento} pavimento={pavimento} apartamento={apartamento} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de detalhes */}
        {apartamentoSelecionado && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  Apartamento {apartamentoSelecionado.pavimento}{apartamentoSelecionado.apartamento.toString().padStart(2, '0')}
                </h2>
                <button
                  onClick={() => setApartamentoSelecionado(null)}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {servicos.map(servico => {
                  const progresso = dadosProgresso[apartamentoSelecionado.pavimento]?.[apartamentoSelecionado.apartamento]?.[servico.id] || 0;
                  return (
                    <div key={servico.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{servico.nome}</span>
                        <span className={`text-lg font-bold ${getCorProgresso(progresso).replace('bg-', 'text-')}`}>
                          {progresso}%
                        </span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${getCorProgresso(progresso)}`}
                          style={{ width: `${progresso}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Página Configuração
  const PaginaConfiguracao = () => {
    const [config, setConfig] = useState(configuracaoObra);

    const salvarConfiguracao = () => {
      setConfiguracaoObra(config);
      
      // Ajustar dados de progresso conforme nova configuração
      const novosDados = {};
      for (let pav = 1; pav <= config.pavimentos; pav++) {
        novosDados[pav] = {};
        for (let apt = 1; apt <= config.apartamentosPorAndar; apt++) {
          novosDados[pav][apt] = dadosProgresso[pav]?.[apt] || {};
          servicos.forEach(servico => {
            if (!novosDados[pav][apt][servico.id]) {
              novosDados[pav][apt][servico.id] = 0;
            }
          });
        }
      }
      setDadosProgresso(novosDados);
    };

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Configuração da Obra</h2>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Nome da Obra</label>
            <input
              type="text"
              value={config.nome}
              onChange={(e) => setConfig({...config, nome: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Número de Pavimentos</label>
            <input
              type="number"
              min="1"
              max="50"
              value={config.pavimentos}
              onChange={(e) => setConfig({...config, pavimentos: parseInt(e.target.value) || 1})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Apartamentos por Andar</label>
            <input
              type="number"
              min="1"
              max="10"
              value={config.apartamentosPorAndar}
              onChange={(e) => setConfig({...config, apartamentosPorAndar: parseInt(e.target.value) || 1})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <button
            onClick={salvarConfiguracao}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Salvar Configuração
          </button>
        </div>
      </div>
    );
  };

  // Página Serviços
  const PaginaServicos = () => {
    const [editando, setEditando] = useState(null);
    const [novoServico, setNovoServico] = useState({ nome: '', cor: '#3b82f6', prioridade: servicos.length + 1 });

    const adicionarServico = () => {
      const id = Math.max(...servicos.map(s => s.id), 0) + 1;
      setServicos([...servicos, { ...novoServico, id }]);
      setNovoServico({ nome: '', cor: '#3b82f6', prioridade: servicos.length + 2 });
    };

    const removerServico = (id) => {
      setServicos(servicos.filter(s => s.id !== id));
    };

    const salvarEdicao = (id, dados) => {
      setServicos(servicos.map(s => s.id === id ? { ...s, ...dados } : s));
      setEditando(null);
    };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Gerenciamento de Serviços</h2>
        
        {/* Adicionar novo serviço */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Adicionar Novo Serviço</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nome do serviço"
              value={novoServico.nome}
              onChange={(e) => setNovoServico({...novoServico, nome: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="color"
              value={novoServico.cor}
              onChange={(e) => setNovoServico({...novoServico, cor: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              placeholder="Prioridade"
              value={novoServico.prioridade}
              onChange={(e) => setNovoServico({...novoServico, prioridade: parseInt(e.target.value) || 1})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={adicionarServico}
              disabled={!novoServico.nome}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus size={20} />
              Adicionar
            </button>
          </div>
        </div>

        {/* Lista de serviços */}
        <div className="space-y-4">
          {servicos.map(servico => (
            <div key={servico.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
              {editando === servico.id ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <input
                    type="text"
                    defaultValue={servico.nome}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        salvarEdicao(servico.id, {
                          nome: e.target.value,
                          cor: e.target.parentElement.children[1].value,
                          prioridade: parseInt(e.target.parentElement.children[2].value)
                        });
                      }
                    }}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="color"
                    defaultValue={servico.cor}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="number"
                    defaultValue={servico.prioridade}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={() => {
                      const container = document.querySelector(`[data-editing="${servico.id}"]`);
                      const inputs = container.querySelectorAll('input');
                      salvarEdicao(servico.id, {
                        nome: inputs[0].value,
                        cor: inputs[1].value,
                        prioridade: parseInt(inputs[2].value)
                      });
                    }}
                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                    data-editing={servico.id}
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => setEditando(null)}
                    className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: servico.cor }}></div>
                    <span className="text-white font-medium">{servico.nome}</span>
                    <span className="text-white/60 text-sm">Prioridade: {servico.prioridade}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditando(servico.id)}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => removerServico(servico.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Página Progresso
  const PaginaProgresso = () => {
    const [filtros, setFiltros] = useState({
      pavimento: 'todos',
      apartamento: 'todos',
      servico: 'todos'
    });

    const [editandoProgresso, setEditandoProgresso] = useState(null);

    const atualizarProgresso = (pavimento, apartamento, servicoId, novoProgresso) => {
      setDadosProgresso(prev => ({
        ...prev,
        [pavimento]: {
          ...prev[pavimento],
          [apartamento]: {
            ...prev[pavimento][apartamento],
            [servicoId]: Math.max(0, Math.min(100, novoProgresso))
          }
        }
      }));
    };

    const filtrarDados = () => {
      const dados = [];
      for (let pav = 1; pav <= configuracaoObra.pavimentos; pav++) {
        for (let apt = 1; apt <= configuracaoObra.apartamentosPorAndar; apt++) {
          if (filtros.pavimento !== 'todos' && pav !== parseInt(filtros.pavimento)) continue;
          if (filtros.apartamento !== 'todos' && apt !== parseInt(filtros.apartamento)) continue;
          
          servicos.forEach(servico => {
            if (filtros.servico !== 'todos' && servico.id !== parseInt(filtros.servico)) return;
            
            dados.push({
              pavimento: pav,
              apartamento: apt,
              servico,
              progresso: dadosProgresso[pav]?.[apt]?.[servico.id] || 0
            });
          });
        }
      }
      return dados;
    };

    const dadosFiltrados = filtrarDados();

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Atualização de Progresso</h2>
        
        {/* Filtros */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filtros.pavimento}
              onChange={(e) => setFiltros({...filtros, pavimento: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="todos">Todos os Pavimentos</option>
              {Array.from({length: configuracaoObra.pavimentos}, (_, i) => i + 1).map(pav => (
                <option key={pav} value={pav}>{pav}º Andar</option>
              ))}
            </select>
            
            <select
              value={filtros.apartamento}
              onChange={(e) => setFiltros({...filtros, apartamento: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="todos">Todos os Apartamentos</option>
              {Array.from({length: configuracaoObra.apartamentosPorAndar}, (_, i) => i + 1).map(apt => (
                <option key={apt} value={apt}>Apartamento {apt}</option>
              ))}
            </select>
            
            <select
              value={filtros.servico}
              onChange={(e) => setFiltros({...filtros, servico: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="todos">Todos os Serviços</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>{servico.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de progressos */}
        <div className="grid gap-4">
          {dadosFiltrados.map((item, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-white font-bold">{item.pavimento}º</div>
                    <div className="text-white/60 text-xs">Andar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">Apt {item.apartamento}</div>
                    <div className="text-white/60 text-xs">Coluna</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.servico.cor }}></div>
                    <span className="text-white font-medium">{item.servico.nome}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-700 rounded-full h-3">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                      style={{ width: `${item.progresso}%` }}
                    ></div>
                  </div>
                  
                  {editandoProgresso === `${item.pavimento}-${item.apartamento}-${item.servico.id}` ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={item.progresso}
                        className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            atualizarProgresso(item.pavimento, item.apartamento, item.servico.id, parseInt(e.target.value));
                            setEditandoProgresso(null);
                          }
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector(`input[defaultvalue="${item.progresso}"]`);
                          atualizarProgresso(item.pavimento, item.apartamento, item.servico.id, parseInt(input.value));
                          setEditandoProgresso(null);
                        }}
                        className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-lg min-w-[3rem]">{item.progresso}%</span>
                      <button
                        onClick={() => setEditandoProgresso(`${item.pavimento}-${item.apartamento}-${item.servico.id}`)}
                        className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Página Equipes
  const PaginaEquipes = () => {
    const [editandoEquipe, setEditandoEquipe] = useState(null);
    const [novaEquipe, setNovaEquipe] = useState({ nome: '', membros: 1, especialidade: '', status: 'ativa' });

    const adicionarEquipe = () => {
      const id = Math.max(...equipes.map(e => e.id), 0) + 1;
      setEquipes([...equipes, { ...novaEquipe, id }]);
      setNovaEquipe({ nome: '', membros: 1, especialidade: '', status: 'ativa' });
    };

    const removerEquipe = (id) => {
      setEquipes(equipes.filter(e => e.id !== id));
      setAtribuicoes(atribuicoes.filter(a => a.equipeId !== id));
    };

    const salvarEdicaoEquipe = (id, dados) => {
      setEquipes(equipes.map(e => e.id === id ? { ...e, ...dados } : e));
      setEditandoEquipe(null);
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'ativa': return 'bg-green-500';
        case 'inativa': return 'bg-red-500';
        case 'pausada': return 'bg-yellow-500';
        default: return 'bg-gray-500';
      }
    };

    const getEquipeAtribuicao = (equipeId) => {
      const atribuicao = atribuicoes.find(a => a.equipeId === equipeId);
      if (!atribuicao) return null;
      
      const servico = servicos.find(s => s.id === atribuicao.servicoId);
      return {
        local: `${atribuicao.pavimento}º Andar - Apt ${atribuicao.apartamento}`,
        servico: servico?.nome || 'N/A'
      };
    };

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Gerenciamento de Equipes</h2>
        
        {/* Resumo geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
            <h3 className="text-white font-semibold mb-2">Total de Equipes</h3>
            <div className="text-3xl font-bold text-blue-400">{equipes.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
            <h3 className="text-white font-semibold mb-2">Equipes Ativas</h3>
            <div className="text-3xl font-bold text-green-400">{equipes.filter(e => e.status === 'ativa').length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
            <h3 className="text-white font-semibold mb-2">Total de Membros</h3>
            <div className="text-3xl font-bold text-purple-400">{equipes.reduce((total, e) => total + e.membros, 0)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center">
            <h3 className="text-white font-semibold mb-2">Em Trabalho</h3>
            <div className="text-3xl font-bold text-yellow-400">{atribuicoes.length}</div>
          </div>
        </div>

        {/* Adicionar nova equipe */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Adicionar Nova Equipe</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Nome da equipe"
              value={novaEquipe.nome}
              onChange={(e) => setNovaEquipe({...novaEquipe, nome: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              placeholder="Nº de membros"
              min="1"
              value={novaEquipe.membros}
              onChange={(e) => setNovaEquipe({...novaEquipe, membros: parseInt(e.target.value) || 1})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={novaEquipe.especialidade}
              onChange={(e) => setNovaEquipe({...novaEquipe, especialidade: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Especialidade</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.nome}>{servico.nome}</option>
              ))}
            </select>
            <select
              value={novaEquipe.status}
              onChange={(e) => setNovaEquipe({...novaEquipe, status: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="ativa">Ativa</option>
              <option value="inativa">Inativa</option>
              <option value="pausada">Pausada</option>
            </select>
            <button
              onClick={adicionarEquipe}
              disabled={!novaEquipe.nome || !novaEquipe.especialidade}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus size={20} />
              Adicionar
            </button>
          </div>
        </div>

        {/* Lista de equipes */}
        <div className="space-y-4">
          {equipes.map(equipe => {
            const atribuicao = getEquipeAtribuicao(equipe.id);
            
            return (
              <div key={equipe.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                {editandoEquipe === equipe.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <input
                      type="text"
                      defaultValue={equipe.nome}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="number"
                      defaultValue={equipe.membros}
                      min="1"
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                      defaultValue={equipe.especialidade}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {servicos.map(servico => (
                        <option key={servico.id} value={servico.nome}>{servico.nome}</option>
                      ))}
                    </select>
                    <select
                      defaultValue={equipe.status}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="ativa">Ativa</option>
                      <option value="inativa">Inativa</option>
                      <option value="pausada">Pausada</option>
                    </select>
                    <button
                      onClick={() => {
                        const container = document.querySelector(`[data-editing-equipe="${equipe.id}"]`);
                        const inputs = container.querySelectorAll('input, select');
                        salvarEdicaoEquipe(equipe.id, {
                          nome: inputs[0].value,
                          membros: parseInt(inputs[1].value),
                          especialidade: inputs[2].value,
                          status: inputs[3].value
                        });
                      }}
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                      data-editing-equipe={equipe.id}
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => setEditandoEquipe(null)}
                      className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <h3 className="text-white font-bold text-lg">{equipe.nome}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-white/70 text-sm">{equipe.membros} membros</span>
                          <span className="text-white/70 text-sm">•</span>
                          <span className="text-white/70 text-sm">{equipe.especialidade}</span>
                          <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(equipe.status)}`}>
                            {equipe.status.charAt(0).toUpperCase() + equipe.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      {atribuicao && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-white/70 text-xs mb-1">TRABALHANDO EM:</div>
                          <div className="text-white font-medium">{atribuicao.local}</div>
                          <div className="text-white/70 text-sm">{atribuicao.servico}</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditandoEquipe(equipe.id)}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => removerEquipe(equipe.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Página Atribuições
  const PaginaAtribuicoes = () => {
    const [novaAtribuicao, setNovaAtribuicao] = useState({
      equipeId: '',
      pavimento: 1,
      apartamento: 1,
      servicoId: '',
      dataInicio: new Date().toISOString().split('T')[0]
    });

    const adicionarAtribuicao = () => {
      const id = Math.max(...atribuicoes.map(a => a.id), 0) + 1;
      setAtribuicoes([...atribuicoes, { ...novaAtribuicao, id }]);
      setNovaAtribuicao({
        equipeId: '',
        pavimento: 1,
        apartamento: 1,
        servicoId: '',
        dataInicio: new Date().toISOString().split('T')[0]
      });
    };

    const removerAtribuicao = (id) => {
      setAtribuicoes(atribuicoes.filter(a => a.id !== id));
    };

    const getEquipeNome = (equipeId) => {
      const equipe = equipes.find(e => e.id === equipeId);
      return equipe?.nome || 'Equipe não encontrada';
    };

    const getServicoNome = (servicoId) => {
      const servico = servicos.find(s => s.id === servicoId);
      return servico?.nome || 'Serviço não encontrado';
    };

    const getEquipesDisponiveis = () => {
      return equipes.filter(equipe => 
        equipe.status === 'ativa' && 
        !atribuicoes.some(atribuicao => atribuicao.equipeId === equipe.id)
      );
    };

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Atribuições de Equipes</h2>
        
        {/* Mapa visual das atribuições */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Localização das Equipes</h3>
          <div className="grid gap-2">
            {Array.from({ length: configuracaoObra.pavimentos }, (_, i) => configuracaoObra.pavimentos - i).map(pavimento => (
              <div key={pavimento} className="flex items-center gap-4">
                <div className="w-16 text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2">
                    <div className="text-white font-bold text-sm">{pavimento}º</div>
                  </div>
                </div>
                
                <div className="flex-1 grid gap-2" style={{gridTemplateColumns: `repeat(${configuracaoObra.apartamentosPorAndar}, 1fr)`}}>
                  {Array.from({ length: configuracaoObra.apartamentosPorAndar }, (_, i) => i + 1).map(apartamento => {
                    const atribuicao = atribuicoes.find(a => a.pavimento === pavimento && a.apartamento === apartamento);
                    const equipe = atribuicao ? equipes.find(e => e.id === atribuicao.equipeId) : null;
                    const servico = atribuicao ? servicos.find(s => s.id === atribuicao.servicoId) : null;
                    
                    return (
                      <div 
                        key={apartamento} 
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          atribuicao 
                            ? 'bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-400/50' 
                            : 'bg-white/5 border-white/20'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-white font-medium text-sm">Apt {apartamento}</div>
                          {atribuicao && equipe && servico && (
                            <div className="mt-2 space-y-1">
                              <div className="text-xs text-green-300 font-medium">{equipe.nome}</div>
                              <div className="text-xs text-white/70">{servico.nome}</div>
                              <div className="w-2 h-2 rounded-full mx-auto" style={{ backgroundColor: servico.cor }}></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nova atribuição */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Nova Atribuição</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <select
              value={novaAtribuicao.equipeId}
              onChange={(e) => setNovaAtribuicao({...novaAtribuicao, equipeId: parseInt(e.target.value)})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecionar Equipe</option>
              {getEquipesDisponiveis().map(equipe => (
                <option key={equipe.id} value={equipe.id}>{equipe.nome}</option>
              ))}
            </select>
            
            <select
              value={novaAtribuicao.pavimento}
              onChange={(e) => setNovaAtribuicao({...novaAtribuicao, pavimento: parseInt(e.target.value)})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {Array.from({length: configuracaoObra.pavimentos}, (_, i) => i + 1).map(pav => (
                <option key={pav} value={pav}>{pav}º Andar</option>
              ))}
            </select>
            
            <select
              value={novaAtribuicao.apartamento}
              onChange={(e) => setNovaAtribuicao({...novaAtribuicao, apartamento: parseInt(e.target.value)})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {Array.from({length: configuracaoObra.apartamentosPorAndar}, (_, i) => i + 1).map(apt => (
                <option key={apt} value={apt}>Apartamento {apt}</option>
              ))}
            </select>
            
            <select
              value={novaAtribuicao.servicoId}
              onChange={(e) => setNovaAtribuicao({...novaAtribuicao, servicoId: parseInt(e.target.value)})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecionar Serviço</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>{servico.nome}</option>
              ))}
            </select>
            
            <input
              type="date"
              value={novaAtribuicao.dataInicio}
              onChange={(e) => setNovaAtribuicao({...novaAtribuicao, dataInicio: e.target.value})}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <button
              onClick={adicionarAtribuicao}
              disabled={!novaAtribuicao.equipeId || !novaAtribuicao.servicoId}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus size={20} />
              Atribuir
            </button>
          </div>
        </div>

        {/* Lista de atribuições */}
        <div className="space-y-4">
          {atribuicoes.map(atribuicao => {
            const equipe = equipes.find(e => e.id === atribuicao.equipeId);
            const servico = servicos.find(s => s.id === atribuicao.servicoId);
            
            return (
              <div key={atribuicao.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-white font-bold">{atribuicao.pavimento}º Andar</div>
                      <div className="text-white/60 text-sm">Apt {atribuicao.apartamento}</div>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-bold">{getEquipeNome(atribuicao.equipeId)}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {servico && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: servico.cor }}></div>}
                        <span className="text-white/70 text-sm">{getServicoNome(atribuicao.servicoId)}</span>
                      </div>
                    </div>
                    
                    <div className="text-white/60 text-sm">
                      Iniciado em: {new Date(atribuicao.dataInicio).toLocaleDateString('pt-BR')}
                    </div>
                    
                    {equipe && (
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-white/70 text-xs">EQUIPE</div>
                        <div className="text-white text-sm">{equipe.membros} membros</div>
                        <div className="text-white/70 text-xs">{equipe.especialidade}</div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removerAtribuicao(atribuicao.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumo */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resumo de Atribuições</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{atribuicoes.length}</div>
              <div className="text-white/70 text-sm">Atribuições Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{getEquipesDisponiveis().length}</div>
              <div className="text-white/70 text-sm">Equipes Disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((atribuicoes.length / (configuracaoObra.pavimentos * configuracaoObra.apartamentosPorAndar)) * 100)}%
              </div>
              <div className="text-white/70 text-sm">Ocupação dos Apartamentos</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar página atual
  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'dashboard':
        return <Dashboard />;
      case 'configuracao':
        return <PaginaConfiguracao />;
      case 'servicos':
        return <PaginaServicos />;
      case 'progresso':
        return <PaginaProgresso />;
      case 'equipes':
        return <PaginaEquipes />;
      case 'atribuicoes':
        return <PaginaAtribuicoes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <NavegacaoLateral />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderizarPagina()}
        </main>
      </div>
    </div>
  );
};

export default SistemaObra;