import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios/axiosBase";
import Context from "../../context/Context";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function SignUp() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [cpf, setCpf] = useState("");
    const [contato, setContato] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { usuarioCadastroId, setUsuarioCadastroId } = useContext(Context)
    const [aceitouTermos, setAceitouTermos] = useState(false);
    const [showTerms, setShowTerms] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [cpfError, setCpfError] = useState("");

    const nav = useNavigate();

    useEffect(() => {
        if (usuarioCadastroId) {
            nav('/pagamento')
        }
    }, [])

    const checkCpf = async (cpf) => {
        try {
            const { data } = await api.post("/user/check-cpf", { cpf });
            return data.exists;
        } catch (err) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        if (!aceitouTermos) {
            setError('Aceite os termos para se cadastrar')
            setLoading(false);
            return
        }

        if (cpfError) {
            setError('Corrija os erros antes de prosseguir.')
            setLoading(false);
            return
        }

        try {
            const { data } = await api.post("/user/create", { nome, email, senha, cpf, contato, dataNascimento });
            setUsuarioCadastroId(data.id)
            nav('/pagamento')
            setMessage("Usuário criado com sucesso! Você pode fazer login agora.");
            setNome("");
            setEmail("");
            setSenha("");
            setCpf("");
            setContato("");
            setDataNascimento("");
            // setTimeout(() => {
            //     nav("/login");
            // }, 3000);
        } catch (err) {
            setError("Erro ao criar usuário. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#010821] via-[#0a0f2c] to-[#1a1a3a] p-6 relative overflow-hidden">

            {
                showTerms && (
                    <div className="absolute z-50 w-[100%] flex flex-col items-center  justify-center backdrop-blur-md">
                        <button onClick={() => setShowTerms(false)} className="bg-red-700 absolute top-4 mt-1/5 right-0 mr-60 text-white rounded px-5 py-1/2 z-50">Fechar Termos</button>
                        <iframe
                            src="LanceihubTermos_de_Uso.pdf"
                            className="w-11/12 h-[90vh] border rounded-2xl shadow relative"
                            title="Termos de Uso"
                        />
                    </div>
                )
            }

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">CPF Já Cadastrado</h2>
                        <p className="text-gray-700 mb-4">Este CPF já está cadastrado no sistema. Por favor, faça login ou use outro CPF.</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5524E8]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2143BE]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#42ACF0]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            <div className="max-w-6xl w-full relative z-10">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col lg:flex-row">
                    {/* Form Section */}
                    <div className="flex-1 p-8 lg:p-12 relative">
                        <div className="max-w-md mx-auto">
                            {/* Floating Header */}
                            <div className="text-center mb-8 relative">
                                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#5524E8]/20 rounded-full blur-xl animate-bounce"></div>
                                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#2143BE]/20 rounded-full blur-lg animate-bounce delay-300"></div>
                                <h1 className="text-4xl lg:text-5xl font-bold font-montserrat text-transparent bg-gradient-to-r from-[#5524E8] via-[#42ACF0] to-[#2143BE] bg-clip-text mb-3 tracking-tight">
                                    Criar Conta
                                </h1>
                                <p className="text-gray-400 text-lg">Junte-se à nossa comunidade</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-white font-medium text-sm mb-2 group-hover:text-[#5524E8] transition-colors duration-300">
                                            Nome
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Seu nome completo"
                                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5524E8] focus:border-transparent transition-all duration-300 hover:bg-white/15"
                                                value={nome}
                                                onChange={e => setNome(e.target.value)}
                                                required
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5524E8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-white font-medium text-sm mb-2 group-hover:text-[#5524E8] transition-colors duration-300">
                                            E-mail
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                placeholder="seu@email.com"
                                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5524E8] focus:border-transparent transition-all duration-300 hover:bg-white/15"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5524E8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-white font-medium text-sm mb-2 group-hover:text-[#5524E8] transition-colors duration-300">
                                            Senha
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5524E8] focus:border-transparent transition-all duration-300 hover:bg-white/15"
                                                value={senha}
                                                onChange={e => setSenha(e.target.value)}
                                                required
                                                minLength={8}
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5524E8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-white font-medium text-sm mb-2 group-hover:text-[#5524E8] transition-colors duration-300">
                                            CPF
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="000.000.000-00"
                                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5524E8] focus:border-transparent transition-all duration-300 hover:bg-white/15"
                                                value={cpf}
                                                onChange={async (e) => {
                                                    const value = e.target.value;
                                                    setCpf(value);
                                                    if (value.length >= 11) { // Assuming CPF has at least 11 digits
                                                        const exists = await checkCpf(value);
                                                        if (exists) {
                                                            setCpfError("Este CPF já está cadastrado no sistema.");
                                                        } else {
                                                            setCpfError("");
                                                        }
                                                    } else {
                                                        setCpfError("");
                                                    }
                                                }}
                                                required
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5524E8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-white font-medium text-sm mb-2 group-hover:text-[#5524E8] transition-colors duration-300">
                                            Contato <span className="text-gray-500 text-xs">(Opcional)</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="(00) 00000-0000"
                                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5524E8] focus:border-transparent transition-all duration-300 hover:bg-white/15"
                                                value={contato}
                                                onChange={e => setContato(e.target.value)}
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5524E8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-white font-medium text-sm mb-2 group-hover:text-[#5524E8] transition-colors duration-300">
                                            Data de Nascimento <span className="text-gray-500 text-xs">(Opcional)</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#5524E8] focus:border-transparent transition-all duration-300 hover:bg-white/15"
                                                value={dataNascimento}
                                                onChange={e => setDataNascimento(e.target.value)}
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5524E8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2 justify-center">
                                    <div className="flex gap-3 items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={aceitouTermos}
                                            onChange={e => setAceitouTermos(e.target.checked)}
                                            className="accent-[#5524E8] w-5 h-5"
                                            required
                                        />
                                        <div>
                                            <span className="text-xs text-gray-200">
                                                Li e aceito
                                                {/* Li e aceito os{" "}
                                            <a
                                                href="LanceihubTermos_de_Uso.pdf"
                                                download
                                                className="underline text-[#6986ee] hover:text-[#5524E8] transition"
                                            >
                                                Termos de Uso
                                                </a> */}
                                            </span>
                                            <span onClick={() => setShowTerms(true)} className="text-xs text-blue-500"> os termos de uso</span>

                                        </div>

                                    </div>



                                </div>

                                {message && (
                                    <div className="p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl backdrop-blur-sm animate-pulse">
                                        {message}
                                    </div>
                                )}

                                {cpfError && (
                                    <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl backdrop-blur-sm animate-pulse">
                                        {cpfError}
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl backdrop-blur-sm animate-pulse">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#5524E8] via-[#42ACF0] to-[#2143BE] hover:from-[#6024AF] hover:via-[#42ACF0] hover:to-[#190B70] text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg tracking-wide"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Criando...</span>
                                        </div>
                                    ) : (
                                        "🚀 Criar Conta"
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Visual Section */}
                    <div className="flex-1 bg-gradient-to-br from-[#5524E8]/20 via-[#2143BE]/10 to-[#010821] p-8 lg:p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#5524E8]/10 to-transparent"></div>
                        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                            {/* Animated Icon */}
                            <div className="relative mb-8">
                                <div className="w-32 h-32 bg-gradient-to-br from-[#5524E8] to-[#2143BE] rounded-2xl flex items-center justify-center shadow-2xl animate-float">
                                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-[#5524E8] to-[#42ACF0] rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                            </div>

                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-montserrat">
                                Bem-vindo à
                                <span className="block text-transparent bg-gradient-to-r from-[#42ACF0] to-[#5524E8] bg-clip-text">
                                    Lancei Hub
                                </span>
                            </h2>

                            <p className="text-gray-300 text-lg leading-relaxed max-w-sm">
                                Comece sua jornada conosco e descubra ferramentas incríveis para impulsionar seus projetos.
                            </p>

                            <div className="mt-8 flex space-x-4">
                                <div className="w-3 h-3 bg-[#5524E8] rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-[#42ACF0] rounded-full animate-bounce delay-100"></div>
                                <div className="w-3 h-3 bg-[#2143BE] rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-10 right-10 w-20 h-20 border border-[#5524E8]/30 rounded-full animate-spin-slow"></div>
                        <div className="absolute bottom-10 left-10 w-16 h-16 bg-[#42ACF0]/20 rounded-lg rotate-45 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}