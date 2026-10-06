import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Context from "../context/Context";
import { AiOutlineMail, AiOutlineKey, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../context/AuthContext";
import api from "../axios/axiosBase";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function Login({ onLogin }) {
  const { setUser, setUsuarioCadastroId, usuarioCadastroId, setIsAdmin } = useContext(Context);
  const { login } = useAuth()
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    if (usuarioCadastroId) {
      nav('/pagamento')
    }
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    if (!recaptchaValue) {
      setErro("Por favor, confirme o reCAPTCHA.");
      return;
    }
    try {
      const { data } = await axios.post(process.env.REACT_APP_API_URL + "/auth/login", { email, password: senha }, { withCredentials: true }); // precisa ser passado password para funcionar
      if (data?.user) {
        console.log(data, 'login')
        login(data.user, data.accessToken)
        // setUser(data);
        console.log('navegando')
        const { data: payload } = await api.get('/user/admin/' + data.user.id)
        console.log(payload, 'resultado daqui, payloaddddddddddddddddddddddddddd')
        if (payload.admin) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
        nav('/calculadora/dashboard')
      }
    } catch (err) {
      console.log(err)
      if (err.response?.data?.userId) {
        setUsuarioCadastroId(err.response.data.userId)
        nav('/pagamento')
      }
      setErro(err.response?.data?.message || "Credenciais inválidas");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010821]">
      <div className="w-full max-w-5xl px-2 md:px-0">
        {/* Neon Borders */}
        <div className="relative rounded-3xl overflow-visible">
          {/* Borda externa neon */}
          <div
            className="absolute -inset-1 rounded-3xl pointer-events-none z-10 p-[3px] animate-neonSlide"
            style={{
              background: 'linear-gradient(120deg, #5524E8, #6024AF, #5524E8, #6024AF)',
              backgroundSize: '200% 200%',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Card Content */}
          <div className="relative z-20 w-full bg-white/5 rounded-3xl flex flex-col md:flex-row overflow-hidden">
            {/* Lado esquerdo: Formulário */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col justify-center gap-6 p-8 md:p-14 bg-[#101a36]/90 backdrop-blur-md"
            >

              <div className="flex flex-col gap-4">
                <label className="text-white font-semibold text-base">E-mail:</label>
                <div className="flex items-center bg-[#eaf6f3] rounded-lg px-3 py-2 shadow-inner">
                  <AiOutlineMail className="text-[#5524E8] text-xl mr-2" />
                  <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="flex-1 bg-transparent outline-none text-[#010821] font-medium placeholder-gray-400"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <label className="text-white font-semibold text-base mt-2">Senha:</label>
                <div className="flex items-center bg-[#eaf6f3] rounded-lg px-3 py-2 shadow-inner">
                  <AiOutlineKey className="text-[#5524E8] text-xl mr-2" />
                  <input
                    type={showSenha ? "text" : "password"}
                    placeholder="Digite sua senha"
                    className="flex-1 bg-transparent outline-none text-[#010821] font-medium placeholder-gray-400"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="ml-2 text-[#5524E8] hover:text-[#2143BE] transition"
                    onClick={() => setShowSenha((v) => !v)}
                  >
                    {showSenha ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                  </button>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="text-xs text-[#6986ee] mt-1 hover:underline text-left w-fit"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Esqueceu a senha?
                  </button>

                  {/* <button
                    type="button"
                    className="text-xs text-[#42ADF0] mt-1 hover:underline text-left w-fit"
                    onClick={() => nav('/cadastro')}
                  >
                    Criar conta
                  </button> */}

                </div>

              </div>

              {/* reCAPTCHA como botão */}
              <div className="flex flex-col gap-2 mt-2">

                <div className="flex justify-center min-h-[78px]">
                  <ReCAPTCHA
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    onChange={setRecaptchaValue}
                    theme="blue"
                  />
                </div>
              </div>
              {erro && <div className="text-red-400 text-center font-semibold">{erro}</div>}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#5524E8] to-[#310092] text-gray-200 font-bold py-2 rounded-lg shadow hover:brightness-110 transition mt-2 text-lg tracking-wide"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => nav('/cadastro')}
                className="w-full bg-transparent border border-[#5524E8] text-[#5524E8] font-bold py-2 rounded-lg shadow hover:bg-[#5524E8] hover:text-white transition mt-2 text-lg tracking-wide"
              >
                Cadastre-se
              </button>
            </form>
            {/* Lado direito: Card visual */}
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#5524E8] via-[#2143BE] to-[#190B70] p-12 relative">
              <div className="absolute inset-0 bg-black/60 rounded-tr-3xl rounded-br-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <img
                  src="LogoHorizontalB.png"
                  alt="Lancei Hub"
                  className="w-90 h-90 mb-6 p-3"
                // style={{ filter: "drop-shadow(0 0 12px #fff8)" }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />



    </div>
  );
}
