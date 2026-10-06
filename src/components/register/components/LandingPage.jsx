import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Brain,
  Clock,
  Laptop,
  CheckSquare,
  Calculator,
  Trophy,
  Search,
  Bell,
  Users,
  Home,
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate('/login');
  const handleSaibaMais = () => document.getElementById('recursos')?.scrollIntoView({ behavior: 'smooth' });
  const handleEuQuero = () => navigate('/cadastro');

  const features = [
    {
      title: '+ agilidade',
      icon: <Zap className="h-10 w-10" />,
      text:
        'Afinal, com a gente, você não precisa perder tempo analisando um Leilão ou para calcular as parcelas com Correção Monetária. Nós fazemos isso por você!',
    },
    {
      title: '- estresse',
      icon: <Brain className="h-10 w-10" />,
      text:
        'Plataforma completa e com histórico de arrematações e leilões. Você entende tudo de forma clara, sem dor de cabeça!',
    },
    {
      title: '+ tempo',
      icon: <Clock className="h-10 w-10" />,
      text:
        'Todas as informações de pré e pós leilão à sua disposição. Você economiza tempo quando tudo o que precisa está em um só lugar.',
    },
  ];

  const menuItems = [
    { label: 'Home', icon: <Home size={20} />, active: true },
    { label: 'Checklists', icon: <CheckSquare size={20} /> },
    { label: 'Calculadoras', icon: <Calculator size={20} /> },
    { label: 'Arrematações', icon: <Trophy size={20} /> },
    { label: 'Encerramentos', icon: <Clock size={20} /> },
    { label: 'Oportunidades', icon: <Search size={20} /> },
    { label: 'Notificação', icon: <Bell size={20} /> },
    { label: 'Parceiros', icon: <Users size={20} /> },
  ];

  const recursos = [
    {
      title: 'Checklist:',
      text: 'Criada para que você se prepare para o Leilão e entenda se aquele imóvel é mesmo um bom Negócio.',
    },
    {
      title: 'Calculadora:',
      text: 'Simulação de gastos com as duas modalidades de pagamento, já considerando gastos com reformas, e margem de lucro.',
    },
    {
      title: 'Controle de Arrematações:',
      text: 'Tenha controle de todas as suas arrematações em um só lugar. Além disso, você tem a chance de encontrar as próximas oportunidades dentro da plataforma.',
    },
    {
      title: 'Cálculo de parcelas para proposta de compra:',
      text: 'Calcula automaticamente as datas dos próximos pagamentos e faça a atualização monetária de acordo com o índice do local arrematado.',
    },
  ];

  const plans = Array.from({ length: 4 }, (_, i) => ({ id: i + 1 }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b to-[#0f081a] text-white">
      {/* <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 80% 0%, rgba(162,0,255,0.25), transparent 40%), radial-gradient(circle at 40% 70%, rgba(0,255,255,0.18), transparent 45%), linear-gradient(135deg, #1b0c2d 0%, #140821 50%, #1a0d2b 100%)',
        }}
      /> */}

      <div
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769355/Background5_tdw6tv.png')",
          backgroundPosition: "center",        // 🔥 Centraliza
          backgroundRepeat: "no-repeat",       // Evita repetir
          backgroundSize: "cover",             // Preenche mantendo proporção
          // opacity: 0.05,
          pointerEvents: "none",
          mixBlendMode: "overlay",
          position: "absolute",
          inset: 0,
        }}
      />





      <div className="z-10">

        <header className="flex justify-center pt-5 w-[100%] m-auto items-center">
          {/* <img onClick={() => navigate('/')} className='h-[55px] w-full cursor-pointer bg-red-500' src="BarraLogo.svg" alt="" /> */}
          {/* <div
            style={{
              backgroundImage: "url('/BarraLogo.svg')",
            }}
            className="
      w-full 
      bg-no-repeat 
      bg-cover 
      bg-center
      h-14
    "
          ></div> */}
          <div className=' w-[90%] h-5 flex justify-center items-center mt-5 gap-4 max-w-6xl'>
            <div className='relative w-[90%] border-[#986ae2] border-solid border-[0.8px] h-[40px] px-10 rounded-xl flex items-center bg-gradient-to-r from-transparent to-black/35'>
              <div style={{
                backgroundImage: "url('cardboard-flat.png')",
                // opacity: 0.05,
                pointerEvents: "none",
                // mixBlendMode: "overlay",
                // position: "center",
                backgroundPosition: "center",       // ✅ centraliza horizontal e verticalmente
                backgroundRepeat: "repeat",      // ✅ evita repetição
                backgroundSize: "",
                inset: 0,
              }} className='absolute opacity-30 rounded-xl shadow-[0_14px_30px_rgba(0,0,0,0.99)]
'>
              </div>
              <img className='w-[100px] z-50' src="LogoHorizontal.png" alt="" />
              {/* z-50 para não cair granulação nessa imagem */}
            </div>



            <div onClick={() => navigate('/login')} className='relative w-[10%] border-[#986ae2] border-solid border-[0.8px] h-[40px] px-10 rounded-xl flex items-center bg-gradient-to-r from-transparent to-black/35 cursor-pointer hover:bg-purple-700 shadow-[0_14px_30px_rgba(0,0,0,0.45)]'>
              <div style={{
                backgroundImage: "url('cardboard-flat.png')",
                // opacity: 0.05,
                pointerEvents: "none",
                // mixBlendMode: "overlay",
                // position: "center",
                backgroundPosition: "center",       // ✅ centraliza horizontal e verticalmente
                backgroundRepeat: "repeat",      // ✅ evita repetição
                backgroundSize: "",
                inset: 0,
              }} className='absolute opacity-30 rounded-xl'>
              </div>
              <p className='absolute left-1/2 -translate-x-1/2 text-sm'>Login</p>
              {/* z-50 para não cair granulação nessa imagem */}
            </div>



            {/* <img className='h-[40px]' src="BotaoLogin.svg" alt="" /> */}
          </div>

        </header>

        <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-16 pt-8 md:pt-12">
          <section className="text-center p-5 md:p-10 rounded-3xl ">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
              <h1 className="text-5xl font-semibold leading-tight drop-shadow-[0_10px_35px_rgba(133,68,255,0.8)] md:text-6xl">
                LANCEI HUB
              </h1>
              <p className="text-xl font-light text-white/90 md:text-2xl mt-[-15px]">A central do arrematante</p>
              <p className="max-w-2xl text-lg text-white/90 mt-3">
                <span className="font-semibold text-white">A plataforma mais completa do <br></br> mercado.</span>
              </p>
              <p> <span className='font-bold'>Inovação, praticidade e
                segurança</span> em um só lugar!</p>
              {/* <button
                onClick={handleEuQuero}
                className="mt-4 rounded-full bg-gradient-to-r from-[#4058A4] to-[#6BC6DA] px-10 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(107,198,218,0.5)] transition-transform duration-300 ease-in-out hover:scale-105 z-50"
              >
                EU QUERO!
              </button> */}
              <img className='z-50 w-64 cursor-pointer transform transition duration-300 hover:scale-105' onClick={handleEuQuero} src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769341/Bot%C3%A3o_euquero_rpd9bb.svg" alt="Eu quero" />
            </div>
          </section>

          <section style={{
            backgroundImage: "url('https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769350/Imagem_de_fundo_mafutg.png')",
            // opacity: 0.05,
            pointerEvents: "none",
            // mixBlendMode: "overlay",
            // position: "center",
            backgroundPosition: "center",       // ✅ centraliza horizontal e verticalmente
            backgroundRepeat: "no-repeat",      // ✅ evita repetição
            backgroundSize: "cover",
            inset: 0,
          }} className="relative px-50 py-56 max-md:py-28 pb-0 !mt-[-9rem]">
            <h2 className="mb-10 text-center text-3xl md:text-4xl">O que <span className='font-bold'>você ganha</span> com a <br /><span className='font-bold'>Lancei Hub?</span> </h2>
            <div className="grid gap-10 md:grid-cols-3 w-[90%] m-auto">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(111,22,179,0.55),rgba(43,4,92,0.4))] px-8 py-7 shadow-[0_18px_50px_rgba(138,43,226,0.35)] backdrop-blur-md "
                >
                  <div className='flex items-center gap-5'>
                    <div className="mb-4 text-purple-200">{feature.icon}</div>
                    <h3 className="mb-3 text-2xl tracking-wide font-bold text-white text-glow">{feature.title}</h3>

                  </div>
                  <p className="text-md text-center leading-relaxed text-white/90">{feature.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div className="flex justify-center">
              <div className="relative max-w-xl">
                <div className="absolute -left-14 -top-10 h-32 w-32 rounded-full bg-[#922cff]/30 blur-3xl" />
                <img
                  src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769350/Notebook_gtoqwk.png"
                  alt="Notebook Lancei Hub"
                  className="relative z-50 w-full drop-shadow-[0_35px_80px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold md:text-4xl text-center">O que é a Lancei Hub?</h2>
              <p className="text-lg leading-relaxed text-white/90 text-center">
                Plataforma online e intuitiva pensada para auxiliar arrematantes e assessores em TODAS as etapas da Arrematação,
                desde um checklist aprofundado de pré-leilão até o cálculo automático de parcelas no pós-leilão.
              </p>
              {/* <button
                onClick={handleSaibaMais}
                className="rounded-full bg-gradient-to-r from-[#4058A4] to-[#6BC6DA] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_35px_rgba(0,255,255,0.35)] transition hover:scale-[1.02] !z-50"
              >
                Saiba mais!
              </button> */}
              <img className='!z-50 cursor-pointer h-12 w-full transform transition duration-300 hover:scale-105' onClick={handleSaibaMais} src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769344/Bot%C3%A3o_saibamais_fpihsa.svg" alt="Saiba mais" />
            </div>
          </section>

          <section id="recursos" className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold md:text-4xl">Confira nossos recursos!</h2>
              <div className="space-y-5">
                {recursos.map((item) => (
                  <div key={item.title} className="space-y-2">
                    <h3 className="text-xl font-extrabold">{item.title}</h3>
                    <p className="leading-relaxed text-white/85">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="self-start rounded-3xl border border-white/10 bg-black/50 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${item.active
                      ? 'bg-gradient-to-r from-[#6c2bf0] to-[#5e1ea8] text-white shadow-[0_14px_30px_rgba(108,43,240,0.35)]'
                      : 'text-white/80 hover:bg-white/5'
                      }`}
                  >
                    <span className="text-purple-200">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </nav>
            </aside>
          </section>

          <section className="space-y-10">
            <h2 className="text-center text-3xl font-semibold md:text-4xl">
              Que tal ter acesso a todos esses benefícios e muitos outros?
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 ml-[-12px]">

              {/* <div
                className="relative overflow-hidden rounded-3xl border border-[#a34bff]/40 bg-[linear-gradient(185deg,#301456,#120d30_60%)] text-center shadow-[0_0_55px_rgba(164,75,255,0.45)]"
              > */}
              {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_45%)]" /> */}
              {/* <div className="relative space-y-3 p-5"> */}
              {/* <h3 className="text-xl font-bold">Plano Mensal</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Duração de 30 dias</p>
                  <p className="text-sm text-white/80">1x de</p>
                  <p className="text-4xl font-black">R$ 79,90/mês</p>
                  <p className="text-sm text-white/80">Experimente nossos serviços</p> */}
              <div className='relative min-w-72 min-h-60'>
                <img className='absolute w-full h-full min-w-72 min-h-60' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764770919/tabela_de_pre%C3%A7o_30_dias_ia0wiq.svg" alt="" />
                <img onClick={() => navigate('/cadastro')} className='absolute bottom-7 transform transition duration-300 hover:scale-105 cursor-pointer z-50 left-1/2 -translate-x-1/2 min-w-52 max-md:w-[100px]' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769340/Bot%C3%A3o_compraragora_jx8emp.svg" alt="Comprar Agora" />
              </div>

              <div className='relative min-w-72 min-h-60'>
                <img className='absolute w-full h-full min-w-72 min-h-60' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764771692/tabela_de_pre%C3%A7o_90_dias_o991g9.svg" alt="" />
                <img onClick={() => navigate('/cadastro')} className='absolute bottom-7 min-w-52 max-md:w-[100px] transform transition duration-300 hover:scale-105 cursor-pointer z-50 left-1/2 -translate-x-1/2' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769340/Bot%C3%A3o_compraragora_jx8emp.svg" alt="Comprar Agora" />
              </div>


              <div className='relative min-w-72 min-h-60'>
                <img className='absolute w-full h-full min-w-72 min-h-60' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764771712/tabela_de_pre%C3%A7o_180_dias_ufksvd.svg" alt="" />
                <img onClick={() => navigate('/cadastro')} className='absolute bottom-7 min-w-52 max-md:w-[100px] transform transition duration-300 hover:scale-105 cursor-pointer z-50 left-1/2 -translate-x-1/2' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769340/Bot%C3%A3o_compraragora_jx8emp.svg" alt="Comprar Agora" />
              </div>

              <div className='relative min-w-72 min-h-60'>
                <img className='absolute w-full h-full min-w-72 min-h-60' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764771737/tabela_de_pre%C3%A7o_365_dias_pq9ck5.svg" alt="" />
                <img onClick={() => navigate('/cadastro')} className='absolute bottom-7 min-w-52 max-md:w-[100px] transform transition duration-300 hover:scale-105 cursor-pointer z-50 left-1/2 -translate-x-1/2' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769340/Bot%C3%A3o_compraragora_jx8emp.svg" alt="Comprar Agora" />
              </div>
              {/* </div> */}
              {/* </div> */}
              {/* 
              <div
                className="relative overflow-hidden rounded-3xl border border-[#a34bff]/40 bg-[linear-gradient(185deg,#301456,#120d30_60%)] text-center shadow-[0_0_55px_rgba(164,75,255,0.45)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_45%)]" />
                <div className="relative space-y-3 p-5">
                  <h3 className="text-xl font-bold">Plano Trimestral</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Duração de 90 dias</p>
                  <p className="text-sm text-white/80">3x de</p>
                  <p className="text-4xl font-black">R$ 69,90/mês</p>
                  <p className="text-sm text-white/80">Ideal para projetos curtos</p>
                  <img onClick={() => navigate('/cadastro')} className='transform transition duration-300 hover:scale-105 cursor-pointer z-50' src="/Botaocompraragora.svg" alt="Comprar Agora" />
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-3xl border border-[#a34bff]/40 bg-[linear-gradient(185deg,#301456,#120d30_60%)] text-center shadow-[0_0_55px_rgba(164,75,255,0.45)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_45%)]" />
                <div className="relative space-y-3 p-5">
                  <h3 className="text-xl font-bold">Plano Semestre</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Duração de 180 dias</p>
                  <p className="text-sm text-white/80">6x de</p>
                  <p className="text-4xl font-black">R$ 59,90/mês</p>
                  <p className="text-sm text-white/80">Ideal para projetos médios</p>
                  <img onClick={() => navigate('/cadastro')} className='transform transition duration-300 hover:scale-105 cursor-pointer z-50' src="/Botaocompraragora.svg" alt="Comprar Agora" />
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-3xl border border-[#a34bff]/40 bg-[linear-gradient(185deg,#301456,#120d30_60%)] text-center shadow-[0_0_55px_rgba(164,75,255,0.45)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_45%)]" />
                <div className="relative space-y-3 p-5">
                  <h3 className="text-xl font-bold">Plano Anual</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Duração de 365 dias</p>
                  <p className="text-sm text-white/80">12x de</p>
                  <p className="text-4xl font-black">R$ 49,90/mês</p>
                  <p className="text-sm text-white/80">Melhor custo-benefício</p>
                  <img onClick={() => navigate('/cadastro')} className='transform transition duration-300 hover:scale-105 cursor-pointer z-50' src="/Botaocompraragora.svg" alt="Comprar Agora" />
                </div>
              </div> */}

            </div>
          </section>
        </main>

        <footer className="mt-10 bg-[#0e061a] px-6 py-10 shadow-[0_-10px_40px_rgba(0,0,0,0.45)]">
          <div className="mx-auto flex max-w-6xl gap-8  md:items-center md:justify-between max-md:items-center max-md:flex-wrap max-md:!flex-col  max-md:w-[100%] max-md:m-auto max-md:gap-10 max-md:p-2 max-md:justify-between">
            <div className="flex flex-col gap-2 text-sm text-white/80 max-md:order-4">
              <img src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769346/Logo_branca_evizmy.svg" alt="Lancei Hub" className="w-40 mb-2" />
              <p>© 2025 Lancei Hub — CNPJ.</p>
              <p>Todos os direitos reservados.</p>
            </div>

            <div className="flex flex-col items-start gap-3 text-xs font-semibold uppercase tracking-wide text-white/80 max-md:m-[10px] max-md:order-3 max-md:text-sm" >
              <span className='hover:text-white'>Sobre a Lancei Hub</span>
              <a href='LanceihubTermos_de_Uso.pdf' target='_blank' className='hover:text-white'>Termos de Uso</a>
              {/* <span className='hover:text-white'>Política de Privacidade</span> */}
              <a href='https://www.instagram.com/lanceihub/' target='_blank' className='hover:text-white'>Nos siga no instagram</a>
            </div>

            <div className='flex flex-col gap-5 max-md:order-2'>
              <img className='z-50 w-44 cursor-pointer transform transition duration-300 hover:scale-110' onClick={() => navigate('/login')} src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769343/Bot%C3%A3o_j%C3%A1soumembro_nl3hce.svg" alt="Já sou membro!" />
              <a href={`https://wa.me/5511922229611?text=${encodeURIComponent("Olá! Gostaria de mais informações sobre a plataforma Lancei Hub.")}`}
                target="_blank" rel="noopener noreferrer">
                <img className='z-50 w-44 cursor-pointer transform transition duration-300 hover:scale-110' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769340/Bot%C3%A3o_Contato_rhybzm.svg" alt="Contato" />
              </a>
            </div>

            <div className="flex flex-wrap gap-3 max-md:order-1">

              <div className='flex justify-center flex-col items-center text-center gap-4 '>
                <p className='text-sm max-w-[250px]'>Faça parte da plataforma <span className='font-bold'>mais completa do mercado!</span></p>
                {/* <button
                  onClick={handleEuQuero}
                  className="rounded-full bg-gradient-to-r from-[#431B6C] to-[#1A0D2B] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-[0_12px_45px_rgba(200,0,255,0.55)]
 w-[70%] border-solid border-[] z-50"
                >
                  Eu quero!
                </button> */}

                <img onClick={() => navigate('/cadastro')} className='z-50 w-64 hover:shadow-[0_12px_45px_rgba(200,0,255,0.55)] cursor-pointer' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769341/Bot%C3%A3o_euquero2_rodap%C3%A9_cq0rme.svg" alt="Botao eu quero 2" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;