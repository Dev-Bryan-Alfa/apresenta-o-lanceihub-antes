// Dados fictícios do modo demonstração. Nenhum nome, e-mail, CPF ou valor aqui é real.

const DIA = 24 * 60 * 60 * 1000;

const doisDigitos = (n) => String(n).padStart(2, '0');

export const daquiA = (dias) => new Date(Date.now() + dias * DIA);

// "YYYY-MM-DD" no fuso local (os campos de data das telas antigas esperam esse formato)
export const isoDia = (d) =>
  `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;

export const dataBR = (d) =>
  `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;

export const deDataBR = (texto) => {
  const [dia, mes, ano] = String(texto || '').split('/').map(Number);
  return dia && mes && ano ? new Date(ano, mes - 1, dia) : new Date();
};

export const somarMeses = (d, meses) => {
  const nova = new Date(d);
  nova.setMonth(nova.getMonth() + meses);
  return nova;
};

export const USUARIO_DEMO = {
  id: 1,
  nome: 'Usuário Demonstração',
  name: 'Usuário Demonstração',
  email: 'demo@lanceihub.com',
};

// Foto ilustrativa em SVG, para os cards de oportunidade não dependerem de imagens externas
export function fotoIlustrativa(cor1, cor2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="384" viewBox="0 0 640 384">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${cor1}"/><stop offset="1" stop-color="${cor2}"/></linearGradient></defs>
<rect width="640" height="384" fill="url(#g)"/>
<g fill="#ffffff" fill-opacity="0.9">
<rect x="150" y="170" width="120" height="150" rx="4"/><rect x="290" y="110" width="110" height="210" rx="4"/><rect x="420" y="200" width="80" height="120" rx="4"/>
</g>
<g fill="${cor2}" fill-opacity="0.55">
<rect x="170" y="195" width="24" height="24"/><rect x="226" y="195" width="24" height="24"/><rect x="170" y="240" width="24" height="24"/><rect x="226" y="240" width="24" height="24"/>
<rect x="310" y="135" width="22" height="22"/><rect x="358" y="135" width="22" height="22"/><rect x="310" y="180" width="22" height="22"/><rect x="358" y="180" width="22" height="22"/><rect x="310" y="225" width="22" height="22"/><rect x="358" y="225" width="22" height="22"/>
<rect x="440" y="225" width="40" height="30"/>
</g>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function lanceBase(sobrescrever) {
  return {
    link_leilao: 'https://alfaleiloes.com',
    objeto_penhora: 'Imóvel residencial',
    tipo_imovel: 'Apartamento',
    metragem: '78',
    valor_mercado: '620000',
    lucro_almejado: '25',
    valor_primeira_praca: '620000',
    valor_segunda_praca: '372000',
    valor_terceira_praca: '',
    desagio: '40',
    desagio_terceira_praca: '',
    endereco: 'Rua das Acácias, 120 - apto 52 - Moema, São Paulo/SP',
    zoneamento: 'ZM',
    coeficiente_aproveitamento: '',
    taxa_ocupacao: '',
    taxa_permeabilidade: '',
    gabarito_altura: '',
    ocupado: 'Não',
    aceita_parcelamento: 'Sim',
    valorizacao: '',
    lucro_minimo_esperado: '15',
    sugestao: '',
    leiloeiro: 'Alfa Leilões',
    titulo: 'Lote 001',
    descricao_lote: 'Apartamento com 2 dormitórios, sala, cozinha, área de serviço e 1 vaga de garagem.',
    tipoPracas: 'Dupla',
    data_primeira_praca: isoDia(daquiA(9)),
    data_segunda_praca: isoDia(daquiA(23)),
    data_terceira_praca: '',
    valor_oferta: '380000',
    comissao_leiloeiro: '5',
    honorarios_advocaticios_acessoria: '3',
    quitacao_direitos: '0',
    outros_custos_arrematacao: '0',
    meses_iptu: '8',
    valor_mensal_iptu: '180',
    meses_condominio: '8',
    valor_mensal_condominio: '750',
    meses_taxa_associativa: '0',
    valor_mensal_taxa_associativa: '0',
    meses_outros_custos: '0',
    valor_mensal_outros_custos: '0',
    meses_redutor_custos: '0',
    valor_mensal_redutor_custos: '0',
    itbi: '3',
    registro_arrematacao: '3200',
    custas_judiciais: '1500',
    escritura_publica: '0',
    outros_custos_transferencia: '0',
    descricao_outros_custos_transferencia: '',
    chaveiro: '400',
    caminhao_mudanca: '0',
    reforma: '25000',
    outros_custos_imissao: '0',
    descricao_outros_custos_imissao: '',
    comissao_corretor: '6',
    lucro_imobiliario: '15',
    desconto_venda_rapida: '10',
    mostrarLanceNaoVantajoso: true,
    lanceNaoVantajoso: false,
    ...sobrescrever,
  };
}

function propostaBase(lance) {
  return {
    link_leilao: lance.link_leilao,
    objeto_penhora: lance.objeto_penhora,
    tipo_imovel: lance.tipo_imovel,
    metragem: lance.metragem,
    valor_mercado: lance.valor_mercado,
    lucro_almejado: lance.lucro_almejado,
    valor_primeira_praca: lance.valor_primeira_praca,
    valor_segunda_praca: lance.valor_segunda_praca,
    endereco: lance.endereco,
    ocupado: lance.ocupado,
    leiloeiro: lance.leiloeiro,
    titulo: lance.titulo,
    descricao_lote: lance.descricao_lote,
    valor_oferta: lance.valor_oferta,
    entrada: '25',
    parcelas: '30',
    comissao_leiloeiro: lance.comissao_leiloeiro,
    honorarios_advocaticios_assessoria: lance.honorarios_advocaticios_acessoria,
    itbi: lance.itbi,
    registro_arrematacao: lance.registro_arrematacao,
    custas_judiciais: lance.custas_judiciais,
    chaveiro: lance.chaveiro,
    reforma: lance.reforma,
    comissao_corretor: lance.comissao_corretor,
    ir_lucro: lance.lucro_imobiliario,
    desconto_venda_rapida: lance.desconto_venda_rapida,
  };
}

const ITENS_CHECKLIST = [
  'tipo_imovel',
  'finalidade',
  'valor_avaliacao',
  'descricao_imovel',
  'analisou_edital',
  'objeto_leilao',
  'desconto',
  'condicoes_venda',
  'onus_dividas',
  'visitacao',
  'orcamento',
];

function loteChecklist(id, checklistId, nome, status) {
  const vazio = Object.fromEntries(ITENS_CHECKLIST.map((campo) => [campo, '']));
  const pendentes = Object.fromEntries(ITENS_CHECKLIST.map((campo) => [`status_${campo}`, 'pendente']));
  return { id, nome, userId: 1, checklistId, loteId: null, ...vazio, ...pendentes, ...status };
}

// Gera as parcelas de uma proposta como o backend antigo fazia: entrada + saldo dividido,
// com as parcelas já vencidas corrigidas pelo índice e marcadas como pagas.
export function gerarParcelas(proposta, proximoId) {
  const valor = Number(proposta.valorArrematacao) || 0;
  const entrada = (valor * (Number(proposta.porcentagemEntrada) || 0)) / 100;
  const quantidade = Math.max(1, Number(proposta.quantidadeParcelas) || 1);
  const base = (valor - entrada) / quantidade;
  const assinatura = deDataBR(proposta.dataAssinaturaAutoArrematacao);
  const hoje = new Date();
  let acumulado = 1;

  const parcelas = [];
  for (let numero = 1; numero <= quantidade; numero += 1) {
    const vencimento = somarMeses(assinatura, numero);
    const vencida = vencimento <= hoje;
    const indice = vencida ? 0.28 + ((numero * 7) % 5) / 10 : 0;
    acumulado *= 1 + indice / 100;
    parcelas.push({
      id: proximoId(),
      numero,
      indice,
      valor: Math.round(base * acumulado * 100) / 100,
      dataPagamento: dataBR(vencimento),
      ultimaAtualizacao: dataBR(vencida ? vencimento : hoje),
      pago: vencida,
    });
  }
  return { parcelaBase: Math.round(base * 100) / 100, parcelas };
}

export function criarBanco() {
  let sequencia = 1000;
  const proximoId = () => {
    sequencia += 1;
    return sequencia;
  };

  const lanceMoema = lanceBase({});
  const lanceCampinas = lanceBase({
    tipo_imovel: 'Casa',
    metragem: '210',
    valor_mercado: '980000',
    valor_primeira_praca: '980000',
    valor_segunda_praca: '588000',
    endereco: 'Rua Coronel Quirino, 845 - Cambuí, Campinas/SP',
    descricao_lote: 'Casa térrea com 3 suítes, piscina e 4 vagas de garagem.',
    titulo: 'Lote 014',
    valor_oferta: '610000',
    ocupado: 'Sim',
    reforma: '40000',
    data_primeira_praca: isoDia(daquiA(2)),
    data_segunda_praca: isoDia(daquiA(16)),
  });
  const lanceCuritiba = lanceBase({
    tipo_imovel: 'Sala comercial',
    objeto_penhora: 'Imóvel comercial',
    metragem: '42',
    valor_mercado: '310000',
    valor_primeira_praca: '310000',
    valor_segunda_praca: '155000',
    desagio: '50',
    endereco: 'Av. Sete de Setembro, 2775 - sala 1204 - Centro, Curitiba/PR',
    descricao_lote: 'Sala comercial com banheiro privativo e 1 vaga rotativa.',
    titulo: 'Lote 003',
    valor_oferta: '172000',
    meses_condominio: '6',
    valor_mensal_condominio: '520',
    reforma: '8000',
    data_primeira_praca: isoDia(daquiA(-12)),
    data_segunda_praca: isoDia(daquiA(5)),
  });
  const lanceRibeirao = lanceBase({
    tipo_imovel: 'Terreno',
    objeto_penhora: 'Terreno urbano',
    metragem: '360',
    valor_mercado: '240000',
    valor_primeira_praca: '240000',
    valor_segunda_praca: '144000',
    endereco: 'Rua Aurora, lote 18, quadra C - Jardim Botânico, Ribeirão Preto/SP',
    descricao_lote: 'Terreno plano de 12 x 30 m em loteamento fechado.',
    titulo: 'Lote 022',
    valor_oferta: '150000',
    meses_condominio: '0',
    valor_mensal_condominio: '0',
    meses_taxa_associativa: '10',
    valor_mensal_taxa_associativa: '390',
    reforma: '0',
    chaveiro: '0',
  });

  const calculadoras = [
    { id: 101, nome: 'Apartamento 2 dorms - Moema/SP', data: daquiA(-1).toISOString(), lote_id: 'LOTE-001', user_id: 1, lance: lanceMoema, proposta_compra: propostaBase(lanceMoema) },
    { id: 102, nome: 'Casa térrea - Cambuí, Campinas/SP', data: daquiA(-4).toISOString(), lote_id: 'LOTE-014', user_id: 1, lance: lanceCampinas, proposta_compra: null },
    { id: 103, nome: 'Sala comercial - Centro, Curitiba/PR', data: daquiA(-9).toISOString(), lote_id: 'LOTE-003', user_id: 1, lance: lanceCuritiba, proposta_compra: null },
    { id: 104, nome: 'Terreno 360 m² - Ribeirão Preto/SP', data: daquiA(-15).toISOString(), lote_id: 'LOTE-022', user_id: 1, lance: lanceRibeirao, proposta_compra: null },
    { id: 105, nome: 'Galpão logístico - Guarulhos/SP', data: daquiA(-27).toISOString(), lote_id: null, user_id: 1, lance: null, proposta_compra: null },
  ];

  const checklists = [
    { id: 201, nome: 'Apartamento 2 dorms - Moema/SP', descricao: 'Leilão judicial, 2ª praça com 40% de deságio.', link: 'https://alfaleiloes.com', data: daquiA(-1).toISOString(), calculadoraId: 101, userId: 1 },
    { id: 202, nome: 'Casa térrea - Cambuí, Campinas/SP', descricao: 'Imóvel ocupado, verificar ação de imissão na posse.', link: 'https://alfaleiloes.com', data: daquiA(-4).toISOString(), calculadoraId: 102, userId: 1 },
    { id: 203, nome: 'Cobertura duplex - Barra da Tijuca/RJ', descricao: 'Avaliar dívidas de condomínio antes do lance.', link: 'https://alfaleiloes.com', data: daquiA(-6).toISOString(), calculadoraId: null, userId: 1 },
    { id: 204, nome: 'Chácara 2.000 m² - Atibaia/SP', descricao: 'Visitar antes da 1ª praça.', link: 'https://alfaleiloes.com', data: daquiA(-18).toISOString(), calculadoraId: null, userId: 1 },
  ];

  const checklistLotes = [
    loteChecklist(301, 201, 'Apartamento 2 dorms - Moema/SP', {
      status_tipo_imovel: 'Urbano Residencial',
      status_finalidade: 'Revenda',
      status_objeto_leilao: 'Propriedade',
      status_valor_avaliacao: 'feito',
      status_descricao_imovel: 'feito',
      status_analisou_edital: 'feito',
      status_desconto: 'feito',
      status_condicoes_venda: 'em_analise',
      status_onus_dividas: 'em_analise',
    }),
    loteChecklist(302, 202, 'Casa térrea - Cambuí, Campinas/SP', {
      status_tipo_imovel: 'Urbano Residencial',
      status_finalidade: 'Uso Próprio, Revenda',
      status_valor_avaliacao: 'feito',
      status_analisou_edital: 'em_analise',
    }),
    loteChecklist(303, 203, 'Cobertura duplex - Barra da Tijuca/RJ', {
      status_tipo_imovel: 'Urbano Residencial',
      status_valor_avaliacao: 'em_analise',
    }),
    loteChecklist(304, 204, 'Chácara 2.000 m² - Atibaia/SP', {
      status_tipo_imovel: 'Rural Chácara',
      status_finalidade: 'Uso Próprio',
    }),
  ];

  const encerramentos = [
    { id: 401, nome: 'Casa térrea - Cambuí, Campinas/SP', link: 'https://alfaleiloes.com', data_primeira_praca: isoDia(daquiA(2)), data_segunda_praca: isoDia(daquiA(16)), calculadoraId: 102, checklistId: 202, userId: 1 },
    { id: 402, nome: 'Sala comercial - Centro, Curitiba/PR', link: 'https://alfaleiloes.com', data_primeira_praca: isoDia(daquiA(-12)), data_segunda_praca: isoDia(daquiA(5)), calculadoraId: 103, checklistId: null, userId: 1 },
    { id: 403, nome: 'Apartamento 2 dorms - Moema/SP', link: 'https://alfaleiloes.com', data_primeira_praca: isoDia(daquiA(9)), data_segunda_praca: isoDia(daquiA(23)), calculadoraId: 101, checklistId: 201, userId: 1 },
    { id: 404, nome: 'Chácara 2.000 m² - Atibaia/SP', link: 'https://alfaleiloes.com', data_primeira_praca: isoDia(daquiA(31)), data_segunda_praca: isoDia(daquiA(45)), calculadoraId: null, checklistId: 204, userId: 1 },
  ];

  const propostaMoema = {
    id: 501,
    nome: 'Apartamento 2 dorms - Moema/SP',
    valorArrematacao: 380000,
    quantidadeParcelas: 30,
    porcentagemEntrada: 25,
    indice: 'IPCA',
    dataAssinaturaAutoArrematacao: dataBR(somarMeses(new Date(), -7)),
    calcularAutomaticamente: true,
    calculadoraId: 101,
    finished: false,
    saldoRemanescente: 0,
  };
  const propostaGalpao = {
    id: 502,
    nome: 'Galpão logístico - Guarulhos/SP',
    valorArrematacao: 1250000,
    quantidadeParcelas: 12,
    porcentagemEntrada: 30,
    indice: 'IGP-M',
    dataAssinaturaAutoArrematacao: dataBR(somarMeses(new Date(), -2)),
    calcularAutomaticamente: true,
    calculadoraId: null,
    finished: false,
    saldoRemanescente: 0,
  };
  const parcelasPropostas = [propostaMoema, propostaGalpao].map((p) => ({ ...p, ...gerarParcelas(p, proximoId) }));
  parcelasPropostas.forEach((p) => {
    p.saldoRemanescente = Math.round(p.parcelas.filter((x) => !x.pago).reduce((s, x) => s + x.valor, 0) * 100) / 100;
  });

  const arrematacoes = [
    { id: 601, nomeLote: 'Apartamento 2 dorms - Moema/SP', tipo: 'PROPOSTA', valor: '380000', userId: 1, parcelaPropostaId: 501, parcelaProposta: { id: 501 }, createdAt: daquiA(-210).toISOString(), updatedAt: daquiA(-210).toISOString() },
    { id: 602, nomeLote: 'Studio 32 m² - Pinheiros/SP', tipo: 'LANCE', valor: '268000', userId: 1, parcelaPropostaId: null, parcelaProposta: null, createdAt: daquiA(-95).toISOString(), updatedAt: daquiA(-95).toISOString() },
  ];

  const leiloes = [
    { nome: 'Leilão Judicial – Apartamento em Moema', uf: '.8.26.', sub: 35, titulo: 'Apartamento 78 m² com vaga', minimo: 372000, avaliacao: 620000, desconto: '40%', dias: 9, cores: ['#5524E8', '#42ACF0'] },
    { nome: 'Leilão Judicial – Casa em Belo Horizonte', uf: '.8.13.', sub: 19, titulo: 'Casa 3 quartos no Santa Amélia', minimo: 415000, avaliacao: 690000, desconto: '40%', dias: 12, cores: ['#0f766e', '#5eead4'] },
    { nome: 'Leilão Extrajudicial – Sala comercial em Curitiba', uf: '.8.16.', sub: 20, titulo: 'Sala comercial 42 m² no Centro', minimo: 155000, avaliacao: 310000, desconto: '50%', dias: 5, cores: ['#1e3a8a', '#60a5fa'] },
    { nome: 'Leilão Judicial – Cobertura na Barra da Tijuca', uf: '.8.19.', sub: 18, titulo: 'Cobertura duplex 180 m²', minimo: 1180000, avaliacao: 1980000, desconto: '40%', dias: 21, cores: ['#7c2d12', '#fb923c'] },
    { nome: 'Leilão Judicial – Terreno em Florianópolis', uf: '.8.24.', sub: 24, titulo: 'Terreno 450 m² no Campeche', minimo: 298000, avaliacao: 540000, desconto: '45%', dias: 17, cores: ['#365314', '#a3e635'] },
    { nome: 'Leilão Extrajudicial – Galpão em Porto Alegre', uf: '.8.21.', sub: 21, titulo: 'Galpão 1.200 m² com docas', minimo: 960000, avaliacao: 1750000, desconto: '45%', dias: 26, cores: ['#3f3f46', '#a1a1aa'] },
    { nome: 'Leilão Judicial – Chácara em Atibaia', uf: '.8.26.', sub: 27, titulo: 'Chácara 2.000 m² com casa sede', minimo: 470000, avaliacao: 820000, desconto: '43%', dias: 31, cores: ['#14532d', '#4ade80'] },
  ];
  const oportunidades = leiloes.map((l, i) => {
    const loteId = 9100 + i;
    return {
      id: 700 + i,
      leilaoId: 8100 + i,
      titulo: l.nome,
      status: l.dias > 15 ? 'Futuro' : 'Aberto',
      createdAt: daquiA(-3).toISOString(),
      dados: {
        nome: l.nome,
        desconto: l.desconto,
        data_inicial1: daquiA(l.dias).toISOString(),
        lotes: [
          {
            id: loteId,
            titulo: l.titulo,
            num_processo: `100${4520 + i}-${10 + i}.2025${l.uf}${String(100 + i * 7).padStart(4, '0')}`,
            subcategoria: l.sub,
            valor_minimo: l.minimo,
            avaliacao: l.avaliacao,
          },
        ],
      },
    };
  });
  const fotosPorLote = Object.fromEntries(
    leiloes.map((l, i) => [
      9100 + i,
      [
        { foto: fotoIlustrativa(l.cores[0], l.cores[1]) },
        { foto: fotoIlustrativa(l.cores[1], l.cores[0]) },
      ],
    ])
  );

  const pessoas = [
    ['Mariana Alves', 'mariana.alves', 'active', 'pagamento_mp_1'],
    ['Rafael Souza', 'rafael.souza', 'active', 'cupom_registered'],
    ['Juliana Ferreira', 'juliana.ferreira', 'active', 'pagamento_mp_2'],
    ['Carlos Eduardo Lima', 'carlos.lima', 'pending', 'pagamento_mp_3'],
    ['Beatriz Rocha', 'beatriz.rocha', 'active', 'pagamento_mp_4'],
    ['Thiago Martins', 'thiago.martins', 'active', 'cupom_registered'],
    ['Fernanda Costa', 'fernanda.costa', null, null],
    ['André Nascimento', 'andre.nascimento', 'active', 'pagamento_mp_5'],
  ];
  const usuarios = [
    {
      id: 1,
      email: USUARIO_DEMO.email,
      nome: USUARIO_DEMO.nome,
      cpf: '000.000.001-91',
      contato: '(11) 90000-0001',
      dataNascimento: '1990-01-01',
      foto: null,
      active: true,
      createdAt: daquiA(-300).toISOString(),
      _count: { calculadoras: calculadoras.length, checklists: checklists.length, encerramentos: encerramentos.length, parcelaProposta: 2, Arrematacao: 2 },
      payment: { status: 'active', paymentId: 'pagamento_mp_0', planName: '12month', expiresIn: daquiA(65).toISOString() },
    },
    ...pessoas.map(([nome, usuario, status, paymentId], i) => ({
      id: 2 + i,
      email: `${usuario}@exemplo.com.br`,
      nome,
      cpf: `000.000.0${10 + i}-${String(11 + i * 7).slice(-2)}`,
      contato: `(11) 90000-00${String(10 + i)}`,
      dataNascimento: `19${80 + i}-0${(i % 9) + 1}-15`,
      foto: null,
      active: status !== null,
      createdAt: daquiA(-200 + i * 22).toISOString(),
      _count: { calculadoras: (i * 3) % 7, checklists: (i * 2) % 5, encerramentos: i % 4, parcelaProposta: i % 2, Arrematacao: i % 3 },
      payment: status
        ? {
            status,
            paymentId,
            planName: ['1month', '3month', '6month', '12month'][i % 4],
            expiresIn: daquiA(paymentId === 'cupom_registered' ? 6 + i : 40 + i * 9).toISOString(),
          }
        : null,
    })),
  ];

  const cadastrosPorMes = {};
  [9, 14, 11, 18, 23, 17, 26, 31, 28].forEach((quantidade, i) => {
    const mes = somarMeses(new Date(), i - 9);
    cadastrosPorMes[`${mes.getFullYear()}-${doisDigitos(mes.getMonth() + 1)}`] = quantidade;
  });

  const notificacoes = pessoas.slice(0, 4).map(([nome, usuario], i) => ({
    id: 801 + i,
    titulo: 'Novo usuário',
    mensagem: `${nome} (${usuario}@exemplo.com.br) acabou de se cadastrar.`,
    usuarioId: 1,
    lida: i > 1,
    createdAt: daquiA(-i * 2).toISOString(),
    tipo: 'Novo Usuário cadastrado',
    encerramentoId: null,
  }));

  const cupons = [
    { id: 901, codigo: 'BEMVINDO30', valido_ate: daquiA(40).toISOString(), duracao_dias: 30, quantidade_usos: 37, quantidade_usos_og: 50, active: true },
    { id: 902, codigo: 'PARCEIRO60', valido_ate: daquiA(90).toISOString(), duracao_dias: 60, quantidade_usos: 8, quantidade_usos_og: 10, active: true },
    { id: 903, codigo: 'FEIRAIMOVEIS', valido_ate: daquiA(-20).toISOString(), duracao_dias: 15, quantidade_usos: 0, quantidade_usos_og: 100, active: false },
  ];

  return {
    proximoId,
    calculadoras,
    checklists,
    checklistLotes,
    encerramentos,
    parcelasPropostas,
    arrematacoes,
    oportunidades,
    fotosPorLote,
    usuarios,
    cadastrosPorMes,
    notificacoes,
    cupons,
  };
}
