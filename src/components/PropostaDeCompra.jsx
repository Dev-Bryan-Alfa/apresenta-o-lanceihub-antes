import React, { useContext, useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import SideNavigation from "./SideNavigation";
import Context from "../context/Context";
import { FaWindowClose } from "react-icons/fa";
import api from "../axios/axiosBase";
import { formatarEmReais, formatarPercentual } from "./PropostaParcela";
// import { IoIosArrowForward } from "react-icons/md";

import { IoIosArrowForward } from "react-icons/io";

import { IoIosArrowDown } from "react-icons/io";



const neonBlue = "#00FFFF";
const darkBackground = "#0a0a15";

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

const InputField = React.memo(
  ({ label, field, value, onChange, unit = "", type = "text" }) => {
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
              onValueChange={(values) => onChange(field, values.value)}
              prefix={unit === "R$" ? "R$ " : undefined}
              suffix={unit === "%" ? "%" : undefined}
              thousandSeparator="."
              decimalSeparator=","
              placeholder={label}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
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
              type={type === "date" ? "datetime-local" : "text"}
              value={value ?? ""}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={label}
              autoComplete="off"
              spellCheck={false}
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

export const InputFieldChangeState = React.memo(
  ({ label, field, value, onChange, unit = "", type = "text" }) => {
    return (
      <div className="mb-4 w-full">
        <label
          htmlFor={field}
          className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
          style={{ color: neonBlue }}
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={field}
            type={type}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
            inputMode={type === "number" ? "decimal" : undefined}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
            onFocus={(e) => (e.target.style.borderColor = neonBlue)}
            onBlur={(e) => (e.target.style.borderColor = neonBlue)}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)
            }
            onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
          />
          {unit && (
            <span
              className="absolute right-3 top-2 sm:top-2.5 font-semibold select-none font-montserrat text-sm sm:text-base"
              style={{ color: neonBlue }}
            >
              {unit}
            </span>
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
    <select
      id={field}
      value={value ?? ""}
      onChange={(e) => onChange(field, e.target.value)}
      style={{
        borderColor: neonBlue,
        color: "white",
        backgroundColor: darkBackground,
      }}
      className="
        w-full rounded-lg p-2 sm:p-3 font-montserrat text-sm sm:text-base
        focus:outline-none focus:ring-2 opacity-80 transition-shadow duration-300 ease-in-out
        shadow-sm hover:shadow-lg
      "
      onFocus={(e) => (e.target.style.borderColor = neonBlue)}
      onBlur={(e) => (e.target.style.borderColor = neonBlue)}
      onMouseEnter={(e) => (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)}
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
  </div>
));

const SectionContainer = ({ title, children, total }) => (
  <section
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
        Total: {total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
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

  const comissaoValor =
    (toNumberOrZero(valorOferta) * (toNumberOrZero(comissaoPerc) / 100));
  const honorariosValor =
    (toNumberOrZero(valorOferta) * (toNumberOrZero(honorariosPerc) / 100));

  const totalArrematacao =
    toNumberOrZero(comissaoValor) +
    toNumberOrZero(honorariosValor) +
    toNumberOrZero(outrosCustos);

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!formData.desagio3Praca || !formData.valor1Praca) return;

    const valorCalculado =
      toNumberOrZero(formData.valor1Praca) *
      (1 - toNumberOrZero(formData.desagio3Praca) / 100);

    // Atualiza o formData diretamente
    onChange("valor3Praca", valorCalculado);
  }, [formData.desagio3Praca, formData.valor1Praca]);
  useEffect(() => {
    if (!formData.desagio || !formData.valor1Praca) return;

    const valorCalculado =
      toNumberOrZero(formData.valor1Praca) *
      (1 - toNumberOrZero(formData.desagio) / 100);

    // Atualiza o formData diretamente
    onChange("valor2Praca", String(valorCalculado));
  }, [formData.desagio, formData.valor1Praca]);

  return (
    <>
      {!opened && (
        <div
          onClick={() => {
            setOpened(true);
          }}
          className="mb-10 relative px-4 py-5 text-white flex justify-between items-center cursor-pointer rounded-xl transition-all duration-300 hover:bg-purple-900/30  bg-purple-900/20"
        >
          <p className="text-xl font-light tracking-wide">
            Custos do Leilão
          </p>
          <IoIosArrowForward
            style={{ color: "white" }}
            size={24}
          />
          {/*  */}
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
                    <h3>Infromação da 1ª Praça</h3>
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
                    <h3>Infromação da 1ª Praça</h3>
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
                        <InputField
                          label="Deságio (%)"
                          field="desagio"
                          value={formData.desagio}
                          onChange={onChange}
                          unit="%"
                          type="number"
                        />
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

            {/* Cálculo e exibição do preço por m² */}
            {/* {formData.metragem > 0 && formData.valorMercado > 0 && (
              <div className="mt-4 p-3 rounded bg-green-900/60 text-green-300 font-semibold font-mono text-base sm:text-lg text-center w-full">
                Preço por metro quadrado:{" "}
                <span className="text-green-400">
                  R${" "}
                  {(
                    parseFloat(formData.valorMercado) /
                    parseFloat(formData.metragem)
                  ).toFixed(2)}
                </span>
              </div>
            )} */}

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

            <div>
              <label
                htmlFor="entrada"
                className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                style={{ color: neonBlue }}
              >
                Entrada (%)
              </label>

              <NumericFormat
                value={formData.entrada}
                onValueChange={(values) => onChange("entrada", values.value)}
                suffix="%"
                thousandSeparator="."
                decimalSeparator=","
                placeholder=" Entrada (%)"
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
                id="entrada"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.entrada || ""}
                onChange={(e) => onChange("entrada", e.target.value)}
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
              /> */}
              <p className="mt-1 text-sm font-semibold text-[#42ADF1]">
                {formatarEmReais(formData?.valorEntrada)}
              </p>
            </div>

            <div>
              <label
                className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                style={{ color: neonBlue }}
              >
                Quantidade de Parcelas
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.parcelas || ""}
                onChange={(e) => onChange("parcelas", e.target.value)}
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
              <p className="mt-1 text-sm font-semibold text-[#42ADF1]">
                {formatarEmReais(formData?.valorParcelas)}
              </p>
            </div>

            {/* Comissão do Leiloeiro */}
            <div className="flex gap-5">
              <div className="flex-1">
                <InputField
                  label="Comissão do Leiloeiro (%)"
                  field="comissaoLeiloeiro"
                  value={formData.comissaoLeiloeiro}
                  onChange={onChange}
                  unit="%"
                  type="number"
                />
              </div>
              <div className="flex-1">
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
              </div>
            </div>
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
                  placeholder="Honorários Advocatícios/Assessoria (%)"
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
                  field="valorHonorarios"
                  value={
                    formData.honorarios
                      ? honorariosValor.toFixed(2)
                      : formData.valorHonorarios || ""
                  }
                  onChange={onChange}
                  unit="R$"
                  type="number"
                  readOnly={!!formData.honorarios}
                />
              </div>
            </div>

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
            {/* 
            <div>
              <label
                className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                style={{ color: neonBlue }}
              >
                Quantidade de Parcelas
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.parcelas || ""}
                onChange={(e) => onChange("parcelas", e.target.value)}
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
              <p className="mt-1 text-sm font-semibold text-[#42ADF1]">
                {formatarEmReais(formData?.valorParcelas)}
              </p>
            </div> */}
          </SectionContainer>
        </>
      )}
    </>
  );
};

const CalculadoraSection = ({ formData, onChange }) => {
  // const toNumberOrZero = (val) => {
  //   if (!val) return 0;
  //   const cleaned = val
  //     .toString()
  //     .replace(/[^0-9.,-]/g, "")
  //     .replace(",", ".");
  //   const parsed = parseFloat(cleaned);
  //   return isNaN(parsed) ? 0 : parsed;
  // };

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
  const comissaoValor = (valorOferta * comissaoPerc) / 100;
  const honorariosValor = (valorOferta * honorariosPerc) / 100;

  const totalArrematacao =
    toNumberOrZero(+formData?.valorEntrada) +
    toNumberOrZero(comissaoValor) +
    toNumberOrZero(honorariosValor) +
    toNumberOrZero(outrosCustos);

  useEffect(() => {
    const sr =
      toNumberOrZero(formData.valorParcelas) *
      toNumberOrZero(formData.parcelas);
    const saldoPago =
      toNumberOrZero(formData.parcelasCustosMeses) * toNumberOrZero(formData.valorParcelas);
    onChange("saldoRemanescente", +sr - +saldoPago || 0)
  }, [formData.parcelasCustosMeses, formData.valorParcelas, formData.parcelas])

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
      {
        label: "Parcelas (Custos até a venda)",
        meses: toNumberOrZero(formData.parcelasCustosMeses), // here8yy8uhn
        valorMensal: toNumberOrZero(formData.valorParcelas),
        fieldMeses: "parcelasCustosMeses",
        fieldValor: "valorParcelas",
      },
      {
        label: "Outros Custos",
        meses: toNumberOrZero(formData.outrosCustosVendaMeses),
        valorMensal: toNumberOrZero(formData.outrosCustosVendaValorMensal),
        fieldMeses: "outrosCustosVendaMeses",
        fieldValor: "outrosCustosVendaValorMensal",
      },
      {
        label: "Redutor de custos (locação)",
        meses: toNumberOrZero(formData.redutorCustosMeses),
        valorMensal: toNumberOrZero(formData.redutorCustosValorMensal),
        fieldMeses: "redutorCustosMeses",
        fieldValor: "redutorCustosValorMensal",
        isRedutor: true,
      },
    ];

    const dataToRe = custos.map(
      ({ meses, valorMensal, isRedutor, ...rest }) => ({
        ...rest,
        meses,
        valorMensal,
        total: isRedutor
          ? -(toNumberOrZero(meses) * toNumberOrZero(valorMensal))
          : toNumberOrZero(meses) * toNumberOrZero(valorMensal),
      })
    );

    return dataToRe;
  }, [
    formData.iptuMeses,
    formData.iptuValorMensal,
    formData.condominioMeses,
    formData.condominioValorMensal,
    formData.taxaAssociativaMeses,
    formData.taxaAssociativaValorMensal,
    formData.parcelasCustosMeses,
    formData.valorParcelas,
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

  // Handler para mudar meses ou valor mensal
  const handleMesesOuValorChange = (field, value) => {
    if (field === "parcelasCustosMeses") {
      console.log("oi né");

      const sr =
        toNumberOrZero(formData.valorParcelas) *
        toNumberOrZero(formData.parcelas);
      const saldoPago =
        toNumberOrZero(value) * toNumberOrZero(formData.valorParcelas);
      onChange("saldoRemanescente", +sr - +saldoPago || 0); // formData.valorParcelas * quantidadeParcelas
    }
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
    onChange(
      "totalArrematacao",
      toNumberOrZero(totalArrematacao)
    );
    onChange("totalCustosVenda", toNumberOrZero(totalCustosVenda));
    onChange("totalTransferenciaDoc", toNumberOrZero(totalTransferenciaDoc));
    onChange("totalTransferenciaDoc", toNumberOrZero(totalTransferenciaDoc));
    onChange(
      "totalImissaoPosse",
      toNumberOrZero(formData.outrosCustosImissao) +
      toNumberOrZero(formData.reforma) +
      toNumberOrZero(formData.caminhaoMudanca) +
      toNumberOrZero(formData.chaveiro)
    );
    onChange(
      "valorEntrada",
      toNumberOrZero(formData.valorOferta) *
      (toNumberOrZero(formData.entrada) / 100)
    );
    // console.log((+formData.valorOferta - +formData.valorEntrada) / +formData.parcelas)
    onChange(
      "valorParcelas",
      (toNumberOrZero(formData.valorOferta) -
        toNumberOrZero(formData.valorEntrada)) /
      toNumberOrZero(formData.parcelas)
    );

    if (
      formData.resultadoLance === "negativo" &&
      toNumberOrZero(totalArrematacao) <
      toNumberOrZero(formData.valorMercado) * 0.8
    ) {
      alert(
        "⚠️ No lance não é vantajoso, mas na proposta pode ser um bom negócio. Simule na proposta!"
      );
    }
  }, [
    totalArrematacao,
    totalCustosVenda,
    totalTransferenciaDoc,
    formData.outrosCustosImissao,
    formData.reforma,
    formData.caminhaoMudanca,
    formData.chaveiro,
    formData.entrada,
    formData.parcelas,
  ]);

  const [opened, setOpened] = useState(false);

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
          <SectionContainer
            title="Calcular Arrematação"
            total={totalCustosVenda}
          >
            <h2 className="col-span-2">Registros/Despesas Cartorárias</h2>

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

              <NumericFormat
                value={formData.outrosCustosDoc}
                onValueChange={(values) =>
                  onChange("outrosCustosDoc", values.value)
                }
                // suffix="%"
                prefix="R$ "
                thousandSeparator="."
                decimalSeparator=","
                placeholder="Outros Custos (R$)"
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
                value={formData.outrosCustosDoc ?? ""}
                onChange={(e) => onChange("outrosCustosDoc", e.target.value)}
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
              /> */}
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

            <div className="mt-4 text-left font-bold text-[#42ADF1] text-lg col-span-2">
              Total: {formatarEmReais(totalTransferenciaDoc)}
            </div>

            <div className="col-span-2  !bg-cyan-400 !h-[1px]" />

            {/* Valor total embaixo, alinhado à direita */}

            <h2 className="col-span-2">Imissão na posse</h2>

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
                placeholder="Outros Custos (R$)"
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
                onChange={(e) =>
                  onChange("outrosCustosImissao", e.target.value)
                }
                className="w-full h-[45px] rounded-md bg-gray-800 p-2 text-white text-left border border-[#42ADF1] focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
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
              /> */}
            </div>

            {/* Mostrar descrição só se houver valor maior que zero */}
            {toNumberOrZero(formData.outrosCustosImissao) > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-semibold mb-1 select-none text-[#42ADF1]">
                  Descrição do Outro Custo
                </label>
                <input
                  type="text"
                  value={formData.outrosCustosImissaoDescricao ?? ""}
                  onChange={(e) =>
                    onChange("outrosCustosImissaoDescricao", e.target.value)
                  }
                  className="rounded-lg p-2 w-full text-left bg-gray-800 text-[#42ADF1] border border-[#42ADF1] opacity-80 focus:outline-none focus:ring-2 focus:ring-[#42ADF1]"
                  placeholder="Descreva o custo aqui"
                />
              </div>
            )}

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

            <div className="col-span-2  !bg-cyan-400 !h-[1px]" />

            <h2 className="col-span-2">Despesas Recorrentes</h2>

            <table className="w-[200%] text-gray-300 font-mono text-sm border-collapse p-5">
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
                          {/* <NumericFormat
                            value={valorMensal}
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              handleMesesOuValorChange(fieldValor, floatValue || "");
                            }}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            fixedDecimalScale={false}
                            allowNegative={false}
                            className="w-full bg-transparent border border-[#42ADF1] rounded px-6 pl-6 text-white text-left focus:outline-none focus:ring-1 focus:ring-cyan-400 !bg-black"
                            onFocus={(e) => (e.target.style.borderColor = neonBlue)}
                            onBlur={(e) => (e.target.style.borderColor = neonBlue)}
                            onMouseEnter={(e) => (e.target.style.boxShadow = `0 0 8px ${neonBlue}`)}
                            onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
                          /> */}
                          <input
                            type="text"
                            inputMode="decimal"
                            value={valorMensal}
                            onChange={(e) => {
                              // permite só números e uma vírgula
                              const value = e.target.value.replace(/[^0-9,]/g, "").replace(/(,.*),/g, "$1");
                              handleMesesOuValorChange(fieldValor, value);
                            }}
                            onBlur={(e) => {
                              const v = e.target.value.trim();

                              if (v === "" || v === ",") {
                                onChange(fieldValor, "");
                                return;
                              }

                              // converte vírgula para ponto e transforma em número
                              const numeric = parseFloat(v.replace(",", "."));
                              onChange(fieldValor, isNaN(numeric) ? "" : numeric.toFixed(2));
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

            {/* <div className="mt-4 text-left font-bold text-[#42ADF1] text-lg col-span-2">
              Total Custos até a Venda: {formatarEmReais(totalCustosVenda)}
            </div> */}
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

  console.log(`
    arrematação total: ${arrematacaoTotal}
    custos venda: ${custosVendaTotal}
    total docs: ${transferenciaTotal}
    imissao posse: ${imissaoTotal}`)

  // 1. Investimento Inicial
  const investimentoInicial =
    arrematacaoTotal + custosVendaTotal + transferenciaTotal + imissaoTotal;

  // 2. Desconto para venda rápida
  const descontoVendaRapidaPerc = toNumberOrZero(
    formData.descontoVendaRapidaPerc
  );
  // 3. Comissão Corretor
  const comissaoCorretorPerc = toNumberOrZero(formData.comissaoCorretorPerc);
  const valorMercado = toNumberOrZero(formData.valorMercado);
  const valorVendaImovel =
    toNumberOrZero(valorMercado) *
    (1 - toNumberOrZero(formData.lucroMinimo) / 100);
  const comissaoCorretorValor =
    (toNumberOrZero(comissaoCorretorPerc) / 100) *
    toNumberOrZero(valorVendaImovel);

  // 3. IR - Lucro Imobiliário
  const irLucroImobiliarioPerc = toNumberOrZero(
    formData.irLucroImobiliarioPerc
  );
  // const saldoRemanescente =
  // toNumberOrZero(+formData.parcelas * +formData.valorParcelas) -
  // formData.parcelasCustosMeses * formData.valorParcelas;
  // const baseIR = valorMercado - (investimentoInicial + saldoRemanescente + comissaoCorretorValor);
  console.log(`
    valor venda imovel: ${valorVendaImovel}
    investimentoInicial: ${investimentoInicial}
    sr: ${formData.saldoRemanescente}
    comissao corretor: ${comissaoCorretorValor}
    `)

  const irLucroImobiliarioValor =
    (
      toNumberOrZero(valorVendaImovel) -
      (toNumberOrZero(investimentoInicial) +
        toNumberOrZero(formData.saldoRemanescente) +
        toNumberOrZero(comissaoCorretorValor))
    ) *
    (toNumberOrZero(irLucroImobiliarioPerc) / 100);

  // 4. Investimento Total
  console.log(
    "dados",
    formData.valorEntrada,
    formData.parcelasCustosMeses,
    formData.valorParcelas
  );



  const investimentoTotal =
    investimentoInicial + comissaoCorretorValor + irLucroImobiliarioValor

  // 6. Lucro R$
  const lucroR$ =
    toNumberOrZero(valorVendaImovel) -
    (toNumberOrZero(investimentoTotal) +
      toNumberOrZero(formData.saldoRemanescente));

  const lucroPerc =
    investimentoTotal > 0
      ? (toNumberOrZero(lucroR$) / toNumberOrZero(investimentoInicial)) * 100
      : 0;

  useEffect(() => {
    onChange("valorVendaImovel", String(valorVendaImovel));
    onChange("lucro", lucroPerc);
    onChange("lucroEmReal", lucroR$);
    onChange("investimentoTotal", investimentoTotal);
    // onChange("saldoRemanescente", saldoRemanescente);
  }, [
    valorVendaImovel,
    lucroPerc,
    investimentoTotal,
    lucroR$,
    // saldoRemanescente,
  ]);

  const [opened, setOpened] = useState(false);
  // Totais das seções anteriores

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
            className=" font-montserrat
                                    border border-[#42ADF1] rounded-3xl p-6 mb-8 shadow-lg
                                    hover:shadow-[0_8px_20px_rgba(0,255,255,0.5)] transition-shadow duration-400
                                    overflow-x-auto
                                    scrollbar-custom      
                                    scrollbar-no-buttons
                                    "
          >
            {/* <h2 className="text-2xl font-extrabold mb-6 text-white border-b border-[#42ADF1] pb-2 select-none">
                            Lucro Líquido
                        </h2> */}

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
                <InputField
                  label="Desconto para Venda Rápida (%)"
                  field="descontoVendaRapidaPerc"
                  value={formData.descontoVendaRapidaPerc}
                  onChange={onChange}
                  unit="%"
                  type="number"
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
                  className="block text-xs sm:text-sm font-semibold mb-1 select-none font-montserrat"
                  style={{ color: neonBlue }}
                >
                  Saldo Remanescente
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
                  {formatarEmReais(formData?.saldoRemanescente)}
                </div>
              </div>

              <div>
                <InputField
                  label="IR - Lucro Imobiliário (%)"
                  field="irLucroImobiliarioPerc"
                  value={formData.irLucroImobiliarioPerc}
                  onChange={onChange}
                  unit="%"
                  type="number"
                />
                <p className="mt-1 text-sm font-semibold text-[#42ADF1]">
                  {formatarEmReais(irLucroImobiliarioValor)}
                </p>
              </div>

              {/* Comissão Corretor */}
              <div>
                <InputField
                  label="Comissão Corretor (%)"
                  field="comissaoCorretorPerc"
                  value={formData.comissaoCorretorPerc}
                  onChange={onChange}
                  unit="%"
                  type="number"
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

  // const toNumberOrZero = (val) => {
  //   if (!val) return 0;
  //   const cleaned = val
  //     .toString()
  //     .replace(/[^0-9.,-]/g, "")
  //     .replace(",", ".");
  //   const parsed = parseFloat(cleaned);
  //   return isNaN(parsed) ? 0 : parsed;
  // };

  const investimento = toNumberOrZero(formData.investimento);
  const vendaImovel = toNumberOrZero(formData.vendaImovel);

  const lucroLiquidoValor = vendaImovel - investimento;
  const lucroLiquidoPerc =
    toNumberOrZero(investimento) === 0
      ? 0
      : (toNumberOrZero(lucroLiquidoValor) / toNumberOrZero(investimento)) *
      100;

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

                <div>Saldo Parcelamento</div>
                <div className="text-left">
                  {formatBRL(formData.saldoRemanescente)}
                </div>

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

                <div className={`col-span-2 text-center font-extrabold text-2xl mt-6 border border-solid border-[#red] border-100 p-3 ${sugestaoInvestimento === "NÃO INVESTIR"
                  ? "text-red-500"
                  : "text-green-400"
                  }`}>
                  {sugestaoInvestimento}
                </div>
              </div>
            </div>
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

const PropostaDeCompra = ({ formData, onChange, prevProposta, openModal }) => {
  const { salvarLance } = useContext(Context);
  const [showModalArrematacao, setShowModalArrematacao] = useState(false);
  const [criandoParcelaProposta, setCriandoParcelaProposta] = useState(false);
  const { calculadoraId } = useContext(Context);

  // Calcula preço por m²
  const precoM2 = useMemo(() => {
    const metragem = toNumberOrZero(formData?.metragem);
    const valorMercado = toNumberOrZero(formData?.valorMercado);
    return metragem > 0 ? valorMercado / metragem : 0;
  }, [formData?.metragem, formData?.valorMercado]);

  // Calcular valor 2ª praça com base no deságio e valor 1ª praça, se não informado
  const valor2PracaCalc = useMemo(() => {
    const valor1Praca = toNumberOrZero(formData.valor1Praca);
    const desagio = toNumberOrZero(formData.desagio);
    const valor2Praca = toNumberOrZero(formData.valor2Praca);
    if (valor2Praca > 0) return valor2Praca;
    if (valor1Praca > 0 && desagio > 0) {
      return valor1Praca * (1 - desagio / 100);
    }
    return 0;
  }, [formData.valor1Praca, formData.desagio, formData.valor2Praca]);

  const sections = [
    { id: "imovel-section", title: "Imóvel" },
    { id: "calculadora-section", title: "Calculadora" },
    { id: "lucro-liquido-section", title: "Lucro Líquido" },
    { id: "quadro-resumo-section", title: "Quadro Resumo" },
  ];

  const [showResumoModal, setShowResumoModal] = useState(false);

  // config modal arrematação
  const [valorArrematacao, setValorArrematacao] = useState("");
  const [quantidadeParcelas, setQuantidadeParcelas] = useState("");
  const [porcentagemEntrada, setPorcentagemEntrada] = useState("");
  const [indice, setIndice] = useState(""); // select
  const [saved, setSaved] = useState("");
  const [calculadora, setCalculadora] = useState(null);
  const [dataAssinaturaAutoArrematacao, setDataAssinaturaAutoArrematacao] =
    useState("");

  async function getCalculadora() {
    console.log("rodando né");
    const { data } = await api.get("/calculadora/" + calculadoraId);
    if (data) {
      setCalculadora(data);
      console.log(
        data,
        "calculadoraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      );
      if (data.parcelaProposta) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    } else {
      alert("Erro ao buscar calculador");
    }
  }

  useEffect(() => {
    getCalculadora();
  }, []);

  const { modalCreateChecklistAndReminder } = useContext(Context);

  // depois de rodar mostrar que os dados foram salvos
  async function createParcelaProposta(e) {
    e.preventDefault();
    if (!indice) return alert("Selecione o índice");
    const { data } = await api.post("/calculadora/parcela-proposta", {
      valorArrematacao,
      quantidadeParcelas,
      porcentagemEntrada,
      indice,
      dataAssinaturaAutoArrematacao: dataAssinaturaAutoArrematacao
        .split("-")
        .reverse()
        .join("/"),
      calculadoraId: +calculadoraId,

      nome: `Parcelas de Proposta (Calculadora - ${calculadora.nome})`, // pegar calculadora
    });

    setCriandoParcelaProposta(false);
    setShowModalArrematacao(false);
    setSaved(true);
    salvarLance();
    console.log(data);
    // mandar calculadoraId
    //salvar alterações
  }

  return (
    <div className="max-w-6xl text-[green]-300 -mono relative">
      {showModalArrematacao && (
        <div
          style={{ display: modalCreateChecklistAndReminder ? "none" : "flex" }}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-40 flex items-center justify-center px-4"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              {!criandoParcelaProposta ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-white text-center">
                    Deseja criar um parcelamento?
                  </h2>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setShowModalArrematacao(false);
                        setCriandoParcelaProposta(false);
                        salvarLance();
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Não
                    </button>
                    <button
                      onClick={() => {
                        setCriandoParcelaProposta(true);
                      }}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Sim
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowModalArrematacao(false);
                      setCriandoParcelaProposta(false);
                    }}
                    className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors duration-200 text-2xl"
                  >
                    <FaWindowClose />
                  </button>
                  <h2 className="text-2xl font-bold mb-6 text-white text-center">
                    Preencha os dados
                  </h2>

                  <form onSubmit={createParcelaProposta} className="space-y-4">
                    <div>
                      {/* <label className="block text-sm font-semibold mb-2 text-cyan-400">
                                                Data da assinatura do auto da arrematação
                                            </label>
                                            <input
                                                value={dataAssinaturaAutoArrematacao}
                                                onChange={(e) => setDataAssinaturaAutoArrematacao(e.target.value)}
                                                className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                                                type="text"
                                                placeholder="Digite o valor"
                                            /> */}
                      <InputFieldChangeState
                        label="Data da assinatura do auto da arrematação"
                        value={dataAssinaturaAutoArrematacao}
                        onChange={setDataAssinaturaAutoArrematacao}
                        type="date"
                      />
                    </div>

                    <div>
                      <InputFieldChangeState
                        label="Valor de arrematação"
                        value={valorArrematacao}
                        onChange={setValorArrematacao}
                        unit="R$"
                        type="number"
                      />
                    </div>

                    <div>
                      <InputFieldChangeState
                        label="Quantidade de parcelas"
                        value={quantidadeParcelas}
                        onChange={setQuantidadeParcelas}
                        type="number"
                      />
                    </div>

                    <div>
                      <InputFieldChangeState
                        label="Porcentagem da entrada (%)"
                        value={porcentagemEntrada}
                        onChange={setPorcentagemEntrada}
                        unit="%"
                        type="number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-cyan-400">
                        Índice
                      </label>
                      <select
                        value={indice}
                        onChange={(e) => setIndice(e.target.value)}
                        className="w-full rounded-lg p-3 bg-gray-800 text-white border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                      >
                        <option value="" className="bg-gray-800">
                          Selecione
                        </option>
                        <option value="INPC" className="bg-gray-800">
                          INPC
                        </option>
                        <option value="IGP-M" className="bg-gray-800">
                          IGP-M
                        </option>
                        <option value="IGP-DI" className="bg-gray-800">
                          IGP-DI
                        </option>
                        <option value="IPCA" className="bg-gray-800">
                          IPCA
                        </option>
                        <option value="IPCA-E" className="bg-gray-800">
                          IPCA-E
                        </option>
                        <option
                          value="MEDIA-INPC-IGP-DI"
                          className="bg-gray-800"
                        >
                          Média INPC e IGP-DI
                        </option>
                        <option value="SELIC" className="bg-gray-800">
                          Selic
                        </option>
                        <option value="POUPANCA" className="bg-gray-800">
                          Poupança
                        </option>
                        <option value="IGP" className="bg-gray-800">
                          IGP (Índice Geral de Preços)
                        </option>
                        <option value="IPC-FIPE" className="bg-gray-800">
                          IPC-FIPE
                        </option>
                        <option value="IPC-BR" className="bg-gray-800">
                          IPC-BR (FGV)
                        </option>
                      </select>
                    </div>

                    <button
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
                      type="submit"
                    >
                      Criar parcela da arrematação
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
      </button> */}

      {/* Modal do Quadro Resumo */}
      {/* {showResumoModal && (
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
      )} */}

      <div className="flex justify-center m-10">
        <button
          onClick={() => {
            if (!saved) {
              openModal(true);
              setShowModalArrematacao(true);
            } else {
              salvarLance();
            }
          }}
          className="bg-purple-900/40 px-4 py-2 rounded-md text-lg text-center tracking-wider font-light mt-5 uppercase hover:bg-purple-800"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default PropostaDeCompra;
