import React, { useState, useEffect, useContext } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineCheckSquare,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineBook,
} from "react-icons/ai";
import { Users } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import api from "./axios/axiosBase";

import CalculadoraDashboard from "./components/CalculadoraDashboard";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Context from "./context/Context";
import Checklist from "./components/Checklist";
import Home from "./components/Home";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/400.css";
import ChecklistDashboard from "./components/ChecklistDashboard";
import FindOpportunities from "./components/FindOpportunities";
import LembreteEncerramentos from "./components/LembreteEncerramentos";
import { HiBellAlert } from "react-icons/hi2";
import CalculadoraComponent from "./components/CalculadoraComponent";
import { useAuth } from "./context/AuthContext";
import PropostasParcelas from "./components/PropostasParcelas";
import PropostaParcela from "./components/PropostaParcela";
import PaymentSucessPage from "./components/register/pages/PaymentSucessPage";
import PaymentPendingPage from "./components/register/pages/PaymentPendingPage";
import PaymentErroPage from "./components/register/pages/PaymentErroPage";
import Plans from "./components/register/Plans";
import SignUp from "./components/register/SignUp";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Parceiros from "./components/Parceiros";
import Learn from "./components/Learn";
import { GrGroup } from "react-icons/gr";
import { CiMoneyCheck1 } from "react-icons/ci";
import MinhasArrematacoes from "./components/MinhasArrematacoes";
import MinhasPropostas from "./components/MinhasProposta";
import { AiOutlineTrophy } from "react-icons/ai";
import { RiAuctionFill } from "react-icons/ri";
import UpdatePage from "./components/update/UpdatePage";

import Notificacao from "./components/notificacao";
import { useWebSocket } from './hooks/useWebSocket';
import { AiFillBell } from "react-icons/ai";
import NotificationPopup from "./components/NotificationPopup";
import { MdAdminPanelSettings } from "react-icons/md";
import { PiClockCountdownFill } from "react-icons/pi";
import UserManagement from "./components/UserManagement";
import UsersCount from "./UsersCount";
import Admin from "./components/Admin";
import ManageCupom from "./components/ManageCupom";
import LandingPage from "./components/register/components/LandingPage";
import NotificationBell from "./components/NotificationBell";


/* ------------------------------
   Reusable link + submenu
   ------------------------------ */
const SidebarLink = ({ to, label, icon, active, onClick, onKeyDown }) => {
  const nav = useNavigate();
  const handleClick = () => {
    nav(to);
    if (onClick) onClick();
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    if (onKeyDown) onKeyDown(e);
  };
  return (
    <button
      className={`flex items-center px-4 sm:px-7 py-3 sm:py-4 rounded-lg mb-2 font-medium text-sm sm:text-lg transition-all duration-200 w-full text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
      ${active
          ? "bg-gradient-to-r from-[#5524E8] to-[#6024AF] text-white shadow-lg"
          : "text-gray-200 hover:bg-[#5524E8]/20 hover:scale-105 hover:shadow-md"
        }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={label}
      role="menuitem"
      tabIndex={0}
    >
      <span className="mr-2 flex-shrink-0 transition-transform duration-200">{icon}</span>
      <span
        className="ml-2 flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-300 opacity-100 pointer-events-auto"
      >
        {label}
      </span>
    </button>
  );
};

const SidebarSubmenu = ({
  label,
  icon,
  active,
  submenuOpen,
  toggleSubmenu,
  children,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSubmenu();
    }
  };
  return (
    <div role="menu">
      <button
        className={`flex items-center px-4 sm:px-7 py-4 rounded-lg mb-2 font-medium text-lg transition-all duration-200 w-full text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
        ${active
            ? "bg-gradient-to-r from-[#5524E8] to-[#310092] text-white shadow-lg"
            : "text-gray-200 hover:bg-[#5524E8]/20 hover:scale-105 hover:shadow-md"
          }`}
        onClick={toggleSubmenu}
        onKeyDown={handleKeyDown}
        title={label}
        aria-expanded={submenuOpen}
        aria-haspopup="true"
        role="menuitem"
        tabIndex={0}
      >
        <span className="mr-2 flex-shrink-0 transition-transform duration-200">{icon}</span>
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-300 opacity-100 pointer-events-auto">
          {label}
        </span>
        <span className="ml-auto flex-shrink-0 transition-transform duration-300">{submenuOpen ? "▼" : "▶"}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${submenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        aria-hidden={!submenuOpen}
      >
        <div className="ml-8 mt-2 space-y-1">{children}</div>
      </div>
    </div>
  );
};

/* ------------------------------
   Sidebar component (desktop + mobile)
   - Desktop: full-height fixed (not floating)
   - Nav scrolls; user/logout block sticky at bottom
   - Safe-area fallback for mobile notches / taskbars
   ------------------------------ */

const Sidebar = ({ user, onLogout, mobileOpen, setMobileOpen, visible, onNotification }) => {
  console.log(user)
  const location = useLocation();
  const navigate = useNavigate();
  const [arrematacoesOpen, setArrematacoesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // height reserved for bottom user block; used to pad the nav so links don't scroll under it
  const userBlockHeight = 88; // px (approx)
  const navPaddingBottom = `calc(${userBlockHeight}px + env(safe-area-inset-bottom, 12px))`;
  const [notificacao, setNotificacao] = useState([]);

  useWebSocket(user.id, (data) => {
    setNotificacao((prev) => Array.isArray(data) ? data : [...prev, data]);
    if (onNotification) onNotification(data);
  });

  useEffect(() => {
    console.log("📩 Notificações atualizadas:", notificacao);
  }, [notificacao]);

  console.log("chegou tantas notificações", notificacao?.length);


  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const trimmed = searchTerm.trim().toLowerCase();
        const [calculadorasRes, checklistsRes] = await Promise.all([
          api.get('/calculadora', { params: { limit: 50 } }),
          api.get('/calculadora/checklist', { params: { limit: 50 } })
        ]);
        const filteredCalculadoras = calculadorasRes.data.filter(item => item.nome && item.nome.toLowerCase().includes(trimmed));
        const filteredChecklists = checklistsRes.data.filter(item => item.nome.toLowerCase().includes(trimmed));
        const results = [
          ...filteredCalculadoras.map(item => ({ ...item, type: 'calculadora' })),
          ...filteredChecklists.map(item => ({ ...item, type: 'checklist' }))
        ];
        setSearchResults(results.slice(0, 10));
      } catch (error) {
        console.error('Erro na busca:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleResultClick = (result) => {
    if (result.type === 'calculadora') {
      navigate(`/calculadora/${result.id}`);
      window.location.reload()
    } else if (result.type === 'checklist') {
      navigate(`/checklist/${result.id}`);
      window.location.reload()
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const { isAdmin } = useContext(Context)

  return (
    <>
      {/* DESKTOP SIDEBAR - full height, not floating */}
      <aside
        className={`hidden md:flex flex-col justify-between fixed left-0 top-0 bottom-0 z-30 transition-all duration-300
          ${visible ? "md:w-80 xl:w-96" : "w-0"}
          ${visible ? "bg-[#010821] border-r border-purple-500/50" : "bg-transparent"}
        `}
        aria-hidden={!visible}
      >
        {visible && (
          <div className="flex flex-col h-full">
            <div className="pt-8 pb-4 text-center flex-shrink-0">
              <img
                src="LogoHorizontalB.png"
                alt="LanceiHub"
                className="mx-auto mb-2 drop-shadow-lg transition-all duration-300 w-32 md:w-36"
              />
            </div>

            {/* Search Section */}
            <div className="px-4 mb-4">
              <h3 className="text-sm font-bold mb-3 text-center select-none" style={{ color: "purple" }}>
                Busca Global
              </h3>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  placeholder="Buscar calculadoras, checklists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder-gray-400 text-xs"
                />
              </div>
              {loading && <p className="text-xs text-purple-300 mt-2">Buscando...</p>}
              {searchResults.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto bg-gray-800 rounded-lg border border-purple-500/50">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-3 py-2 text-xs text-white hover:bg-purple-600/20 transition-colors duration-200"
                    >
                      <span className="font-semibold">{result.nome}</span> - {result.type === 'calculadora' ? 'Calculadora' : 'Checklist'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Scrollable nav: pad bottom to avoid overlaying user block */}
            <nav
              className="flex flex-col px-4 overflow-y-auto flex-1"
              style={{ paddingBottom: navPaddingBottom, overscrollBehavior: 'contain' }}
              onWheel={(e) => e.stopPropagation()}
              role="navigation"
              aria-label="Menu principal"
            >
              <SidebarLink
                to="/"
                label="Home"
                icon={<AiOutlineHome size={26} />}
                active={location.pathname === "/"}
              />
              <SidebarLink
                to="/checklist-dashboard"
                label="Checklists"
                icon={<AiOutlineCheckSquare size={26} />}
                active={location.pathname === "/checklist-dashboard"}
              />
              <SidebarLink
                to="/calculadora/dashboard"
                label="Calculadoras"
                icon={<AiOutlineBarChart size={26} />}
                active={location.pathname === "/calculadora/dashboard"}
              />
              <SidebarSubmenu
                label="Arrematações"
                icon={<RiAuctionFill size={26} />}
                active={location.pathname.startsWith("/minhas-arrematacoes")}
                submenuOpen={arrematacoesOpen}
                toggleSubmenu={() => setArrematacoesOpen(!arrematacoesOpen)}
              >
                <SidebarLink
                  to="/minhas-arrematacoes"
                  label="Arrematações"
                  icon={<AiOutlineTrophy size={22} />}
                  active={location.pathname === "/minhas-arrematacoes"}
                />
                <SidebarLink
                  to="/propostas-parcelas"
                  label="Minhas Propostas"
                  icon={<CiMoneyCheck1 size={26} />}
                  active={location.pathname === "/propostas-parcelas"}
                />
              </SidebarSubmenu>
              <SidebarLink
                to="/lembrete"
                label="Encerramentos"
                icon={<PiClockCountdownFill size={26} />}
                active={location.pathname === "/lembrete"}
              />
              <SidebarLink
                to="/find-opportunities"
                label="Oportunidades"
                icon={<AiOutlineSearch size={26} />}
                active={location.pathname === "/find-opportunities"}
              />
              <div className="flex items-center ">
                <SidebarLink
                  to="/notificacao"
                  label={`Notificação${notificacao?.length > 0 ? ` (${notificacao.length})` : ""}`}
                  icon={<HiBellAlert size={26} />}
                  active={location.pathname === "/notificacao"}

                />
              </div>
              <SidebarLink
                to="/parceiros"
                label="Parceiros"
                icon={<GrGroup size={26} />}
                active={location.pathname === "/parceiros"}
              />
              <SidebarLink
                to="/learn"
                label="Aprender"
                icon={<AiOutlineBook size={26} />}
                active={location.pathname === "/learn"}
              />


              {
                isAdmin && (
                  <SidebarLink
                    to="/admin"
                    label="Admin"
                    icon={<MdAdminPanelSettings size={26} />}
                    active={location.pathname === "/admin"}
                  />
                )
              }
            </nav>

            {/* USER BLOCK - sticky bottom so always visible; includes logout */}
            <div
              className="border-t border-white/10 px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[#010821] w-full"
              style={{ position: "sticky", bottom: 0, paddingBottom: "calc(env(safe-area-inset-bottom, 12px))" }}
            >
              <div className="flex items-center">
                <div className="rounded-full bg-white flex items-center justify-center mr-4 w-12 h-12 text-2xl">
                  <AiOutlineUser />
                </div>
                <div className="">
                  <div className="font-semibold text-base text-gray-200">
                    {user?.nome || user?.name || "Visitante"}
                  </div>
                  <div className="text-xs text-gray-200">
                    {user?.email || "Faça login"}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={onLogout}
                  title="Sair"
                  className="rounded-full hover:bg-white/10 transition ml-4 p-2 flex items-center"
                >
                  <AiOutlineLogout size={22} className="text-red-400" />
                  <span className="ml-2 text-sm text-red-300">Sair</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MOBILE DRAWER - full screen overlay but nav area keeps user block visible */}
      <div className={`fixed inset-0 z-40 md:hidden transition ${mobileOpen ? "block" : "hidden"}`}>
        <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />

        <div className="absolute left-0 top-0 right-0 bottom-0 bg-[#010821] flex flex-col">
          <div className="py-6 text-center flex-shrink-0">
            <img
              src="teste3.png"
              alt="Leilão de Verdade"
              className="w-16 mx-auto mb-2 drop-shadow-lg"
              style={{ filter: "drop-shadow(0 0 8px #fff8)" }}
            />
            <div className="font-bold font-montserrat text-xl tracking-wide text-white pt-2">
              Leilão de Verdade
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: navPaddingBottom }}>
            <nav className="flex flex-col">
              <SidebarLink to="/" label="Home" icon={<AiOutlineHome size={22} />} active={location.pathname === "/"} onClick={() => setMobileOpen(false)} />
              <SidebarLink to="/checklist-dashboard" label="Checklists" icon={<AiOutlineCheckSquare size={22} />} active={location.pathname === "/checklist-dashboard"} onClick={() => setMobileOpen(false)} />
              <SidebarLink to="/calculadora/dashboard" label="Calculadoras" icon={<AiOutlineBarChart size={22} />} active={location.pathname === "/calculadora/dashboard"} onClick={() => setMobileOpen(false)} />
              <SidebarLink to="/minhas-arrematacoes" label="Minhas Arrematações" icon={<AiOutlineTrophy size={22} />} active={location.pathname === "/minhas-arrematacoes"} onClick={() => setMobileOpen(false)} />
              <SidebarLink to="/propostas-parcelas" label="Minhas Propostas" icon={<CiMoneyCheck1 size={22} />} active={location.pathname === "/propostas-parcelas"} onClick={() => setMobileOpen(false)} />
              <SidebarLink to="/lembrete" label="Encerramentos" icon={<PiClockCountdownFill size={22} />} active={location.pathname === "/lembrete"} onClick={() => setMobileOpen(false)} />
              <SidebarLink to="/find-opportunities" label="Oportunidades" icon={<AiOutlineSearch size={22} />} active={location.pathname === "/find-opportunities"} onClick={() => setMobileOpen(false)} />
              <SidebarLink to="/notificacao" label="Notificação" icon={<HiBellAlert size={22} />} active={location.pathname === "/notificacao"} onClick={() => setMobileOpen(false)} />

              <SidebarLink to="/parceiros" label="Parceiros" icon={<GrGroup size={22} />} active={location.pathname === "/parceiros"} onClick={() => setMobileOpen(false)} />
              <SidebarLink to="/learn" label="Aprender" icon={<AiOutlineBook size={22} />} active={location.pathname === "/learn"} onClick={() => setMobileOpen(false)} />
              {
                isAdmin && (
                  <SidebarLink to="/admin" label="Admin" icon={<MdAdminPanelSettings size={22} />} active={location.pathname === "/admin"} onClick={() => setMobileOpen(false)} />

                )
              }
            </nav>
          </div>

          <div
            className="border-t border-white/10 px-4 py-4 flex items-center justify-between flex-shrink-0 bg-[#010821] w-full"
            style={{ position: "sticky", bottom: 0, paddingBottom: "calc(env(safe-area-inset-bottom, 12px))" }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3 text-xl">
                <AiOutlineUser />
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-200">
                  {user?.nome || user?.name || "Visitante"}
                </div>
                <div className="text-xs text-gray-200">
                  {user?.email || "Faça login"}
                </div>
              </div>
            </div>

            <button onClick={() => { onLogout(); setMobileOpen(false); }} title="Sair" className="ml-2 p-2 rounded-full hover:bg-white/10 transition flex items-center">
              <AiOutlineLogout size={20} className="text-red-400" />
              <span className="ml-2 text-sm text-red-300">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};



/* ------------------------------
   App root (unchanged logic)
   ------------------------------ */
export default function App() {
  const { user, login, logout } = useAuth();
  const { isAdmin } = useContext(Context);
  const [token, setToken] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const avatarLetter = (user?.nome || user?.email || 'U').charAt(0).toUpperCase();

  const handleNotification = (data) => {
    console.log("📩 Nova notificação recebida no App:", data);
    setCurrentNotification(data);
    setShowPopup(true);
  };

  // Função para fechar o pop-up
  const closePopup = () => {
    setShowPopup(false);
    setCurrentNotification(null);
  };

  return (
    <div className="">
      <Router>
        {/* Notification Popup */}
        {showPopup && (
          <NotificationPopup
            notification={currentNotification}
            onClose={closePopup}
          />
        )}


        {/* Mobile menu button */}
        {user?.id && (
          <button
            className="fixed top-4 left-4 z-50 md:hidden bg-[#0c266d] text-[#094b69] p-2 rounded-lg shadow-lg"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <AiOutlineMenu size={28} />
          </button>
        )}

        {/* Desktop toggle button */}
        {user?.id && (
          <button
            className="fixed top-4 left-4 z-40 hidden md:flex bg-[#101a36] text-[#2788b6] p-2 rounded-lg shadow-lg"
            onClick={() => setSidebarVisible(!sidebarVisible)}
            aria-label="Alternar menu"
          >
            <AiOutlineMenu size={28} />
          </button>
        )}

        {user?.id && (
          <Sidebar
            user={user}
            onLogout={logout}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            visible={sidebarVisible}
            onNotification={handleNotification}
          />
        )}

        <div
          className={
            user?.id
              ? `min-h-screen bg-[#00071E] transition-all duration-300 flex flex-col ${sidebarVisible ? "md:pl-80 xl:pl-96" : "md:pl-0"
              }`
              : ""
          }
        >

          {user?.id && (
            <div className="flex items-center justify-end gap-4 px-6 py-4 sticky top-0 z-30 bg-[#00071E]/90 backdrop-blur border-b border-purple-500/20">
              {isAdmin && <NotificationBell />}
              <div className="w-11 h-11 rounded-full bg-gray-800 border border-purple-500/40 flex items-center justify-center text-white font-semibold uppercase">
                {avatarLetter}
              </div>
            </div>
          )}

          <div className="flex-grow">
            <Routes>
              {!user?.id ? (
                <>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login onLogin={login} />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/cadastro" element={<SignUp />} />
                  <Route path="/pagamento" element={<Plans />} />
                  <Route path="/pagamento/sucesso" element={<PaymentSucessPage />} />
                  <Route path="/pagamento/erro" element={<PaymentErroPage />} />
                  <Route path="/pagamento/pendente" element={<PaymentPendingPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                  {/* <Route exact path="/" element={<UpdatePage />} /> */}
                </>
              ) : (
                <>
                  <Route exact path="/" element={<Home />} />
                  {/* <Route path="/home" element={<LandingPage />} /> */}
                  <Route path="/calculadora/dashboard" element={<CalculadoraDashboard />} />
                  <Route path="/propostas-parcelas" element={<PropostasParcelas />} />
                  <Route path="/proposta-parcela/:id" element={<PropostaParcela />} />
                  <Route path="/checklist-dashboard" element={<ChecklistDashboard />} />
                  <Route path="/lembrete" element={<LembreteEncerramentos />} />
                  <Route path="/find-opportunities" element={<FindOpportunities />} />
                  <Route path="/parceiros" element={<Parceiros />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/notificacao" element={<Notificacao />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/manage/users" element={<UserManagement />} />
                  <Route path="/admin/users/count" element={<UsersCount />} />
                  <Route path="/admin/cupom" element={<ManageCupom />} />

                  <Route path="/calculadora/:id" element={<CalculadoraComponent />} />
                  <Route path="/checklist/:id" element={<Checklist />} />
                  <Route path="/minhas-arrematacoes" element={<MinhasArrematacoes />} />
                  <Route path="/minhas-propostas" element={<MinhasPropostas />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </div>

          {user?.id && (
            <footer className="p-4 text-center text-gray-400 border-t border-gray-700 mt-8">
              Contate-nos:{" "}
              <a href="mailto:suporte@lanceihub.com" className="text-purple-400 hover:text-purple-300 transition">
                suporte@lanceihub.com
              </a>
            </footer>
          )}
        </div>
      </Router>
    </div>
  );
}
