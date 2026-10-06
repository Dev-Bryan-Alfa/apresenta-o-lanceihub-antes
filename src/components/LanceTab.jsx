import React, { useContext, useEffect, useMemo, useState } from "react";
// import SideNavigation from './SideNavigation';
import Context from "../context/Context";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMdArrowDropupCircle } from "react-icons/io";
import { NumericFormat } from "react-number-format";
import { formatarEmReais, formatarPercentual } from "./PropostaParcela";

import { IoIosArrowForward } from "react-icons/io";

import { IoIosArrowDown } from "react-icons/io";

function toNumberOrZero(value) {
  // nulos
  if (value == null) return 0;

  // já é number
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  // bigint -> converter para number se for finito
  if (typeof value === "bigint") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  // rejeitar booleanos explicitamente (se quiser true->1, mude aqui)
  if (typeof value === "boolean") return 0;

  // strings: tentar interpretar
  if (typeof value === "string") {
    let s = value.trim();
    if (s === "") return 0;

    // remover espaços internos
    s = s.replace(/\s+/g, "");

    // se tiver ambos '.' e ',', assumir que o separador decimal é o que aparece por último
    const lastDot = s.lastIndexOf(".");
    const lastComma = s.lastIndexOf(",");

    let prepared = s;
    if (lastDot > -1 && lastComma > -1) {
      if (lastComma > lastDot) {
        // vírgula é decimal, pontos são milhares
        prepared = s.replace(/\./g, "").replace(/,/g, ".");
      } else {
        // ponto é decimal, vírgulas são milhares
        prepared = s.replace(/,/g, "");
      }
    } else if (lastComma > -1) {
      // só vírgula -> tratar como decimal
      prepared = s.replace(/,/g, ".");
    } else {
      // só ponto ou nenhum -> manter (ponto é decimal)
      prepared = s;
    }

    // remover qualquer caractere inesperado (exceto sinais, dígitos, ponto, expoente)
    prepared = prepared.replace(/[^\d+\-\.eE]/g, "");

    // validar formato numérico simples (inclui expoente)
    if (/^[+-]?(?:\d+|\d+\.\d+|\.\d+)(?:[eE][+-]?\d+)?$/.test(prepared)) {
      const n = Number(prepared);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  }
}

const neonBlue = "#00FFFF";
const darkBackground = "#0a0a15";

const InputField = React.memo(
  ({
    label,
    field,
    value,
    onChange,
    unit = "",
    type = "text",
    readOnly = false,
  }) => {
    const isNumeric = type === "number";
    return (
      <div className="mb-4 w-full">
        {label && (
          <label
            htmlFor={field}
            className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
            style={{ color: neonBlue }}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {isNumeric ? (
            <NumericFormat
              id={field}
              value={value}
              onValueChange={
                readOnly ? undefined : (values) => onChange(field, values.value)
              }
              prefix={unit === "R$" ? "R$ " : undefined}
              suffix={unit === "%" ? "%" : undefined}
              thousandSeparator="."
              decimalSeparator=","
              placeholder={label}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              readOnly={readOnly}
              allowEmptyFormatting={true}
              style={{
                backgroundColor: darkBackground,
                borderColor: neonBlue,
                color: "white",
              }}
              className={`w-full rounded-lg py-2.5 sm:py-3 pl-3 pr-3 font-mono text-sm sm:text-base placeholder-opacity-50 focus:outline-none focus:ring-2 transition-shadow duration-300 ease-in-out shadow-sm hover:shadow-lg border !border-opacity-30 !border-white`}
              onFocus={(e) => (e.target.style.borderColor = neonBlue)}
              onBlur={(e) => (e.target.style.borderColor = neonBlue)}
              onMouseEnter={(e) =>
                (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
              }
              onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
            />
          ) : (
            <input
              id={field}
              type={type === "date" ? "date" : "text"}
              value={value ?? ""}
              onChange={
                readOnly ? undefined : (e) => onChange(field, e.target.value)
              }
              placeholder={label}
              autoComplete="off"
              spellCheck={false}
              readOnly={readOnly}
              style={{
                backgroundColor: darkBackground,
                borderColor: neonBlue,
                color: "white",
              }}
              className={`w-full rounded-lg py-2.5 sm:py-3 pl-3 pr-3 font-mono text-sm sm:text-base placeholder-opacity-50 focus:outline-none focus:ring-2 transition-shadow duration-300 ease-in-out shadow-sm hover:shadow-lg border !border-opacity-30 !border-white`}
              onFocus={(e) => (e.target.style.borderColor = neonBlue)}
              onBlur={(e) => (e.target.style.borderColor = neonBlue)}
              onMouseEnter={(e) =>
                (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
              }
              onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
            />
          )}
        </div>
      </div>
    );
  }
);

const SelectField = React.memo(({ label, field, value, onChange, options }) => (
  <div className="mb-4 w-full">
    <label
      htmlFor={field}
      className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
      style={{ color: neonBlue }}
    >
      {label}
    </label>
    <div className="relative">
      <select
        id={field}
        value={value ?? ""}
        onChange={(e) => onChange(field, e.target.value)}
        style={{
          borderColor: neonBlue,
          color: "white",
          backgroundColor: "transparent",
        }}
        className="
          w-full p-2 sm:p-3 font-montserrat text-sm sm:text-base
          focus:outline-none focus:ring-0 transition-shadow duration-300 ease-in-out
          border-b border-solid border-opacity-50 hover:border-opacity-100
          appearance-none cursor-pointer
        "
        onFocus={(e) => (e.target.style.borderColor = neonBlue)}
        onBlur={(e) => (e.target.style.borderColor = neonBlue)}
        onMouseEnter={(e) => (e.target.style.boxShadow = `0 1px 0 ${neonBlue}`)}
        onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
      >
        {options.map(({ value: optValue, label: optLabel }) => (
          <option
            key={optValue}
            value={optValue}
            style={{ backgroundColor: darkBackground, color: neonBlue }}
          >
            {optLabel}
          </option>
        ))}
      </select>
      <MdKeyboardArrowDown
        className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
        style={{ color: neonBlue }}
        size={20}
      />
    </div>
  </div>
));

const SectionContainer = ({ title, children, total, id }) => (
  <section
    id={id}
    style={{
      background: `#0000`,
    }}
    className="
        border-cyan-700
        border-2
        font-montserrat
      border rounded-3xl p-6 mb-8 shadow-lg
      hover:shadow-[0_8px_20px_rgba(0,255,255,0.5)] transition-shadow duration-400
      overflow-x-auto
        scrollbar-custom      
        scrollbar-no-buttons mt-5
    "
  >
    <h2
      className="text-xl font-extrabold font-montserrat mb-5 tracking-wide select-none drop-shadow-md"
      style={{ color: "white" }}
    >
      {title}
    </h2>
    <div className="grid grid-cols-2 gap-6">{children}</div>
    {typeof total === "number" && (
      <div
        className="mt-6 font-extrabold font-montserrat text-2xl text-left tracking-tight select-none drop-shadow-md"
        style={{ color: "#42ADF1" }}
      >
        Total: {formatarEmReais(total)}
      </div>
    )}
  </section>
);

// -- IMÓVEL Component -- //
const ImovelSection = ({ formData, onChange }) => {
  const valorOferta = toNumberOrZero(formData.valorOferta);
  const comissaoPerc = toNumberOrZero(formData.comissaoLeiloeiro);
  const honorariosPerc = toNumberOrZero(formData.honorarios);
  const outrosCustos = toNumberOrZero(formData.outrosCustos);
  const { mostrarLanceNaoVantajoso, setMostrarLanceNaoVantajoso } =
    useContext(Context);

  // Cálculos automáticos
  const comissaoValor =
    (toNumberOrZero(valorOferta) * toNumberOrZero(comissaoPerc)) / 100;
  const honorariosValor =
    (toNumberOrZero(valorOferta) * toNumberOrZero(honorariosPerc)) / 100;

  //   const totalArrematacao = +comissaoValor + honorariosValor + outrosCustos;

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!formData.desagio3Praca || !formData.valor1Praca) return;

    const valorCalculado =
      toNumberOrZero(formData.valor1Praca) -
      toNumberOrZero(formData.valor1Praca) *
      (toNumberOrZero(formData.desagio3Praca) / 100);
    //  (+formData.desagio3Praca / 100);

    // Atualiza o formData diretamente
    onChange("valor3Praca", valorCalculado);
  }, [formData.desagio3Praca, formData.valor1Praca]);

  useEffect(() => {
    if (!formData.desagio || !formData.valor1Praca) return;

    const valorCalculado =
      toNumberOrZero(formData.valor1Praca) -
      toNumberOrZero(formData.valor1Praca) *
      (toNumberOrZero(formData.desagio) / 100);

    // Atualiza o formData diretamente
    onChange("valor2Praca", String(valorCalculado));
  }, [formData.desagio, formData.valor1Praca]);

  return (
    <>
      <label
        className="text-white mb-4 cursor-pointer select-none transition-colors duration-200 flex items-center gap-3 font-light text-lg"
        onMouseEnter={(e) => (e.target.style.color = 'white')}
        onMouseLeave={(e) => (e.target.style.color = 'white')}
      >
        Habilitar informativo se o lance é ou não vantajoso?

        <button
          type="button"
          onClick={() =>
            onChange('mostrarLanceNaoVantajoso', !formData.mostrarLanceNaoVantajoso)
          }
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 
        ${formData.mostrarLanceNaoVantajoso
              ? 'bg-purple-900 shadow-md'
              : 'bg-gray-500/40'
            }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300
          ${formData.mostrarLanceNaoVantajoso
                ? 'translate-x-6'
                : 'translate-x-1'
              }`}
          />
        </button>
      </label>
      {/* Análise Comercial */}
      {!opened && (
        <div
          onClick={() => {
            setOpened(true);
          }}
          className="mb-10 relative px-4 py-5 text-white flex justify-between items-center cursor-pointer rounded-xl transition-all duration-300 hover:bg-purple-900/30  bg-purple-900/20"
        >
          <p className="text-xl tracking-wide font-semibold">
            Custos do Leilão
          </p>
          <IoIosArrowForward

            style={{ color: "white" }}
            size={24}
          />

        </div>
      )}

      {opened && (
        <>
          <div
            onClick={() => setOpened(false)}
            className="mb-10 relative px-4 py-5 text-white flex justify-between items-center cursor-pointer rounded-xl transition-all duration-300 hover:bg-purple-900/50  bg-purple-900/40"
          >
            <p className="text-xl tracking-wide font-semibold">
              Custos do Leilão
            </p>
            <IoIosArrowDown
              style={{ color: "white" }}
              size={24}
            />

          </div>
          <SectionContainer title="Custos do Leilão">
            <h2 className="col-span-2">Dados do Leilão</h2>
            <InputField
              label="Lote"
              field="titulo"
              value={formData.titulo}
              onChange={onChange}
            />
            <InputField
              label="Descrição do Lote"
              field="descricao_lote"
              value={formData.descricao_lote}
              onChange={onChange}
            />
            <InputField
              label="Link do Leilão"
              field="linkLeilao"
              value={formData.linkLeilao}
              onChange={onChange}
              type="url"
            />
            <InputField
              label="Tipo de Imóvel"
              field="tipoImovel"
              value={formData.tipoImovel}
              onChange={onChange}
            />

            <InputField
              label="Endereço"
              field="endereco"
              value={formData.endereco}
              onChange={onChange}
            />

            <InputField
              label="Observações"
              field="obs"
              value={formData.obs}
              onChange={onChange}
            />
            <SelectField
              label="Ocupado"
              field="ocupado"
              value={formData.ocupado}
              onChange={onChange}
              options={[
                { value: "", label: "Selecione" },
                { value: "Sim", label: "Sim" },
                { value: "Não", label: "Não" },
                { value: "Em Análise", label: "Em Análise" },
              ]}
            />

            <div className="col-span-2  !bg-cyan-400 !h-[2px]"></div>

            <h2 className="col-span-2">Valor do Imóvel</h2>

            {/* <InputField label="Deságio (%)" field="desagio" value={formData.desagio} onChange={onChange} unit="%" type="number" /> */}

            <SelectField
              label="Tipo do Praceamento"
              field="tipoPracas"
              value={formData.tipoPracas}
              onChange={onChange}
              options={[
                { value: "", label: "Selecione" },
                { value: "Única", label: "Praça Única" },
                { value: "Dupla", label: "1ª e 2ª Praça" },
                { value: "Tripla", label: "1ª, 2ª e 3ª Praça" },
              ]}
            />

            <InputField
              label="Valor de Mercado"
              field="valorMercado"
              value={formData.valorMercado}
              onChange={onChange}
              unit="R$"
              type="number"
            />

            { }

            {/* <InputField label="Deságio (%)" field="desagio" value={formData.desagio} onChange={onChange} unit="%" type="number" /> */}

            {formData.tipoPracas === "Única" && (
              <>
                <InputField
                  label="Valor Praça Unica"
                  field="valor1Praca"
                  value={formData.valor1Praca}
                  onChange={onChange}
                  unit="R$"
                  type="number"
                />

                <InputField
                  label="Data Praça Unica"
                  field="data1Praca"
                  value={formData.data1Praca}
                  onChange={onChange}
                  type="date"
                />
              </>
            )}

            {formData.tipoPracas === "Dupla" && (
              <>
                <div className="col-span-2 gap-5">
                  <div>
                    <h3>Informação da 1ª Praça</h3>
                    <div className="flex gap-5">
                      <InputField
                        label="Data 1ª Praça"
                        field="data1Praca"
                        value={formData.data1Praca}
                        onChange={onChange}
                        type="date"
                      />

                      <InputField
                        label="Valor 1ª Praça"
                        field="valor1Praca"
                        value={formData.valor1Praca}
                        onChange={onChange}
                        unit="R$"
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 gap-5 mt-4">
                    <div>
                      <div className="flex gap-5">
                        <InputField
                          label="Data 2ª Praça"
                          field="data2Praca"
                          value={formData.data2Praca}
                          onChange={onChange}
                          type="date"
                        />
                        <div>
                          <label
                            className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                            style={{ color: neonBlue }}
                          >
                            Deságio (%)
                          </label>
                          <input
                            type="text"
                            value={formData.desagio}
                            onChange={(e) =>
                              onChange("desagio", e.target.value)
                            }
                            className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                            style={{
                              borderColor: neonBlue,
                              color: "white",
                              backgroundColor: darkBackground,
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = neonBlue)
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = neonBlue)
                            }
                            onMouseEnter={(e) =>
                              (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.boxShadow = "none")
                            }
                          />
                        </div>

                        <InputField
                          label="Valor 2ª Praça"
                          field="valor2Praca"
                          value={formData.valor2Praca}
                          onChange={onChange}
                          unit="R$"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {formData.tipoPracas === "Tripla" && (
              <>
                <div className="col-span-2 gap-5">
                  <div>
                    <h3>Informação da 1ª Praça</h3>
                    <div className="flex gap-5">
                      <InputField
                        label="Data 1ª Praça"
                        field="data1Praca"
                        value={formData.data1Praca}
                        onChange={onChange}
                        type="date"
                      />

                      <InputField
                        label="Valor 1ª Praça"
                        field="valor1Praca"
                        value={formData.valor1Praca}
                        onChange={onChange}
                        unit="R$"
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 gap-5 mt-4">
                    <div>
                      <div className="flex gap-5">
                        <InputField
                          label="Data 2ª Praça"
                          field="data2Praca"
                          value={formData.data2Praca}
                          onChange={onChange}
                          type="date"
                        />
                        <div>
                          <label
                            className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                            style={{ color: neonBlue }}
                          >
                            Deságio (%)
                          </label>
                          <input
                            type="text"
                            // min="0"
                            // max="100"
                            // step="0.01"
                            value={formData.desagio}
                            onChange={(e) =>
                              onChange("desagio", e.target.value)
                            }
                            className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                            style={{
                              borderColor: neonBlue,
                              color: "white",
                              backgroundColor: darkBackground,
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = neonBlue)
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = neonBlue)
                            }
                            onMouseEnter={(e) =>
                              (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.boxShadow = "none")
                            }
                          />
                        </div>
                        <InputField
                          label="Valor 2ª Praça"
                          field="valor2Praca"
                          value={formData.valor2Praca}
                          onChange={onChange}
                          unit="R$"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 gap-5 mt-4">
                    <div>
                      <div className="flex gap-5 mt-4">
                        <InputField
                          label="Data 3ª Praça"
                          field="data3Praca"
                          value={formData.data3Praca}
                          onChange={onChange}
                          type="date"
                        />
                        <div>
                          <label
                            className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                            style={{ color: neonBlue }}
                          >
                            Deságio (%)
                          </label>
                          <input
                            type="text"
                            // min="0"
                            // max="100"
                            // step="0.01"
                            value={formData.desagio3Praca}
                            onChange={(e) =>
                              onChange("desagio3Praca", e.target.value)
                            }
                            className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                            style={{
                              borderColor: neonBlue,
                              color: "white",
                              backgroundColor: darkBackground,
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = neonBlue)
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = neonBlue)
                            }
                            onMouseEnter={(e) =>
                              (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.boxShadow = "none")
                            }
                          />
                        </div>
                        <InputField
                          label="Valor 3ª Praça"
                          field="valor3Praca"
                          value={formData.valor3Praca}
                          onChange={onChange}
                          unit="R$"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <InputField
                  label="Data 1ª Praça"
                  field="data1Praca"
                  value={formData.data1Praca}
                  onChange={onChange}
                  type="date"
                />
                <InputField
                  label="Data 2ª Praça"
                  field="data2Praca"
                  value={formData.data2Praca}
                  onChange={onChange}
                  type="date"
                />
                <InputField
                  label="Data 3ª Praça"
                  field="data3Praca"
                  value={formData.data3Praca}
                  onChange={onChange}
                  type="date"
                /> */}
              </>
            )}

            {/* Valor da Oferta */}
            <div className="col-span-2  !bg-cyan-400 !h-[2px]"></div>

            <h2 className="col-span-2">Simulação da Oferta</h2>
            <div>
              <label
                className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                style={{ color: neonBlue }}
              >
                Valor da Oferta
              </label>
              <InputField
                field="valorOferta"
                value={formData.valorOferta}
                onChange={onChange}
                unit="R$"
                type="number"
              />
            </div>

            {/* Comissão do Leiloeiro */}
            <InputField
              label="Comissão do Leiloeiro (%)"
              field="comissaoLeiloeiro"
              value={formData.comissaoLeiloeiro}
              onChange={onChange}
              unit="%"
              type="number"
            />
            <InputField
              label="Valor da Comissão do Leiloeiro"
              field="comissaoLeiloeiroValor"
              value={
                formData.comissaoLeiloeiro
                  ? comissaoValor.toFixed(2)
                  : formData.comissaoLeiloeiroValor || ""
              }
              onChange={onChange}
              unit="R$"
              type="number"
              readOnly={!!formData.comissaoLeiloeiro}
            />

            {/* Honorários Advocatícios */}
            <div className="flex gap-5">
              <div className="flex-1">
                <label
                  className="block text-xs pt-1 font-semibold mb-1 select-none font-montserrat"
                  style={{ color: neonBlue }}
                >
                  Honorários Advocatícios/Assessoria (%)
                </label>

                <NumericFormat
                  value={formData.honorarios}
                  onValueChange={(values) =>
                    onChange("honorarios", values.value)
                  }
                  suffix="%"
                  thousandSeparator="."
                  decimalSeparator=","
                  placeholder=" Honorários Advocatícios/Assessoria (%)"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    backgroundColor: darkBackground,
                    borderColor: neonBlue,
                    color: "white",
                  }}
                  className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                  onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                  onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                  onMouseEnter={(e) =>
                    (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                  }
                  onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                  style={{ color: neonBlue }}
                >
                  Valor dos Honorários Advocatícios/Assessoria
                </label>
                <InputField
                  field="valorLiquidoOferta"
                  value={
                    formData.honorarios
                      ? honorariosValor.toFixed(2)
                      : formData.valorLiquidoOferta || ""
                  }
                  onChange={onChange}
                  unit="R$"
                  type="number"
                  readOnly={!!formData.honorarios}
                />
              </div>
            </div>

            {/* Quitação de Direitos */}

            {/* Outros Custos */}
            <div>
              <label
                className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                style={{ color: neonBlue }}
              >
                Outros Custos
              </label>
              <InputField
                field="outrosCustos"
                value={formData.outrosCustos}
                onChange={onChange}
                unit="R$"
                type="number"
              />
            </div>
          </SectionContainer>
        </>
      )}
    </>
  );
};

const CalculadoraSection = ({ formData, onChange }) => {
  const { setMostrarSugestao } = useContext(Context);

  const itbiPerc = toNumberOrZero(formData.itbiPerc);
  const valorBase = toNumberOrZero(
    formData.valorBase || formData.valorOferta || 0
  ); // ajustar conforme seu contexto

  const itbiValorCalculado = (valorBase * itbiPerc) / 100;

  const registroArrematacao = toNumberOrZero(formData.registroArrematacao);
  const custasJudiciais = toNumberOrZero(formData.custasJudiciais);
  const outrosCustosDoc = toNumberOrZero(formData.outrosCustosDoc);

  const totalTransferenciaDoc =
    toNumberOrZero(itbiValorCalculado) +
    toNumberOrZero(registroArrematacao) +
    toNumberOrZero(custasJudiciais) +
    toNumberOrZero(outrosCustosDoc);

  // Parse números básicos
  const valorOferta = toNumberOrZero(formData.valorOferta);
  const comissaoPerc = toNumberOrZero(formData.comissaoLeiloeiro);
  const honorariosPerc = toNumberOrZero(formData.honorarios);
  const outrosCustos = toNumberOrZero(formData.outrosCustos);

  // Cálculos automáticos
  const comissaoValor =
    (toNumberOrZero(valorOferta) * toNumberOrZero(comissaoPerc)) / 100;
  const honorariosValor =
    (toNumberOrZero(valorOferta) * toNumberOrZero(honorariosPerc)) / 100;

  const totalArrematacao =
    toNumberOrZero(valorOferta) +
    toNumberOrZero(comissaoValor) +
    toNumberOrZero(honorariosValor) +
    toNumberOrZero(outrosCustos);


  // Custos até a Venda: agora com meses + valor mensal + total
  // Os campos esperados em formData para cada custo:
  // iptuMeses, iptuValorMensal, condominioMeses, condominioValorMensal, etc.

  const custosComTotal = useMemo(() => {
    const custos = [
      {
        label: "IPTU",
        meses: toNumberOrZero(formData.iptuMeses),
        valorMensal: toNumberOrZero(formData.iptuValorMensal),
        fieldMeses: "iptuMeses",
        fieldValor: "iptuValorMensal",
      },
      {
        label: "Condomínio",
        meses: toNumberOrZero(formData.condominioMeses),
        valorMensal: toNumberOrZero(formData.condominioValorMensal),
        fieldMeses: "condominioMeses",
        fieldValor: "condominioValorMensal",
      },
      {
        label: "Taxa Associativa",
        meses: toNumberOrZero(formData.taxaAssociativaMeses),
        valorMensal: toNumberOrZero(formData.taxaAssociativaValorMensal),
        fieldMeses: "taxaAssociativaMeses",
        fieldValor: "taxaAssociativaValorMensal",
      },
      // {
      //     label: "Parcelas (Custos até a venda)",
      //     meses: toNumberOrZero(formData.parcelasCustosMeses),
      //     valorMensal: toNumberOrZero(formData.valorParcelas),
      //     fieldMeses: "parcelasCustosMeses",
      //     fieldValor: "parcelasCustosMensal",
      // },
      {
        label: "Outros Custos",
        meses: toNumberOrZero(formData.outrosCustosVendaMeses),
        valorMensal: toNumberOrZero(formData.outrosCustosVendaValorMensal),
        fieldMeses: "outrosCustosVendaMeses",
        fieldValor: "outrosCustosVendaValorMensal",
      },
      {
        label: "Redutor de Custos (Locação)",
        meses: toNumberOrZero(formData.redutorCustosMeses),
        valorMensal: toNumberOrZero(formData.redutorCustosValorMensal),
        fieldMeses: "redutorCustosMeses",
        fieldValor: "redutorCustosValorMensal",
        isRedutor: true,
      },
    ];

    return custos.map(({ meses, valorMensal, isRedutor, ...rest }) => ({
      ...rest,
      meses,
      valorMensal,
      total: isRedutor
        ? -(toNumberOrZero(meses) * toNumberOrZero(valorMensal))
        : toNumberOrZero(meses) * toNumberOrZero(valorMensal),
    }));
  }, [
    formData.iptuMeses,
    formData.iptuValorMensal,
    formData.condominioMeses,
    formData.condominioValorMensal,
    formData.taxaAssociativaMeses,
    formData.taxaAssociativaValorMensal,
    formData.outrosCustosVendaMeses,
    formData.outrosCustosVendaValorMensal,
    formData.redutorCustosMeses,
    formData.redutorCustosValorMensal,
  ]);
  console.log(custosComTotal);
  const filteredCustos = custosComTotal.filter((item) => !item.isRedutor);
  const totalCustosVenda = useMemo(
    () => filteredCustos.reduce((acc, cur) => acc + cur.total, 0),
    [filteredCustos]
  );

  // Total por linha e total geral

  // console.log(custosComTotal)

  const [opened, setOpened] = useState(false);

  const contexto = useContext(Context);

  // Handler para mudar meses ou valor mensal
  // const handleMesesOuValorChange = (field, value) => {
  //     onChange(field, value);
  // };

  const sanitizeNumericString = (value) => {
    if (value === "") return ""; // permite apagar tudo
    // aceitar vírgula como separador (opcional)
    value = value.replace(",", ".");

    // Remove zeros à esquerda, preservando:
    // - "0"
    // - "0.5"
    // - "0."
    // - se usuário digitar "0007" vira "7"
    return value.replace(/^0+(?=\d)/, "");
  };

  const handleMesesOuValorChange = (field, value) => {
    // Remove tudo que não seja dígito ou ponto decimal
    let sanitized = value.replace(/[^0-9.]/g, "");

    // Remove zeros à esquerda, mas preserva "0" sozinho e decimais (ex.: "0.5")
    sanitized = sanitized.replace(/^0+(?=\d)/, "");

    // Se ficar vazio, define como vazio (ou '0' se quiser forçar)
    if (sanitized === "") {
      sanitized = "";
    }

    // Salva o valor sanitizado
    onChange(field, sanitized);
  };

  useEffect(() => {
    onChange("totalArrematacao", totalArrematacao);
    onChange("totalCustosVenda", totalCustosVenda);
    onChange("totalTransferenciaDoc", totalTransferenciaDoc);
    onChange(
      "totalImissaoPosse",
      toNumberOrZero(formData.outrosCustosImissao) +
      toNumberOrZero(formData.reforma) +
      toNumberOrZero(formData.caminhaoMudanca) +
      toNumberOrZero(formData.chaveiro)
    );
  }, [
    totalArrematacao,
    totalCustosVenda,
    totalTransferenciaDoc,
    formData.outrosCustosImissao,
    formData.reforma,
    formData.caminhaoMudanca,
    formData.chaveiro,
    formData.valorMercado,
  ]);

  return (
    <>
      {!opened && (
        <div
          onClick={() => {
            setOpened(true);
          }}
          className="mb-10 relative px-4 py-5 text-white flex justify-between items-center cursor-pointer rounded-xl transition-all duration-300 hover:bg-purple-900/30  bg-purple-900/20"
        >
          <p className="text-xl tracking-wide font-semibold">
            Custos Pós Leilão
          </p>
          <IoIosArrowForward

            style={{ color: "white" }}
            size={24}
          />

        </div>
      )}

      {opened && (
        <>
          <div
            onClick={() => setOpened(false)}
            className="mb-10 relative px-4 py-5 text-white flex justify-between items-center cursor-pointer rounded-xl transition-all duration-300 hover:bg-purple-900/50  bg-purple-900/40"
          >
            <p className="text-xl tracking-wide font-semibold">
              Custos Pós Leilão
            </p>
            <IoIosArrowDown
              style={{ color: "white" }}
              size={24}
            />

          </div>
          <SectionContainer total={totalCustosVenda} title="Custos Pós Leilão">
            <h2 className="col-span-2">Registro/Despesas Cartorárias</h2>
            {/* ITBI % */}
            <div className="mb-4">
              <label
                className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                style={{ color: neonBlue }}
              >
                ITBI (%)
              </label>
              <NumericFormat
                value={formData.itbiPerc}
                onValueChange={(values) => onChange("itbiPerc", values.value)}
                suffix="%"
                thousandSeparator="."
                decimalSeparator=","
                placeholder="ITBI (%)"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                style={{
                  backgroundColor: darkBackground,
                  borderColor: neonBlue,
                  color: "white",
                }}
                className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                onMouseEnter={(e) =>
                  (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                }
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>

            {/* ITBI Valor calculado */}
            <div className="mb-4">
              <label
                className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                style={{ color: neonBlue }}
              >
                ITBI (R$) (calculado)
              </label>
              <input
                type="text"
                value={formatarEmReais(itbiValorCalculado)}
                readOnly
                className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                style={{
                  borderColor: neonBlue,
                  color: "white",
                  backgroundColor: darkBackground,
                }}
                onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                onMouseEnter={(e) =>
                  (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                }
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>

            <InputField
              label="Registro da Arrematação (R$)"
              field="registroArrematacao"
              value={formData.registroArrematacao}
              onChange={onChange}
              unit="R$"
              type="number"
            />
            <InputField
              label="Custas Judiciais (R$)"
              field="custasJudiciais"
              value={formData.custasJudiciais}
              onChange={onChange}
              unit="R$"
              type="number"
            />

            {/* Outros Custos */}
            <div className="mb-4">
              <label
                className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                style={{ color: neonBlue }}
              >
                Outros Custos (R$)
              </label>
              {/* <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.outrosCustosDoc ?? ""}
                                onChange={(e) => onChange("outrosCustosDoc", e.target.value)}
                                className="w-full h-[45px]  rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1] "
                                style={{
                                    borderColor: neonBlue,
                                    color: "white",
                                    backgroundColor: darkBackground,
                                }}
                                onFocus={e => (e.target.style.borderColor = neonBlue)}
                                onBlur={e => (e.target.style.borderColor = neonBlue)}
                                onMouseEnter={e => (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)}
                                onMouseLeave={e => (e.target.style.boxShadow = "none")}
                            /> */}

              <NumericFormat
                value={formData.outrosCustosDoc}
                onValueChange={(values) =>
                  onChange("outrosCustosDoc", values.value)
                }
                // suffix="%"
                prefix="R$ "
                thousandSeparator="."
                decimalSeparator=","
                placeholder=" Outros Custos (R$)"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                style={{
                  backgroundColor: darkBackground,
                  borderColor: neonBlue,
                  color: "white",
                }}
                className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                onMouseEnter={(e) =>
                  (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                }
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>

            {/* Mostrar descrição só se houver valor maior que zero */}
            {toNumberOrZero(formData.outrosCustosDoc) > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-semibold mb-1 select-none text-[#42ADF1]">
                  Descrição do Outro Custo
                </label>
                <input
                  type="text"
                  value={formData.outrosCustosDocDescricao ?? ""}
                  onChange={(e) =>
                    onChange("outrosCustosDocDescricao", e.target.value)
                  }
                  className="rounded-lg p-2 w-full text-left bg-gray-800 text-[#42ADF1] border border-[#42ADF1] opacity-80 focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                  placeholder="Descreva o custo aqui"
                />
              </div>
            )}

            {/* Valor total embaixo, alinhado à direita */}
            <div className="mt-4 text-left font-bold text-[#42ADF1] text-lg col-span-2">
              Total: {formatarEmReais(totalTransferenciaDoc)}
            </div>

            {/*  custos ate a venda*/}

            <div className="col-span-2  !bg-cyan-400 !h-[2px]" />

            <h2 className="col-span-2">Imissão na Posse</h2>

            {/* imissão na posse */}
            <InputField
              label="Chaveiro (R$)"
              field="chaveiro"
              value={formData.chaveiro}
              onChange={onChange}
              unit="R$"
              type="number"
            />
            <InputField
              label="Caminhão de Mudança (R$)"
              field="caminhaoMudanca"
              value={formData.caminhaoMudanca}
              onChange={onChange}
              unit="R$"
              type="number"
            />
            <InputField
              label="Reforma (R$)"
              field="reforma"
              value={formData.reforma}
              onChange={onChange}
              unit="R$"
              type="number"
            />

            <div className="mb-4">
              <label
                className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                style={{ color: neonBlue }}
              >
                Outros Custos (R$)
              </label>

              <NumericFormat
                value={formData.outrosCustosImissao}
                onValueChange={(values) =>
                  onChange("outrosCustosImissao", values.value)
                }
                // suffix="%"
                prefix="R$ "
                thousandSeparator="."
                decimalSeparator=","
                placeholder=" Outros Custos (R$)"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                style={{
                  backgroundColor: darkBackground,
                  borderColor: neonBlue,
                  color: "white",
                }}
                className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                onMouseEnter={(e) =>
                  (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                }
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              />

              {/* <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.outrosCustosImissao ?? ""}
                                onChange={(e) => onChange("outrosCustosImissao", e.target.value)}
                                className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                                style={{
                                    borderColor: neonBlue,
                                    color: "white",
                                    backgroundColor: darkBackground,
                                }}
                                onFocus={e => (e.target.style.borderColor = neonBlue)}
                                onBlur={e => (e.target.style.borderColor = neonBlue)}
                                onMouseEnter={e => (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)}
                                onMouseLeave={e => (e.target.style.boxShadow = "none")}

                            /> */}
            </div>

            {/* Mostrar descrição só se houver valor maior que zero */}
            {/* {toNumberOrZero(formData.outrosCustosImissao) > 0 && (
                            <div className="mb-6">
                                <label className="block text-xs font-semibold mb-1 select-none text-[#42ADF1]">
                                    Descrição do Outro Custo
                                </label>
                                <input
                                    type="text"
                                    value={formData.outrosCustosImissaoDescricao ?? ""}
                                    onChange={(e) => onChange("outrosCustosImissaoDescricao", e.target.value)}
                                    className="rounded-lg p-2 w-full text-left bg-gray-800 text-[#42ADF1] border border-[#42ADF1] opacity-80 focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                                    placeholder="Descreva o custo aqui"
                                />
                            </div>
                        )} */}

            {/* Cálculo do total */}
            <div className="mt-4 text-left font-bold text-[#42ADF1] text-lg col-span-2">
              Total:{" "}
              {formatarEmReais(
                toNumberOrZero(formData.chaveiro) +
                toNumberOrZero(formData.caminhaoMudanca) +
                toNumberOrZero(formData.reforma) +
                toNumberOrZero(formData.outrosCustosImissao)
              )}
            </div>

            <div className="col-span-2  !bg-cyan-400 !h-[2px]" />
            <h2 className="col-span-2">Despesas Recorrentes</h2>

            <table className="font-mono text-sm border-collapse col-span-2 max-md:!w-[1px] !overflow-x-hidden mb-2">
              <thead>
                <tr>
                  <th className="border-b border-cyan-500 p-2 text-left text-blue-500 ">
                    Descrição
                  </th>
                  <th className="border-b border-cyan-500 p-2 text-left text-blue-500">
                    Meses
                  </th>
                  <th className="border-b border-cyan-500 p-2 text-left text-blue-500">
                    Valor Mensal (R$)
                  </th>
                  <th className="border-b border-cyan-500 p-2 text-left text-blue-500">
                    Total (R$)
                  </th>
                </tr>
              </thead>
              <tbody>
                {custosComTotal.map(
                  ({
                    label,
                    meses,
                    valorMensal,
                    total,
                    fieldMeses,
                    fieldValor,
                  }) => (
                    <tr key={label}>
                      <td className="border-b border-cyan-500 p-2 bg-black">
                        {label}
                      </td>
                      <td className="border-b border-cyan-500 p-2 text-left bg-black">
                        <input
                          type="text" // Mude de "number" para "text" para controle total
                          value={meses}
                          onChange={(e) =>
                            handleMesesOuValorChange(fieldMeses, e.target.value)
                          }
                          className="w-20 bg-transparent border border-[#42ADF1] rounded px-1 text-white text-left focus:outline-none focus:ring-1 focus:ring-cyan-400 !bg-black"
                          pattern="[0-9]*\.?[0-9]*" // Opcional: permite apenas números e ponto decimal
                        />
                      </td>
                      <td className="border-b border-cyan-500 p-2 text-left !bg-black">
                        <div className="relative w-32">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white">
                            R$
                          </span>
                          {/* <input
                                                    type="number"
                                                    // min="0"
                                                    // step="0.01"
                                                    value={valorMensal}
                                                    onChange={(e) => handleMesesOuValorChange(fieldValor, e.target.value)}
                                                    className="w-full bg-transparent border border-[#42ADF1] rounded px-6 pl-6 text-white text-left focus:outline-none focus:ring-1 focus:ring-cyan-400 !bg-black"
                                                /> */}
                          <input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.,]?[0-9]*"
                            value={valorMensal}
                            onChange={(e) =>
                              handleMesesOuValorChange(
                                fieldValor,
                                e.target.value
                              )
                            }
                            onBlur={(e) => {
                              // opcional: no blur converte pra número real (remove trailing ".")
                              const v = e.target.value;
                              if (v === "" || v === ".") {
                                onChange(fieldValor, "");
                              } else {
                                // converte pra number para guardar permanentemente (se quiser)
                                const numeric = Number(v.replace(",", "."));
                                onChange(
                                  fieldValor,
                                  isNaN(numeric) ? "" : String(numeric)
                                );
                              }
                            }}
                            className="w-full bg-transparent border border-[#42ADF1] rounded px-6 pl-6 text-white text-left focus:outline-none focus:ring-1 focus:ring-cyan-400 !bg-black"
                          />
                        </div>
                      </td>
                      <td className="border-b border-[#D0FF33]-700 p-2 text-left font-bold bg-black">
                        {total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </SectionContainer>
        </>
      )}
    </>
  );
};

const LucroLiquidoSection = ({ formData, onChange }) => {
  const arrematacaoTotal = toNumberOrZero(formData.totalArrematacao);
  const custosVendaTotal = toNumberOrZero(formData.totalCustosVenda);
  const transferenciaTotal = toNumberOrZero(formData.totalTransferenciaDoc);
  const imissaoTotal = toNumberOrZero(formData.totalImissaoPosse);

  // console.log(arrematacaoTotal, custosVendaTotal, transferenciaTotal, imissaoTotal, 'CHEGUEIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')

  // 1. Investimento Inicial
  // console.log(arrematacaoTotal, custosVendaTotal, transferenciaTotal, imissaoTotal)

  console.log(`
    arrematação total: ${arrematacaoTotal}
    custos venda: ${custosVendaTotal}
    total docs: ${transferenciaTotal}
    imissao posse: ${imissaoTotal}`)

  const investimentoInicial =
    toNumberOrZero(arrematacaoTotal) +
    toNumberOrZero(custosVendaTotal) +
    toNumberOrZero(transferenciaTotal) +
    toNumberOrZero(imissaoTotal);



  // 2. Desconto para venda rápida
  const descontoVendaRapidaPerc = toNumberOrZero(
    formData.descontoVendaRapidaPerc
  );
  // 3. Comissão Corretor
  const comissaoCorretorPerc = toNumberOrZero(formData.comissaoCorretorPerc);
  const valorMercado = toNumberOrZero(formData.valorMercado);
  const valorVendaImovel = toNumberOrZero(valorMercado) * (1 - toNumberOrZero(formData.lucroMinimo) / 100);
  const comissaoCorretorValor = (comissaoCorretorPerc / 100) * valorVendaImovel;

  const { setMostrarSugestao } = useContext(Context);

  // 3. IR - Lucro Imobiliário
  const irLucroImobiliarioPerc = toNumberOrZero(
    formData.irLucroImobiliarioPerc
  );
  // const saldoRemanescente = (toNumberOrZero(+formData.parcelas * +formData.valorParcelas) - (formData.parcelasCustosMeses * formData.valorParcelas));
  // const irLucroImobiliarioValor =
  //   (toNumberOrZero(irLucroImobiliarioPerc) / 100) *
  //   toNumberOrZero(valorVendaImovel);

  const irLucroImobiliarioValor =
    (
      toNumberOrZero(valorVendaImovel) -
      (toNumberOrZero(investimentoInicial) +
        toNumberOrZero(comissaoCorretorValor))
    ) *
    (toNumberOrZero(irLucroImobiliarioPerc) / 100);

  // 4. Investimento Total
  const investimentoTotal =
    toNumberOrZero(investimentoInicial) +
    toNumberOrZero(comissaoCorretorValor) +
    toNumberOrZero(irLucroImobiliarioValor);

  // const { mostrarLanceNaoVantajoso } = useContext(Context)
  // console.log('abaixoooooooooo')
  // console.log(mostrarLanceNaoVantajoso, 'lance vantajoso mostrar')

  // 6. Lucro R$
  const lucroR$ = valorVendaImovel - investimentoTotal;

  const lucroPerc =
    toNumberOrZero(investimentoInicial) > 0 // paulinho pediu para investimento inicial
      ? (toNumberOrZero(lucroR$) / toNumberOrZero(investimentoInicial)) * 100
      : 0;

  useEffect(() => {
    onChange("valorVendaImovel", String(valorVendaImovel));
    onChange("lucro", String(lucroPerc));
    onChange("lucroEmReal", String(lucroR$));
    onChange("investimentoTotal", String(investimentoTotal));
    // onChange('saldoRemanescente', saldoRemanescente)
  }, [valorVendaImovel, lucroPerc, investimentoTotal, lucroR$]);

  // Totais das seções anteriores
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const lucroDoInvestimento =
      toNumberOrZero(investimentoInicial) *
      (toNumberOrZero(formData.lucroMinimo) / 100);

    if (toNumberOrZero(lucroR$) < toNumberOrZero(lucroDoInvestimento)) {
      onChange("lanceNaoVantajoso", true);
    } else {
      onChange("lanceNaoVantajoso", false);
    }
    // }
  }, [formData.lucroMinimo, investimentoInicial, lucroR$]);

  // chama manual depois se der

  // 7. Lucro %

  return (
    <>
      {!opened && (
        <div
          onClick={() => {
            setOpened(true);
          }}
          className="mb-10 relative px-4 py-5 text-white flex justify-between items-center cursor-pointer rounded-xl transition-all duration-300 hover:bg-purple-900/30  bg-purple-900/20"
        >
          <p className="text-xl tracking-wide font-semibold">Venda</p>
          <IoIosArrowForward

            style={{ color: "white" }}
            size={24}
          />

        </div>
      )}

      {opened && (
        <>
          <div
            onClick={() => setOpened(false)}
            className="mb-10 relative px-4 py-5 text-white flex justify-between items-center cursor-pointer rounded-xl transition-all duration-300 hover:bg-purple-900/50  bg-purple-900/40"
          >
            <p className="text-xl tracking-wide font-semibold">Venda</p>
            <IoIosArrowDown
              style={{ color: "white" }}
              size={24}
            />

          </div>
          <section
            className="
                        font-montserrat
                        border border-[#42ADF1] rounded-3xl p-6 mb-8 shadow-lg
                        hover:shadow-[0_8px_20px_rgba(0,255,255,0.5)] transition-shadow duration-400
                        overflow-x-auto
                        scrollbar-custom      
                        scrollbar-no-buttons
                        mt-5
                        "
          >
            <h2
              className="text-2xl font-extrabold mb-6 text-white
                        pb-2 select-none"
            >
              Venda
            </h2>

            <div className="grid grid-cols-2 gap-6 text-[#42ADF1] font-mono text-base">
              <InputField
                label="Desconto para Venda Rápida (%)"
                field="lucroMinimo"
                value={formData.lucroMinimo}
                onChange={onChange}
                unit="%"
                type="number"
              />

              <InputField
                label="Lucro Almejado (%)"
                field="lucroAlmejado"
                value={formData.lucroAlmejado}
                onChange={onChange}
                unit="%"
                type="number"
              />

              {/* Investimento Inicial */}

              {/* Desconto Venda Rápida */}

              {/* <div>
                                <label htmlFor="descontoVendaRapidaPerc" className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                                    style={{ color: neonBlue }}>
                                    Desconto para Venda Rápida (%)
                                </label>

                                <NumericFormat
                                    value={formData.descontoVendaRapidaPerc}
                                    onValueChange={(values) => onChange("descontoVendaRapidaPerc", values.value)}
                                    suffix="%"
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    placeholder="Desconto para Venda Rápida (%)"
                                    inputMode="decimal"
                                    autoComplete="off"
                                    spellCheck={false}
                                    style={{
                                        backgroundColor: darkBackground,
                                        borderColor: neonBlue,
                                        color: "white",
                                    }}
                                    className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                                    onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                                    onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                                    onMouseEnter={(e) =>
                                        (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                                    }
                                    onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                                />

                                {/* <input
                                    id="descontoVendaRapidaPerc"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={formData.descontoVendaRapidaPerc || ''}
                                    onChange={(e) => onChange('descontoVendaRapidaPerc', e.target.value)}
                                    className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                                    style={{
                                        borderColor: neonBlue,
                                        color: "white",
                                        backgroundColor: darkBackground,
                                    }}
                                    onFocus={e => (e.target.style.borderColor = neonBlue)}
                                    onBlur={e => (e.target.style.borderColor = neonBlue)}
                                    onMouseEnter={e => (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)}
                                    onMouseLeave={e => (e.target.style.boxShadow = "none")}
                                />
                            </div> */}

              {/* Valor de Venda */}
              <div>
                <label
                  className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                  style={{ color: neonBlue }}
                >
                  Valor de Venda do Imóvel
                </label>
                <div
                  className="
                        w-full rounded-lg p-2 sm:p-3 pr-10 font-mono text-sm sm:text-base
                        placeholder-opacity-50 focus:outline-none focus:ring-2 transition-shadow duration-300 ease-in-out
                        shadow-sm hover:shadow-lg border !border-opacity-30 !border-white
                    "
                  onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                  onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                  onMouseEnter={(e) =>
                    (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                  }
                  onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                >
                  {formatarEmReais(valorVendaImovel)}
                </div>
              </div>

              <div>
                <label
                  htmlFor="irLucroImobiliarioPerc"
                  className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                  style={{ color: neonBlue }}
                >
                  IR - Lucro Imobiliário (%)
                </label>

                <NumericFormat
                  value={formData.irLucroImobiliarioPerc}
                  onValueChange={(values) =>
                    onChange("irLucroImobiliarioPerc", values.value)
                  }
                  suffix="%"
                  thousandSeparator="."
                  decimalSeparator=","
                  placeholder="IR - Lucro Imobiliário (%)"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    backgroundColor: darkBackground,
                    borderColor: neonBlue,
                    color: "white",
                  }}
                  className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                  onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                  onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                  onMouseEnter={(e) =>
                    (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                  }
                  onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                />

                {/* <input
                                    id="irLucroImobiliarioPerc"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={formData.irLucroImobiliarioPerc || ''}
                                    onChange={(e) => onChange('irLucroImobiliarioPerc', e.target.value)}
                                    className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                                    style={{
                                        borderColor: neonBlue,
                                        color: "white",
                                        backgroundColor: darkBackground,
                                    }}
                                    onFocus={e => (e.target.style.borderColor = neonBlue)}
                                    onBlur={e => (e.target.style.borderColor = neonBlue)}
                                    onMouseEnter={e => (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)}
                                    onMouseLeave={e => (e.target.style.boxShadow = "none")}
                                /> */}
                <p className="mt-1 text-sm font-semibold text-[#42ADF1]">
                  {formatarEmReais(irLucroImobiliarioValor)}
                </p>
              </div>

              {/* Comissão Corretor */}
              <div>
                <label
                  htmlFor="comissaoCorretorPerc"
                  className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                  style={{ color: neonBlue }}
                >
                  Comissão Corretor (%)
                </label>

                <NumericFormat
                  value={formData.comissaoCorretorPerc}
                  onValueChange={(values) =>
                    onChange("comissaoCorretorPerc", values.value)
                  }
                  suffix="%"
                  thousandSeparator="."
                  decimalSeparator=","
                  placeholder=" Comissão Corretor (%)"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    backgroundColor: darkBackground,
                    borderColor: neonBlue,
                    color: "white",
                  }}
                  className="w-full rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                  onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                  onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                  onMouseEnter={(e) =>
                    (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                  }
                  onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                />

                <p className="mt-1 text-sm font-semibold text-[#42ADF1]">
                  {formatarEmReais(comissaoCorretorValor)}
                </p>
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                  style={{ color: neonBlue }}
                >
                  Custo Inicial
                </label>
                <div
                  className="
                        w-full rounded-lg p-2 sm:p-3 pr-10 font-mono text-sm sm:text-base
                        placeholder-opacity-50 focus:outline-none focus:ring-2 transition-shadow duration-300 ease-in-out
                        shadow-sm hover:shadow-lg border !border-opacity-30 !border-white
                    "
                  onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                  onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                  onMouseEnter={(e) =>
                    (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                  }
                  onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                >
                  {formatarEmReais(investimentoInicial)}
                </div>
              </div>

              {/* IR Lucro Imobiliário */}

              {/* Investimento Total */}
              <div>
                <label
                  className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                  style={{ color: neonBlue }}
                >
                  Custo Total
                </label>
                <div
                  className="
                        w-full rounded-lg p-2 sm:p-3 pr-10 font-mono text-sm sm:text-base
                        placeholder-opacity-50 focus:outline-none focus:ring-2 transition-shadow duration-300 ease-in-out
                        shadow-sm hover:shadow-lg border !border-opacity-30 !border-white
                    "
                  onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                  onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                  onMouseEnter={(e) =>
                    (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                  }
                  onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                >
                  {formatarEmReais(investimentoTotal)}
                </div>
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                  style={{ color: neonBlue }}
                >
                  Lucro (R$)
                </label>
                <div
                  className="
                        w-full rounded-lg p-2 sm:p-3 pr-10 font-mono text-sm sm:text-base
                        placeholder-opacity-50 focus:outline-none focus:ring-2 transition-shadow duration-300 ease-in-out
                        shadow-sm hover:shadow-lg border !border-opacity-30 !border-white
                    "
                  onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                  onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                  onMouseEnter={(e) =>
                    (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                  }
                  onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                >
                  {formatarEmReais(lucroR$)}
                </div>
              </div>

              {/* Lucro % */}
              <div>
                <label
                  className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                  style={{ color: neonBlue }}
                >
                  Lucro (%)
                </label>
                <div
                  className="
                        w-full rounded-lg p-2 sm:p-3 pr-10 font-mono text-sm sm:text-base
                        placeholder-opacity-50 focus:outline-none focus:ring-2 transition-shadow duration-300 ease-in-out
                        shadow-sm hover:shadow-lg border !border-opacity-30 !border-white
                    "
                  onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                  onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                  onMouseEnter={(e) =>
                    (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                  }
                  onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                >
                  {formatarPercentual(lucroPerc)}
                </div>
              </div>
            </div>


          </section>
        </>
      )}
    </>
  );
};

// QUADRO RESUMO Section
const QuadroResumoSection = ({ formData, onChange }) => {
  const [opened, setOpened] = useState(false);
  const investimento = toNumberOrZero(formData.investimento);
  const vendaImovel = toNumberOrZero(formData.vendaImovel);

  const lucroLiquidoValor = vendaImovel - investimento;
  const lucroLiquidoPerc =
    toNumberOrZero(investimento) === 0 ? 0 : (toNumberOrZero(lucroLiquidoValor) / toNumberOrZero(investimento)) * 100;

  const formatPerc = (val) => formatarPercentual(val);

  // let sugestaoInvestimento = "INVESTIR";
  // if (toNumberOrZero(formData.lucro) >= toNumberOrZero(formData.lucroMinimo))
  //   sugestaoInvestimento = "INVESTIR";
  // else sugestaoInvestimento = "NÃO INVESTIR";

  let sugestaoInvestimento = "INVESTIR";
  console.log('lucro almejado: ', toNumberOrZero(formData.lucroAlmejado), 'lucro real:  ', toNumberOrZero(formatPerc(formData.lucro)))
  if (toNumberOrZero(formatPerc(formData.lucro)) >= toNumberOrZero(formData.lucroAlmejado)) {
    sugestaoInvestimento = "INVESTIR";
  }
  else sugestaoInvestimento = "NÃO INVESTIR";

  const formatBRL = (val) =>
    (parseFloat(val) || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });



  return (
    <>
      {!opened && (
        <div
          onClick={() => {
            setOpened(true);
          }}
          className="mb-10 relative px-4 py-5 text-white flex justify-between items-center cursor-pointer rounded-xl transition-all duration-300 hover:bg-purple-900/30  bg-purple-900/20"
        >
          <p className="text-xl tracking-wide font-semibold">Resumo</p>
          <IoIosArrowForward

            style={{ color: "white" }}
            size={24}
          />

        </div>
      )}

      {opened && (
        <>
          <div
            onClick={() => setOpened(false)}
            className="mb-10 relative px-4 py-5 text-white flex justify-between items-center cursor-pointer rounded-xl transition-all duration-300 hover:bg-purple-900/50  bg-purple-900/40"
          >
            <p className="text-xl tracking-wide font-semibold">Resumo</p>
            <IoIosArrowDown
              style={{ color: "white" }}
              size={24}
            />

          </div>
          <SectionContainer title="Quadro Resumo">
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4 text-[#42ADF1] font-semibold text-lg select-none">
                <div>Investimento</div>
                <div className="text-left">
                  {formatBRL(formData.investimentoTotal)}
                </div>

                <div>Venda do Imóvel</div>
                <div className="text-left">
                  {formatBRL(formData.valorVendaImovel)}
                </div>

                {/* <div>Saldo Parcelamento</div>
                        <div className="text-left">{formatBRL(formData.saldoRemanescente)}</div> */}

                <div>Lucro Líquido (%)</div>
                <div className="text-left">{formatPerc(formData.lucro)}</div>

                <div>Lucro Líquido (R$)</div>
                <div className="text-left">
                  {formatBRL(formData.lucroEmReal)}
                </div>

                <div>Desconto Para Venda Rápida (%)</div>
                <div className="text-left">
                  {formatPerc(formData.lucroMinimo)}
                </div>

                <div>Lucro Almejado (%)</div>
                <div className="text-left">
                  {formatPerc(formData.lucroAlmejado)}
                </div>

                <div
                  className={`col-span-2 text-center font-extrabold text-2xl mt-6 border border-solid border-[#red] border-100 p-3 ${sugestaoInvestimento === "NÃO INVESTIR"
                    ? "text-red-500"
                    : "text-green-400"
                    }`}
                >
                  {sugestaoInvestimento}
                </div>
              </div>
            </div>

            {/* <div className="col-span-2 mt-8">
                    <p className="text-green-400 text-sm">
                        <strong>Legenda para preenchimento:</strong>
                        <br />
                        Obrigatório - Alterar conforme a Proposta
                        <br />
                        Opcional - Alterar conforme negociação
                    </p>
                </div> */}
          </SectionContainer>
        </>
      )}
    </>
  );
};

// Função utilitária para parsear número com vírgula/ponto
// const toNumberOrZero = (val) => {
//   if (!val) return 0;
//   const cleaned = val
//     .toString()
//     .replace(/[^0-9.,-]/g, "")
//     .replace(",", ".");
//   const parsed = parseFloat(cleaned);
//   return isNaN(parsed) ? 0 : parsed;
// };

const LanceTab = ({ formData, onChange, prevLance, openModal }) => {
  const [lance, setLance] = useState(prevLance?.lance || {});
  const { salvarLance } = useContext(Context);

  const { mostrarSugestao, setMostrarSugestao, setMostrarLanceNaoVantajoso } =
    useContext(Context);

  const [mostrarNovamente, setMostrarNovamente] = useState(false);

  const [showResumoModal, setShowResumoModal] = useState(false);

  const { setActiveTab, dontShowAgain } = useContext(Context);

  // Aqui você pode adicionar outros cálculos complexos para totais e lucros conforme necessidade

  const sections = [
    { id: "imovel-section", title: "Imóvel" },
    { id: "calculadora-section", title: "Calculadora" },
    { id: "lucro-liquido-section", title: "Lucro Líquido" },
    { id: "quadro-resumo-section", title: "Quadro Resumo" },
  ];
  // const [mostrarSugestao, setMostrarSugestao] = useState(false);

  return (
    <div className="max-w-6xl 
     text-cyan-300 -mono relative">
      {/* <SideNavigation sections={sections} /> */}
      {/* <h1 className="text-3xl font-extrabold mb-8 select-none">IMÓVEL</h1> */}
      <div id="imovel-section">
        <ImovelSection formData={formData} onChange={onChange} />
      </div>
      {/* <div className="text-white font-extrabold text-xl tracking-wide text-left mb-10 select-none drop-shadow-md">
                Preço por m²: R$ {precoM2.toFixed(2)}
            </div>
            <div className="text-white font-extrabold text-xl tracking-wide text-left mb-14 select-none drop-shadow-md">
                Valor 2ª Praça: R$ {valor2PracaCalc.toFixed(2)}
            </div> */}

      <div id="calculadora-section">
        {/* <h1 className="text-3xl font-extrabold mb-8 select-none">CALCULADORA</h1> */}
        <CalculadoraSection formData={formData} onChange={onChange} />
      </div>

      <div id="lucro-liquido-section">
        {/* <h1 className="text-3xl font-extrabold mb-8 select-none">Lucro Líquido</h1> */}
        <LucroLiquidoSection formData={formData} onChange={onChange} />
      </div>

      <div id="quadro-resumo-section">
        {/* <h1 className="text-3xl font-extrabold mb-8 select-none pt-10">QUADRO RESUMO</h1> */}
        <QuadroResumoSection formData={formData} onChange={onChange} />
      </div>

      {/* Card flutuante do Quadro Resumo */}
      {/* <button
                className="fixed bottom-8 right-8 z-50 bg-[#0a0a15] border-2 border-[#42ADF1] rounded-2xl shadow-xl px-6 py-4 text-[#42ADF1] font-extrabold text-lg hover:bg-[#101a2b] transition-all duration-200"
                onClick={() => setShowResumoModal(true)}
                style={{ boxShadow: "0 4px 24px 0 #00FFFF44" }}
            >
                Quadro Resumo
            </button>
 */}

      {mostrarSugestao && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div
            className="border-2 border-cyan-500 rounded-3xl p-6 shadow-lg hover:shadow-[0_8px_20px_rgba(0,255,255,0.5)] transition-shadow duration-400 max-w-md"
            style={{ backgroundColor: darkBackground }}
          >
            <h2
              className="text-xl font-bold mb-4 select-none drop-shadow-md"
              style={{ color: neonBlue }}
            >
              Lance não é vantajoso
            </h2>
            <p className="mb-2 font-montserrat" style={{ color: "white" }}>
              Mas na{" "}
              <span className="font-bold" style={{ color: neonBlue }}>
                Proposta de Compra
              </span>{" "}
              pode ser um bom negócio. Deseja simular lá?
            </p>

            <div className="flex justify-center w-full mb-4">
              <label className="flex gap-5 items-center" htmlFor="">
                <input
                  type="checkbox"
                  value={mostrarNovamente}
                  onClick={dontShowAgain}
                  id=""
                  className="accent-cyan-500"
                />
                <span
                  className="font-montserrat select-none"
                  style={{ color: "white" }}
                >
                  Não mostrar denovo
                </span>
              </label>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setMostrarSugestao(false)}
                className="px-4 py-2 rounded-lg font-montserrat font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: darkBackground,
                  color: neonBlue,
                  border: `1px solid ${neonBlue}`,
                }}
                onMouseEnter={(e) =>
                  (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                }
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setMostrarSugestao(false);
                  setActiveTab("proposta");
                  // aqui você pode redirecionar para a aba Proposta
                  // navigate('/proposta-de-compra');
                }}
                className="px-4 py-2 rounded-lg font-montserrat font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: neonBlue,
                  color: darkBackground,
                  border: `1px solid ${neonBlue}`,
                }}
                onMouseEnter={(e) =>
                  (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
                }
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              >
                Simular Proposta
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal do Quadro Resumo */}
      {showResumoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#101a2b] rounded-2xl p-8 max-w-lg w-full border-2 border-[#42ADF1] shadow-2xl relative">
            <button
              className="absolute top-3 right-4 text-2xl text-[#42ADF1] font-bold hover:text-cyan-300"
              onClick={() => setShowResumoModal(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <QuadroResumoSection formData={formData} onChange={onChange} />
          </div>
        </div>
      )}

      {/* <button onClick={() => }>Salvar Alterações</button> */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => {
            salvarLance();
            openModal(true);
          }}
          className="bg-purple-900/40 px-4 py-2 rounded-md text-lg text-center tracking-wider font-light mt-5 uppercase text-white hover:bg-purple-800"
        >
          SALVAR ALTERAÇÕES
        </button>
      </div>
    </div>
  );
};

export default LanceTab;