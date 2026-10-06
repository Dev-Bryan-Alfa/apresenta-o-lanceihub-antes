// Adaptador do axios para o modo demonstração: responde às chamadas da API antiga
// com dados fictícios em memória. Nenhuma requisição sai do navegador.
import { AxiosError } from 'axios';
import { criarBanco, gerarParcelas, USUARIO_DEMO } from './dados';

const banco = criarBanco();
const agora = () => new Date().toISOString();

function lerUrl(config) {
  const semOrigem = String(config.url || '').replace(/^[a-z]+:\/\/[^/]+/i, '');
  const [caminho, query = ''] = semOrigem.split('?');
  const params = { ...Object.fromEntries(new URLSearchParams(query)), ...(config.params || {}) };
  return { partes: caminho.split('/').filter(Boolean), params };
}

function lerCorpo(config) {
  if (!config.data) return {};
  if (typeof config.data === 'string') {
    try {
      return JSON.parse(config.data);
    } catch {
      return {};
    }
  }
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    return Object.fromEntries(config.data.entries());
  }
  return config.data;
}

function paginar(lista, params) {
  const limite = Number(params.limit) || lista.length || 1;
  const pagina = Number(params.page) || 1;
  return lista.slice((pagina - 1) * limite, pagina * limite);
}

const porDataDesc = (a, b) => new Date(b.data) - new Date(a.data);
const acharPorId = (lista, id) => lista.find((item) => String(item.id) === String(id));
const remover = (lista, id) => {
  const i = lista.findIndex((item) => String(item.id) === String(id));
  if (i >= 0) lista.splice(i, 1);
};

function calculadoraCompleta(calc) {
  if (!calc) return null;
  const checklist = banco.checklists.find((c) => c.calculadoraId === calc.id) || null;
  const encerramento = banco.encerramentos.find((e) => e.calculadoraId === calc.id) || null;
  const parcela = banco.parcelasPropostas.find((p) => p.calculadoraId === calc.id);
  return {
    ...calc,
    checklist,
    encerramento,
    parcelaProposta: parcela ? { id: parcela.id, nome: parcela.nome } : null,
  };
}

function checklistCompleto(checklist) {
  if (!checklist) return null;
  const calc = acharPorId(banco.calculadoras, checklist.calculadoraId);
  return {
    ...checklist,
    checklist_lote: banco.checklistLotes.filter((l) => l.checklistId === checklist.id),
    calculadora: calc ? { id: calc.id, nome: calc.nome, lance: calc.lance, proposta_compra: calc.proposta_compra } : null,
    encerramento: banco.encerramentos.find((e) => e.checklistId === checklist.id) || null,
  };
}

function novaCalculadora(dados) {
  const calc = {
    id: banco.proximoId(),
    nome: dados.nome || 'Nova calculadora',
    data: dados.data || agora(),
    lote_id: null,
    user_id: 1,
    lance: null,
    proposta_compra: null,
  };
  banco.calculadoras.unshift(calc);
  if (dados.checklistId) {
    const checklist = acharPorId(banco.checklists, dados.checklistId);
    if (checklist) checklist.calculadoraId = calc.id;
  }
  return calc;
}

function novoChecklist(dados) {
  const checklist = {
    id: banco.proximoId(),
    nome: dados.nome || 'Novo checklist',
    descricao: dados.descricao || '',
    link: dados.link || '',
    data: dados.data || agora(),
    calculadoraId: dados.calculadoraId ? Number(dados.calculadoraId) : null,
    userId: 1,
  };
  banco.checklists.unshift(checklist);
  return checklist;
}

function novaPropostaParcelada(dados) {
  const proposta = {
    id: banco.proximoId(),
    nome: dados.nome || 'Nova proposta',
    valorArrematacao: Number(dados.valorArrematacao) || 0,
    quantidadeParcelas: Number(dados.quantidadeParcelas) || 1,
    porcentagemEntrada: Number(dados.porcentagemEntrada) || 0,
    indice: dados.indice || 'IPCA',
    dataAssinaturaAutoArrematacao: dados.dataAssinaturaAutoArrematacao,
    calcularAutomaticamente: dados.calcularAutomaticamente !== false,
    calculadoraId: dados.calculadoraId ? Number(dados.calculadoraId) : null,
    finished: false,
    saldoRemanescente: 0,
  };
  Object.assign(proposta, gerarParcelas(proposta, banco.proximoId));
  banco.parcelasPropostas.unshift(proposta);
  return proposta;
}

// [método, caminho, resposta]. ":x" casa com qualquer segmento; a primeira rota que casar responde.
const rotas = [
  ['post', 'auth/login', ({ corpo }) => ({ accessToken: 'demo', user: { ...USUARIO_DEMO, email: corpo.email || USUARIO_DEMO.email } })],
  ['post', 'auth/refresh', () => ({ accessToken: 'demo' })],
  ['post', 'auth/forgot-password', () => ({ message: 'Demonstração: nenhum e-mail foi enviado.' })],
  ['post', 'auth/reset-password', () => ({ message: 'Demonstração: senha não alterada.' })],
  ['post', 'auth/contact', () => ({ message: 'ok' })],

  ['get', 'user/admin/:x', () => ({ admin: true })],
  ['get', 'user/count', () => ({ ...banco.cadastrosPorMes, total: Object.values(banco.cadastrosPorMes).reduce((s, n) => s + n, 0) })],
  ['get', 'user', () => banco.usuarios],
  ['get', 'user/:x', ({ p }) => acharPorId(banco.usuarios, p[1]) || { id: Number(p[1]), payment: { status: 'active', expiresIn: new Date(Date.now() + 30 * 864e5).toISOString() } }],
  ['post', 'user/check-cpf', () => ({ exists: false })],
  ['post', 'user/create', ({ corpo }) => ({ id: banco.proximoId(), ...corpo, senha: undefined, password: undefined })],
  ['put', 'user/:x/password', () => ({ message: 'ok' })],
  ['put', 'user/:x', ({ p, corpo }) => Object.assign(acharPorId(banco.usuarios, p[1]) || {}, corpo)],

  ['get', 'calculadora/count', () => banco.calculadoras.length],
  ['get', 'calculadora/last', () => calculadoraCompleta([...banco.calculadoras].sort(porDataDesc)[0])],
  ['get', 'calculadora/checklist/count', () => banco.checklists.length],
  ['get', 'calculadora/checklist/last', () => checklistCompleto([...banco.checklists].sort(porDataDesc)[0])],
  ['get', 'calculadora/checklist', ({ params }) => paginar([...banco.checklists].sort(porDataDesc), params)],
  ['get', 'calculadora/checklist-lote', () => []],
  ['get', 'calculadora/checklist/:x', ({ p }) => checklistCompleto(acharPorId(banco.checklists, p[2]))],
  ['get', 'calculadora/encerramentos', () => banco.encerramentos],
  ['get', 'calculadora/parcela-proposta', ({ params }) => {
    const inicio = Number(params.skip) || 0;
    const quantidade = Number(params.take) || banco.parcelasPropostas.length;
    return banco.parcelasPropostas.slice(inicio, inicio + quantidade).map(({ parcelas, ...resto }) => resto);
  }],
  ['get', 'calculadora/parcela-proposta/:x', ({ p }) => acharPorId(banco.parcelasPropostas, p[2]) || null],
  ['get', 'calculadora/lote-historico/:x', () => []],
  ['get', 'calculadora', ({ params }) => paginar([...banco.calculadoras].sort(porDataDesc), params).map(calculadoraCompleta)],
  ['get', 'calculadora/:x', ({ p }) => calculadoraCompleta(acharPorId(banco.calculadoras, p[1]))],
  ['get', 'calculadoras', () => []],

  ['post', 'calculadora/checklist', ({ corpo }) => novoChecklist(corpo)],
  ['post', 'calculadora/checklist-lote', ({ corpo }) => {
    const lote = { id: banco.proximoId(), userId: 1, loteId: null, ...corpo };
    banco.checklistLotes.push(lote);
    return lote;
  }],
  ['post', 'calculadora/encerramentos', ({ corpo }) => {
    const encerramento = {
      id: banco.proximoId(),
      nome: corpo.nome || 'Novo encerramento',
      link: corpo.link || '',
      data_primeira_praca: corpo.data_primeira_praca || null,
      data_segunda_praca: corpo.data_segunda_praca || null,
      calculadoraId: corpo.calculadoraId ? Number(corpo.calculadoraId) : null,
      checklistId: corpo.checklistId ? Number(corpo.checklistId) : null,
      userId: 1,
    };
    banco.encerramentos.unshift(encerramento);
    return encerramento;
  }],
  ['post', 'calculadora/from/encerramento', ({ corpo }) => {
    const calc = novaCalculadora({ nome: corpo.nome, checklistId: corpo.checklistId });
    const dados = corpo.dadosEncerramento || {};
    calc.lance = { link_leilao: dados.link_leilao || '', data_primeira_praca: dados.data_primeira_praca || '', data_segunda_praca: dados.data_segunda_praca || '' };
    const encerramento = acharPorId(banco.encerramentos, corpo.encerramentoId);
    if (encerramento) encerramento.calculadoraId = calc.id;
    return calc;
  }],
  ['post', 'calculadora/parcela-proposta', ({ corpo }) => novaPropostaParcelada(corpo)],
  ['post', 'calculadora/parcela/manual', ({ corpo }) => {
    const proposta = acharPorId(banco.parcelasPropostas, corpo.parcelaPropostaId);
    const parcela = { id: banco.proximoId(), indice: 0, pago: false, ...corpo, valor: Number(corpo.valor) || 0 };
    if (proposta) proposta.parcelas.push(parcela);
    return parcela;
  }],
  ['post', 'calculadora', ({ corpo }) => novaCalculadora(corpo)],

  ['put', 'calculadora/checklist/:x', ({ p, corpo }) => Object.assign(acharPorId(banco.checklists, p[2]) || {}, corpo)],
  ['put', 'calculadora/checklist-lote/:x', ({ p, corpo }) => Object.assign(acharPorId(banco.checklistLotes, p[2]) || {}, corpo)],
  ['put', 'calculadora/parcela-proposta/:x', ({ p, corpo }) => {
    const proposta = acharPorId(banco.parcelasPropostas, p[2]);
    if (!proposta) return null;
    Object.assign(proposta, corpo);
    if (corpo.valorArrematacao || corpo.quantidadeParcelas || corpo.porcentagemEntrada || corpo.dataAssinaturaAutoArrematacao) {
      Object.assign(proposta, gerarParcelas(proposta, banco.proximoId));
    }
    return proposta;
  }],
  ['put', 'calculadora/parcela/:x', ({ p, corpo }) => {
    for (const proposta of banco.parcelasPropostas) {
      const parcela = acharPorId(proposta.parcelas, p[2]);
      if (parcela) return Object.assign(parcela, corpo, { ultimaAtualizacao: new Date().toLocaleDateString('pt-BR') });
    }
    return { id: Number(p[2]), ...corpo };
  }],
  ['put', 'calculadora/:x/lance', ({ p, corpo }) => {
    const calc = acharPorId(banco.calculadoras, p[1]);
    if (calc) calc.lance = { ...(calc.lance || {}), ...corpo };
    return calc;
  }],
  ['put', 'calculadora/:x/proposta', ({ p, corpo }) => {
    const calc = acharPorId(banco.calculadoras, p[1]);
    if (calc) calc.proposta_compra = { ...(calc.proposta_compra || {}), ...corpo };
    return calc;
  }],
  ['put', 'calculadora/:x', ({ p, corpo }) => Object.assign(acharPorId(banco.calculadoras, p[1]) || {}, corpo)],
  ['patch', 'calculadora/:x/nome', ({ p, corpo }) => Object.assign(acharPorId(banco.calculadoras, p[1]) || {}, { nome: corpo.nome })],

  ['delete', 'calculadora/checklist/:x', ({ p }) => remover(banco.checklists, p[2])],
  ['delete', 'calculadora/checklist-lote/:x', ({ p }) => remover(banco.checklistLotes, p[2])],
  ['delete', 'calculadora/parcela/:x', ({ p }) => banco.parcelasPropostas.forEach((proposta) => remover(proposta.parcelas, p[2]))],
  ['delete', 'calculadora/:x', ({ p }) => remover(banco.calculadoras, p[1])],

  ['patch', 'parcela-proposta/:x', ({ p, corpo }) => Object.assign(acharPorId(banco.parcelasPropostas, p[1]) || {}, corpo)],
  ['delete', 'parcela-proposta/:x', ({ p }) => remover(banco.parcelasPropostas, p[1])],

  ['get', 'arrematacao', () => banco.arrematacoes],
  ['post', 'arrematacao', ({ corpo }) => {
    const proposta = corpo.createProposta
      ? novaPropostaParcelada({ nome: corpo.nomeLote, valorArrematacao: corpo.valor, quantidadeParcelas: 30, porcentagemEntrada: 25, dataAssinaturaAutoArrematacao: new Date().toLocaleDateString('pt-BR') })
      : null;
    const arrematacao = {
      id: banco.proximoId(),
      nomeLote: corpo.nomeLote,
      tipo: corpo.tipo,
      valor: String(corpo.valor ?? ''),
      userId: 1,
      parcelaPropostaId: proposta ? proposta.id : null,
      parcelaProposta: proposta ? { id: proposta.id } : null,
      createdAt: agora(),
      updatedAt: agora(),
    };
    banco.arrematacoes.unshift(arrematacao);
    return arrematacao;
  }],
  ['patch', 'arrematacao/:x', ({ p, corpo }) => Object.assign(acharPorId(banco.arrematacoes, p[1]) || {}, corpo, { updatedAt: agora() })],
  ['delete', 'arrematacao/:x', ({ p }) => remover(banco.arrematacoes, p[1])],

  ['get', 'oportunidades', () => ({ total: banco.oportunidades.length, data: banco.oportunidades })],
  ['get', 'oportunidades/lote/fotos/:x', ({ p }) => banco.fotosPorLote[p[3]] || []],

  ['get', 'notificacoes/user/:x', () => banco.notificacoes],
  ['patch', 'notificacoes/:x/read', ({ p }) => Object.assign(acharPorId(banco.notificacoes, p[1]) || {}, { lida: true })],

  ['get', 'cupom', () => banco.cupons],
  ['post', 'cupom', ({ corpo }) => {
    const cupom = { id: banco.proximoId(), active: true, quantidade_usos: Number(corpo.quantidade_usos) || 0, quantidade_usos_og: Number(corpo.quantidade_usos) || 0, ...corpo };
    if (cupom.valido_ate && !String(cupom.valido_ate).includes('T')) cupom.valido_ate = `${cupom.valido_ate}T00:00:00.000Z`;
    banco.cupons.unshift(cupom);
    return cupom;
  }],
  ['put', 'cupom/deactivate/:x', ({ p }) => Object.assign(acharPorId(banco.cupons, p[2]) || {}, { active: false })],
  ['delete', 'cupom/:x', ({ p }) => remover(banco.cupons, p[1])],

  // Em vez de abrir o Mercado Pago, o "checkout" leva direto para a tela de pagamento aprovado
  ['post', 'payments/checkout', () => ({ init_point: '#/pagamento/sucesso' })],
  ['post', 'payments/cupom', () => ({ message: 'ok' })],
  ['post', 'enviar-email/:x', () => ({ message: 'Demonstração: nenhum e-mail foi enviado.' })],
];

const casa = (padrao, partes) => {
  const segmentos = padrao.split('/');
  return segmentos.length === partes.length && segmentos.every((s, i) => s === ':x' || s === partes[i]);
};

export default async function adaptadorDemo(config) {
  const metodo = (config.method || 'get').toLowerCase();
  const { partes, params } = lerUrl(config);
  const rota = rotas.find(([m, padrao]) => m === metodo && casa(padrao, partes));

  await new Promise((resolve) => setTimeout(resolve, 120));

  if (!rota && metodo === 'get') {
    console.warn('[demo] rota sem dados fictícios:', metodo.toUpperCase(), partes.join('/'));
  }

  let data;
  try {
    data = rota ? rota[2]({ p: partes, params, corpo: lerCorpo(config) }) : metodo === 'get' ? [] : {};
  } catch (erro) {
    const resposta = { data: { message: 'Erro na demonstração' }, status: 500, statusText: 'Erro', headers: {}, config };
    throw new AxiosError(erro.message, AxiosError.ERR_BAD_RESPONSE, config, null, resposta);
  }

  // Cópia profunda: as telas mexem nos objetos recebidos e não podem alterar o "banco" sem querer
  const corpo = data === undefined ? '' : JSON.parse(JSON.stringify(data));
  return { data: corpo, status: 200, statusText: 'OK', headers: { 'content-type': 'application/json' }, config, request: {} };
}
