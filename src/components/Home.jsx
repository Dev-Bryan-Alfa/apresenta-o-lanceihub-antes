import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Clock, Calculator, CheckSquare, History, TrendingUp, FileText } from 'lucide-react';
import Context from '../context/Context';
import api from '../axios/axiosBase';
import { FaCalculator, FaClipboardList } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calculators');
  const [recentActivities, setRecentActivities] = useState({
    lastCalculator: null,
    lastChecklist: null
  });
  const [calculatorHistory, setCalculatorHistory] = useState([]);
  const [checklistHistory, setChecklistHistory] = useState([]);

  const nav = useNavigate()

  const { user } = useContext(Context);

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = async () => {
    try {
      // Buscar última calculadora
      const calcResponse = await api.get('/calculadora/last');
      const lastCalc = calcResponse.data;

      // Buscar último checklist
      const checkResponse = await api.get('/calculadora/checklist/last');
      const lastCheck = checkResponse.data;

      setRecentActivities({
        lastCalculator: lastCalc,
        lastChecklist: lastCheck
      });
    } catch (error) {
      console.error('Erro ao carregar atividades recentes:', error);
      // Fallback para localStorage se a API falhar
      const lastCalc = localStorage.getItem('lastCalculator');
      const lastCheck = localStorage.getItem('lastChecklist');

      setRecentActivities({
        lastCalculator: lastCalc ? JSON.parse(lastCalc) : null,
        lastChecklist: lastCheck ? JSON.parse(lastCheck) : null
      });
    }

  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleOpenCalculator = (calc) => {
    localStorage.setItem('lastCalculator', JSON.stringify({ ...calc, lastUsed: new Date().toISOString() }));
    navigate('/calculadora/dashboard', { state: { calculatorData: calc } });
  };

  const handleOpenChecklist = (checklist) => {
    localStorage.setItem('lastChecklist', JSON.stringify({ ...checklist, lastUsed: new Date().toISOString() }));
    navigate('/checklist-dashboard', { state: { checklistData: checklist } });
  };

  const handleCreateNew = (type) => {
    if (type === 'calculator') {
      navigate('/calculadora/dashboard');
    } else {
      navigate('/checklist-dashboard');
    }
  };

  const abrirUltimaCalculadora = async () => {
    try {
      const { data } = await api.get('/calculadora/last');
      if (data) {
        nav('/calculadora/' + data.id)
      } else {
        alert('Nenhuma calculadora encontrada.');
      }
    } catch (error) {
      console.error('Erro ao buscar última calculadora:', error);
      alert('Erro ao abrir última calculadora.');
    }
  };

  // Função para abrir o último checklist
  const abrirUltimoChecklist = async () => {
    try {
      const { data } = await api.get('/calculadora/last');
      if (data && data.checklist) {
        // window.open(`${window.location.origin}/checklist/${data.checklist.id}`, '_blank');
        nav('/checklist/' + data.checklist.id)
      } else {
        alert('Nenhum checklist encontrado para a última calculadora.');
      }
    } catch (error) {
      console.error('Erro ao buscar último checklist:', error);
      alert('Erro ao abrir último checklist.');
    }
  };

  return (
    <div className="min-h-screen bg-[#00071E] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-montserrat text-white mb-2 drop-shadow-lg">Bem-vindo à Central do Arrematante.</h1>
          <p className="text-purple-200">Acesse suas atividades recentes e histórico completo</p>
        </div>

        {/* Atividades Recentes */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center drop-shadow-lg">
            <Clock className="mr-2 text-purple-400" size={24} />
            Atividades Recentes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Última Calculadora */}
            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-r from-[#5524E8]/35 to-[#6024AF]/10 backdrop-blur-lg rounded-3xl shadow-2xl shadow-purple-500/50 border border-purple-400/50">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Calculator className="mr-2 text-purple-400" size={20} />
                  Última Calculadora
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivities.lastCalculator ? (
                  <div>
                    <p className="font-medium text-white mb-2">
                      {recentActivities.lastCalculator.nome || 'Calculadora'}
                    </p>
                    <p className="text-sm text-purple-200 mb-3">
                      Criado em: {formatDate(recentActivities.lastCalculator.data)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={abrirUltimaCalculadora}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 border border-white/20"
                      >
                        <FaCalculator /> Última Calculadora
                      </button>

                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-purple-200 mb-3">Nenhuma calculadora usada recentemente</p>
                    <Button
                      onClick={() => handleCreateNew('calculator')}
                      size="sm"
                      className="w-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                    >
                      Criar Nova Calculadora
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Último Checklist */}
            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-r from-[#5524E8]/35 to-[#6024AF]/10 backdrop-blur-lg rounded-3xl shadow-2xl shadow-purple-500/50 border border-purple-400/50">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <CheckSquare className="mr-2 text-purple-400" size={20} />
                  Último Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivities.lastChecklist ? (
                  <div>
                    <p className="font-medium text-white mb-2">
                      {recentActivities.lastChecklist.nome || 'Checklist'}
                    </p>
                    <p className="text-sm text-purple-200 mb-3">
                      Criado em: {formatDate(recentActivities.lastChecklist.data)}
                    </p>
                    <div className="flex gap-2">

                      <button
                        onClick={abrirUltimoChecklist}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 border border-white/20"
                      >
                        <FaClipboardList /> Último Checklist
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-purple-200 mb-3">Nenhum checklist usado recentemente</p>
                    <Button
                      onClick={() => handleCreateNew('checklist')}
                      size="sm"
                      className="w-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                    >
                      Criar Novo Checklist
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Histórico Completo */}
      </div>
    </div>
  );
};

export default Home;
