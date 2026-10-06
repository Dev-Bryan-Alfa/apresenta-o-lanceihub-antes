import { useState, useMemo, useEffect } from "react";
import Context from "./Context";
import useLocalStorage from "../hooks/useLocalStorage";
import axiosBase from "../axios/axiosBase";
import api from "../axios/axiosBase";

const mapLance = {
  linkLeilao: "link_leilao",
  objetoPenhora: "objeto_penhora",
  tipoImovel: "tipo_imovel",
  metragem: "metragem",
  valorMercado: "valor_mercado",

  valor1Praca: "valor_primeira_praca",
  valor2Praca: "valor_segunda_praca",
  valor3Praca: "valor_terceira_praca",
  desagio3Praca: "desagio_terceira_praca",
  desagio: "desagio",
  endereco: "endereco",
  zoneamento: "zoneamento",
  coeficienteAproveitamento: "coeficiente_aproveitamento",
  taxaOcupacao: "taxa_ocupacao",
  taxaPermeabilidade: "taxa_permeabilidade",
  gabaritoAltura: "gabarito_altura",
  ocupado: "ocupado",
  aceitaParcelamento: "aceita_parcelamento",
  valorizacao: "valorizacao",

  lucroMinimo: "lucro_minimo_esperado",
  lucroAlmejado: "lucro_almejado",
  sugestao: "sugestao",
  descricao_lote: "descricao_lote",

  leiloeiro: "leiloeiro",
  titulo: "titulo",
  data1Praca: "data_primeira_praca",
  data2Praca: "data_segunda_praca",
  data3Praca: "data_terceira_praca",
  tipoPracas: "tipoPracas",

  valorOferta: "valor_oferta",
  comissaoLeiloeiro: "comissao_leiloeiro",
  honorarios: "honorarios_advocaticios_acessoria",
  quitacaoDireitos: "quitacao_direitos",
  outrosCustos: "outros_custos_arrematacao",

  iptuMeses: "meses_iptu",
  iptuValorMensal: "valor_mensal_iptu",

  condominioMeses: "meses_condominio",
  condominioValorMensal: "valor_mensal_condominio",

  taxaAssociativaMeses: "meses_taxa_associativa",
  taxaAssociativaValorMensal: "valor_mensal_taxa_associativa",

  outrosCustosVendaMeses: "meses_outros_custos",
  outrosCustosVendaValorMensal: "valor_mensal_outros_custos",

  redutorCustosMeses: "meses_redutor_custos",
  redutorCustosValorMensal: "valor_mensal_redutor_custos",

  itbiPerc: "itbi",
  registroArrematacao: "registro_arrematacao",
  custasJudiciais: "custas_judiciais",
  escrituraPublica: "escritura_publica",
  outrosCustosDoc: "outros_custos_transferencia",
  outrosCustosDocDescricao: "descricao_outros_custos_transferencia",

  chaveiro: "chaveiro",
  caminhaoMudanca: "caminhao_mudanca",
  reforma: "reforma",
  outrosCustosImissao: "outros_custos_imissao",
  outrosCustosImissaoDescricao: "descricao_outros_custos_imissao",

  comissaoCorretorPerc: "comissao_corretor",
  irLucroImobiliarioPerc: "lucro_imobiliario",
  descontoVendaRapidaPerc: "desconto_venda_rapida",
  mostrarLanceNaoVantajoso: "mostrarLanceNaoVantajoso",
  lanceNaoVantajoso: "lanceNaoVantajoso",
};

const mapProposta = {
  linkLeilao: "link_leilao",
  objetoPenhora: "objeto_penhora",
  tipoImovel: "tipo_imovel",
  metragem: "metragem",
  valorMercado: "valor_mercado",

  // "parcelasCustosMeses": "valor_mensal_parcelas",
  descricao_lote: "descricao_lote",

  valor1Praca: "valor_primeira_praca",
  valor2Praca: "valor_segunda_praca",
  valor3Praca: "valor_terceira_praca",
  desagio3Praca: "desagio_terceira_praca",

  desagio: "desagio",

  endereco: "endereco",
  zoneamento: "zoneamento",
  coeficienteAproveitamento: "coeficiente_aproveitamento",
  taxaOcupacao: "taxa_ocupacao",
  taxaPermeabilidade: "taxa_permeabilidade",
  gabaritoAltura: "gabarito_altura",
  ocupado: "ocupado",
  aceitaParcelamento: "aceita_parcelamento",
  valorizacao: "valorizacao",

  lucroAlmejado: "lucro_almejado",
  lucroMinimo: "lucro_minimo_esperado",
  sugestao: "sugestao",

  leiloeiro: "leiloeiro",
  titulo: "titulo",
  data1Praca: "data_primeira_praca",
  data2Praca: "data_segunda_praca",
  data3Praca: "data_terceira_praca",
  tipoPracas: "tipoPracas",

  valorOferta: "valor_oferta",
  entrada: "entrada",
  parcelas: "parcelas",
  comissaoLeiloeiro: "comissao_leiloeiro",
  honorarios: "honorarios_advocaticios_assessoria",
  quitacaoDireitos: "quitacao_direitos",
  outrosCustos: "outros_custos_arrematacao",

  iptuMeses: "meses_iptu",
  iptuValorMensal: "valor_mensal_iptu",

  condominioMeses: "meses_condominio",
  condominioValorMensal: "valor_mensal_condominio",

  taxaAssociativaMeses: "meses_taxa_associativa",
  taxaAssociativaValorMensal: "valor_mensal_taxa_associativa",

  outrosCustosVendaMeses: "meses_outros_custos",
  outrosCustosVendaValorMensal: "valor_mensal_outros_custos",

  redutorCustosMeses: "meses_redutor_custos",
  redutorCustosValorMensal: "valor_mensal_redutor_custos",

  // parcelas??
  valorMensalParcelas: "valor_mensal_parcelas",
  parcelasCustosMeses: "meses_parcelas",

  itbiPerc: "itbi",
  registroArrematacao: "registro_arrematacao",
  custasJudiciais: "custas_judiciais",
  escrituraPublica: "escritura_publica",
  outrosCustosDoc: "outros_custos_documentacao",
  outrosCustosDocDescricao: "descricao_outros_custos_documentacao",

  chaveiro: "chaveiro",
  caminhaoMudanca: "caminhao",
  reforma: "reforma",
  outrosCustosImissao: "outros_custos_imissao",
  outrosCustosImissaoDescricao: "descricao_custos_imissao",

  comissaoCorretorPerc: "comissao_corretor",
  irLucroImobiliarioPerc: "ir_lucro",
  descontoVendaRapidaPerc: "desconto_venda_rapida",

  valorVendaImovel: "valor_venda",
};

function getLoteId(url) {
  if (!url?.length || typeof url != "string") return null;
  const urlSplit = url.split("/");
  const index = urlSplit.findIndex((e) => e == "lote");
  return +urlSplit[index + 1];
}

export default function Provider({ children }) {
  const [user, setUser] = useLocalStorage("user", {});
  const [isAdmin, setIsAdmin] = useLocalStorage('amudsj', false)
  const [mostrarSugestao, setMostrarSugestao] = useState(false);
  const [cupomId, setCupomId] = useState(null)
  const [lanceGlobal, setLanceGlobal] = useState({});
  const [propostaGlobal, setPropostaGlobal] = useState({});
  const [calculadoraId, setCalculadoraId] = useState(null);
  const [tab, setTab] = useState("lance");
  const [usuarioCadastroId, setUsuarioCadastroId] = useLocalStorage(
    "userCadastradoId",
    null
  );
  // const [mostrarLanceNaoVantajoso, setMostrarLanceNaoVantajoso] = useState(true)
  const [activeTab, setActiveTab] = useState("lance");

  const [formData, setFormData] = useState({
    valorMercado: "",
    metragem: "",
    valor1Praca: "",
    valor2Praca: "",
    desagio: "",
    lucroMinimo: "",

    // Arrematação Parcelada
    apValorProposta: "",
    apEntrada: "",
    apParcelas: "",
    apComissaoPerc: "",
    apHonorarios: "",
    apQuitacao: "",
    apOutros: "",

    // Transferência e Documentação
    tdItbi: "",
    tdRegistro: "",
    tdCustas: "",
    tdEscritura: "",
    tdOutros: "",
    mostrarLanceNaoVantajoso: false,
  });

  // const [calculadoraSalvaChecklist, setCalculadoraChecklist] = useState()

  const [checklists, setChecklists] = useLocalStorage(
    "calculadoraItensChecklist",
    {}
  );
  const [itensLengthChecklists, setItensLengthChecklists] = useLocalStorage(
    "itensLengthChecklist",
    0
  );

  const [calculadoras, setCalculadoras] = useLocalStorage(
    "calculadoraItens",
    {}
  );
  const [itensLengthCalculadoras, setItensLengthCalculadoras] = useLocalStorage(
    "itensLength",
    0
  );

  const [calculadoraSalva, setCalculadoraSalva] = useState({});

  async function salvarLance() {
    // return alert('' + calculadoraId)
    console.log("salvando lance: ", lanceGlobal);
    const lote_id = getLoteId(lanceGlobal["linkLeilao"]);

    await axiosBase.put(`/calculadora/${calculadoraId}`, {
      lote_id,
    });

    if (tab == "lance") {
      console.log("Salvando lance");

      const converted = Object.keys(lanceGlobal).reduce((a, c) => {
        a[mapLance[c]] = lanceGlobal[c];
        return a;
      }, {});
      delete converted["undefined"];

      if (converted.tipoPracas == "Única") {
        converted.data_segunda_praca = null;
        converted.data_terceira_praca = null;
      }

      if (converted.tipoPracas == "Dupla") {
        converted.data_terceira_praca = null;
      }

      await axiosBase.put(`/calculadora/${calculadoraId}/lance`, converted);

      const { data: calculadoraAtualizada } = await api.get(
        "/calculadora/" + calculadoraId
      );
      setCalculadoraSalva(calculadoraAtualizada);

      // console.log('lance global mostrar nao vantajoso: ', lanceGlobal.mostrarLanceNaoVantajoso)
      console.log(
        "mostrarLanceNaoVantajso",
        converted.mostrarLanceNaoVantajoso
      );
      console.log("lanceNaoVantajoso", converted.lanceNaoVantajoso);
      if (converted.mostrarLanceNaoVantajoso && converted.lanceNaoVantajoso) {
        setMostrarSugestao(true);
      }
    } else if (tab == "proposta") {
      console.log("Salvando proposta", propostaGlobal);
      const converted = Object.keys(propostaGlobal).reduce((a, c) => {
        a[mapProposta[c]] = propostaGlobal[c];
        return a;
      }, {});
      delete converted["undefined"];
      if (converted.tipoPracas == "Única") {
        converted.data_segunda_praca = null;
        converted.data_terceira_praca = null;
      }

      if (converted.tipoPracas == "Dupla") {
        converted.data_terceira_praca = null;
      }

      await axiosBase.put(`/calculadora/${calculadoraId}/proposta`, converted);

      const { data: calculadoraAtualizada } = await api.get(
        "/calculadora/" + calculadoraId
      );
      setCalculadoraSalva(calculadoraAtualizada);
    }
  }

  // async function getCalculadoraSalva() {
  //   const { data } = await api.get(
  //     "/calculadora/" + calculadoraId
  //   );
  //   // setCalculadoraChecklist(data)

  //   return data
  // }

  const [modalCreateChecklistAndReminder, setModalCreateChecklistAndReminder] =
    useState(false);

  async function dontShowAgain() {
    await axiosBase.put(`/calculadora/${calculadoraId}/lance`, {
      mostrarLanceNaoVantajoso: false,
    });
    setFormData((prev) => ({
      ...prev,
      mostrarLanceNaoVantajoso: false,
    }));
    setMostrarSugestao(false);
  }

  useEffect(() => {
    console.log('é adm: ', isAdmin)
  }, [isAdmin])

  // useEffect(() => {
  //   console.log(mostrarLanceNaoVantajoso, 'aqui')
  // }, [mostrarLanceNaoVantajoso])

  const value = useMemo(
    () => ({
      user,
      setUser,
      mostrarSugestao,
      setMostrarSugestao,
      lanceGlobal,
      setLanceGlobal,
      propostaGlobal,
      setPropostaGlobal,
      calculadoraId,
      setCalculadoraId,
      tab,
      setTab,
      salvarLance,
      checklists,
      setChecklists,
      itensLengthChecklists,
      setItensLengthChecklists,
      calculadoras,
      setCalculadoras,
      itensLengthCalculadoras,
      setItensLengthCalculadoras,
      usuarioCadastroId,
      setUsuarioCadastroId,
      // mostrarLanceNaoVantajoso,
      // setMostrarLanceNaoVantajoso,
      activeTab,
      setActiveTab,
      dontShowAgain,
      formData,
      setFormData,
      calculadoraSalva,
      setCalculadoraSalva,
      modalCreateChecklistAndReminder, setModalCreateChecklistAndReminder,
      cupomId,
      setCupomId,
      isAdmin,
      setIsAdmin
      // getCalculadoraSalva,
      // calculadoraSalvaChecklist,
      // setCalculadoraChecklist
    }),
    [
      user,
      mostrarSugestao,
      lanceGlobal,
      propostaGlobal,
      calculadoraId,
      checklists,
      itensLengthChecklists,
      calculadoras,
      itensLengthCalculadoras,
      usuarioCadastroId,
      // mostrarLanceNaoVantajoso,
      activeTab,
      formData,
      calculadoraSalva,
      setCalculadoraSalva,
      modalCreateChecklistAndReminder, setModalCreateChecklistAndReminder,
      cupomId,
      setCupomId,
      isAdmin
      // calculadoraSalvaChecklist,
      // setCalculadoraChecklist

    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
