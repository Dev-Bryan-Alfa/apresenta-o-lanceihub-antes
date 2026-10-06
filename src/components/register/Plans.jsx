// import { useContext, useEffect, useState } from "react";
// import SubscribeButton from "./components/SubscribeButton";
// import CupomModal from "./components/CupomModal";
// import Context from "../../context/Context";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function Plans() {
//     const [showModal, setShowModal] = useState()
//     const { usuarioCadastroId, setUsuarioCadastroId } = useContext(Context)
//     const base = process.env.REACT_APP_API_URL

//     const [usuarioSalvo, setUsuarioSalvo] = useState(null)
//     const nav = useNavigate()

//     const getUserWithPayment = async () => {
//         if (!usuarioCadastroId) {
//             nav('/')
//             return
//         }
//         const dataAtual = new Date()
//         const { data } = await axios.get(base + '/user/' + usuarioCadastroId)
//         console.log(data)
//         setUsuarioSalvo(data)
//         if (data.payment) {
//             // console.log(new Date(data.payment.expiresIn), ' expires In')
//             if (data.payment.status == 'active' && (new Date(data.payment.expiresIn) > dataAtual)) {
//                 nav('/pagamento/sucesso')
//                 setUsuarioCadastroId(null)
//             } else {
//                 alert('Pagamento Pendente')
//             }
//         }
//     }

//     useEffect(() => {
//         getUserWithPayment()
//     }, [])

//     return (
//         <div className="relative min-h-screen overflow-hidden text-white">

//             <div
//                 style={{
//                     backgroundImage: "url('https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769355/Background5_tdw6tv.png')",
//                     backgroundPosition: "center",        // 🔥 Centraliza
//                     backgroundRepeat: "no-repeat",       // Evita repetir
//                     backgroundSize: "cover",             // Preenche mantendo proporção
//                     // opacity: 0.05,
//                     pointerEvents: "none",
//                     mixBlendMode: "overlay",
//                     position: "absolute",
//                     inset: 0,
//                 }}
//             />
//             {/* Background Effects */}
//             {/* <div className="absolute inset-0">
//                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5524E8]/10 rounded-full blur-3xl animate-pulse"></div>
//                 <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2143BE]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#42ACF0]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
//             </div> */}

//             {showModal && (
//                 <CupomModal open={setShowModal} />
//             )}

//             <button onClick={() => {
//                 localStorage.clear()
//                 window.location.reload()
//             }} className="m-5 p-5 hover:underline">Voltar Para Home</button>

//             <div className="max-w-7xl w-full relative z-10 py-12">
//                 {/* Header Section */}
//                 <div className="text-center mb-16 relative">

//                     <h1 className="text-5xl lg:text-6xl font-bold font-montserrat text-transparent bg-gradient-to-r text-white bg-clip-text mb-6 tracking-tight">
//                         Escolha Seu Plano
//                     </h1>
//                     <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
//                         Selecione o plano ideal para você e comece sua jornada conosco hoje mesmo!
//                     </p>
//                 </div>

//                 {/* Plans Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 p-10">
//                     {/* 1 Month Plan */}
//                     {/* <div className="group relative">
//                         <div className="absolute -inset-1 bg-gradient-to-r from-[#5524E8] to-[#2143BE] rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
//                         <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
//                             <div className="text-center">
//                                 <div className="w-16 h-16 bg-gradient-to-br from-[#5524E8] to-[#2143BE] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
//                                     <span className="text-2xl font-bold">1</span>
//                                 </div>
//                                 <h3 className="text-2xl font-bold mb-2 font-montserrat">Plano Mensal</h3>
//                                 <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#42ACF0] to-[#5524E8] bg-clip-text mb-4">R$79,90</div>
//                                 <p className="text-gray-400 text-sm mb-6">Experimente nossos serviços</p>
//                                 <div className="transform hover:scale-105 transition-transform duration-300">
//                                     <SubscribeButton userId={usuarioCadastroId} planMap={'1month'} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div> */}

//                     {/* 3 Month Plan */}

//                     <div
//                         className="relative overflow-hidden rounded-3xl border border-[#a34bff]/40 bg-[linear-gradient(185deg,#301456,#120d30_60%)] text-center shadow-[0_0_55px_rgba(164,75,255,0.45)]"
//                     >
//                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_45%)]" />
//                         <div className="relative space-y-3 p-5">
//                             <h3 className="text-xl font-bold">Plano Mensal</h3>
//                             <p className="text-xs uppercase tracking-[0.2em] text-white/70">Duração de 30 dias</p>
//                             <p className="text-sm text-white/80">1x de</p>
//                             <p className="text-4xl font-black">R$ 79,90/mês</p>
//                             <p className="text-sm text-white/80">Experimente nossos serviços</p>
//                             <SubscribeButton userId={usuarioCadastroId} planMap={'1month'} />

//                         </div>
//                     </div>

//                     <div
//                         className="relative overflow-hidden rounded-3xl border border-[#a34bff]/40 bg-[linear-gradient(185deg,#301456,#120d30_60%)] text-center shadow-[0_0_55px_rgba(164,75,255,0.45)]"
//                     >
//                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_45%)]" />
//                         <div className="relative space-y-3 p-5">
//                             <h3 className="text-xl font-bold">Plano Trimestral</h3>
//                             <p className="text-xs uppercase tracking-[0.2em] text-white/70">Duração de 90 dias</p>
//                             <p className="text-sm text-white/80">3x de</p>
//                             <p className="text-4xl font-black">R$ 69,90/mês</p>
//                             <p className="text-sm text-white/80">Ideal para projetos curtos</p>
//                             <SubscribeButton userId={usuarioCadastroId} planMap={'3month'} />
//                         </div>
//                     </div>

//                     <div
//                         className="relative overflow-hidden rounded-3xl border border-[#a34bff]/40 bg-[linear-gradient(185deg,#301456,#120d30_60%)] text-center shadow-[0_0_55px_rgba(164,75,255,0.45)]"
//                     >
//                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_45%)]" />
//                         <div className="relative space-y-3 p-5">
//                             <h3 className="text-xl font-bold">Plano Semestre</h3>
//                             <p className="text-xs uppercase tracking-[0.2em] text-white/70">Duração de 180 dias</p>
//                             <p className="text-sm text-white/80">6x de</p>
//                             <p className="text-4xl font-black">R$ 59,90/mês</p>
//                             <p className="text-sm text-white/80">Ideal para projetos médios</p>
//                             <SubscribeButton userId={usuarioCadastroId} planMap={'6month'} />
//                         </div>
//                     </div>

//                     <div
//                         className="relative overflow-hidden rounded-3xl border border-[#a34bff]/40 bg-[linear-gradient(185deg,#301456,#120d30_60%)] text-center shadow-[0_0_55px_rgba(164,75,255,0.45)]"
//                     >
//                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_45%)]" />
//                         <div className="relative space-y-3 p-5">
//                             <h3 className="text-xl font-bold">Plano Anual</h3>
//                             <p className="text-xs uppercase tracking-[0.2em] text-white/70">Duração de 365 dias</p>
//                             <p className="text-sm text-white/80">12x de</p>
//                             <p className="text-4xl font-black">R$ 49,90/mês</p>
//                             <p className="text-sm text-white/80">Melhor custo-benefício</p>
//                             <SubscribeButton userId={usuarioCadastroId} planMap={'12month'} />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
//                     <button
//                         className="group relative px-8 py-4 bg-gradient-to-r from-[#0d6bc4] to-[#60baf1] hover:from-[#6024AF] hover:to-[#190B70] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
//                         onClick={() => setShowModal(true)}
//                     >
//                         <span className="flex items-center space-x-2">
//                             <span>🎫</span>
//                             <span>Tenho Cupom</span>
//                         </span>
//                     </button>

//                     <button
//                         className="group relative px-8 py-4 bg-gradient-to-r from-[#0d6bc4] to-[#60baf1] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:from-[#6024AF] hover:to-[#190B70]"
//                         onClick={() => window.location.reload()}
//                     >
//                         <span className="flex items-center space-x-2">
//                             <span>✅</span>
//                             <span>Já Paguei!</span>
//                         </span>
//                     </button>
//                 </div>

//                 {/* Decorative Elements */}
//                 {/* <div className="absolute top-20 right-20 w-24 h-24 border border-[#5524E8]/30 rounded-full animate-spin-slow"></div>
//                 <div className="absolute bottom-20 left-20 w-20 h-20 bg-[#42ACF0]/20 rounded-lg rotate-45 animate-pulse"></div> */}
//             </div>
//         </div>
//     );
// }

// export default Plans;






































import { useContext, useEffect, useState } from "react";
import SubscribeButton from "./components/SubscribeButton";
import CupomModal from "./components/CupomModal";
import Context from "../../context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Plans() {
    const [showModal, setShowModal] = useState()
    const { usuarioCadastroId, setUsuarioCadastroId } = useContext(Context)
    const base = process.env.REACT_APP_API_URL

    const [usuarioSalvo, setUsuarioSalvo] = useState(null)
    const nav = useNavigate()

    const getUserWithPayment = async () => {
        if (!usuarioCadastroId) {
            nav('/')
            return
        }
        const dataAtual = new Date()
        const { data } = await axios.get(base + '/user/' + usuarioCadastroId)
        console.log(data)
        setUsuarioSalvo(data)
        if (data.payment) {
            // console.log(new Date(data.payment.expiresIn), ' expires In')
            if (data.payment.status == 'active' && (new Date(data.payment.expiresIn) > dataAtual)) {
                nav('/pagamento/sucesso')
                setUsuarioCadastroId(null)
            } else {
                alert('Pagamento Pendente')
            }
        }
    }

    useEffect(() => {
        getUserWithPayment()
    }, [])

    return (
        <div className="relative min-h-screen overflow-hidden text-white flex flex-col justify-center items-center">

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
            {/* Background Effects */}
            {/* <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5524E8]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2143BE]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#42ACF0]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div> */}

            {showModal && (
                <CupomModal open={setShowModal} />
            )}

            <button onClick={() => {
                localStorage.removeItem('userCadastradoId')
                nav('/')
                window.location.reload()
            }} className="m-10 p-5 max-md:m-2 max-md:pt-2 hover:underline max-md:!text-center">Voltar Para Home</button>

            <div className="max-w-7xl w-full relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16 relative mt-10">

                    <h1 className="text-5xl lg:text-6xl font-bold font-montserrat text-transparent bg-gradient-to-r text-white bg-clip-text mb-6 tracking-tight">
                        Escolha Seu Plano
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Selecione o plano ideal para você e comece sua jornada conosco hoje mesmo!
                    </p>
                </div>

                {/* Plans Grid */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 p-10">
                    <div
                        className="relative overflow-hidden rounded-3xl border border-[#a34bff]/40 bg-[linear-gradient(185deg,#301456,#120d30_60%)] text-center shadow-[0_0_55px_rgba(164,75,255,0.45)]"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_45%)]" />
                        <div className="relative space-y-3 p-5">
                            <h3 className="text-xl font-bold">Plano Mensal</h3>
                            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Duração de 30 dias</p>
                            <p className="text-sm text-white/80">1x de</p>
                            <p className="text-4xl font-black">R$ 79,90/mês</p>
                            <p className="text-sm text-white/80">Experimente nossos serviços</p>
                            <SubscribeButton userId={usuarioCadastroId} planMap={'1month'} />

                        </div>
                    </div>

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
                            <SubscribeButton userId={usuarioCadastroId} planMap={'3month'} />
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
                            <SubscribeButton userId={usuarioCadastroId} planMap={'6month'} />
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
                            <SubscribeButton userId={usuarioCadastroId} planMap={'12month'} />
                        </div>
                    </div>
                </div> */}


                <div className="flex mb-20 max-w-[100%] justify-center flex-wrap gap-10 m-auto">
                    <div className='relative min-w-72 min-h-60'>
                        <img className='absolute w-full h-full min-w-72 min-h-60' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764770919/tabela_de_pre%C3%A7o_30_dias_ia0wiq.svg" alt="" />
                        <SubscribeButton userId={usuarioCadastroId} planMap={'1month'} />
                    </div>

                    <div className='relative min-w-72 min-h-60'>
                        <img className='absolute w-full h-full min-w-72 min-h-60' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764771692/tabela_de_pre%C3%A7o_90_dias_o991g9.svg" alt="" />
                        {/* <img onClick={() => nav('/cadastro')} className='absolute bottom-7 min-w-52 max-md:w-[100px] transform transition duration-300 hover:scale-105 cursor-pointer z-50 left-1/2 -translate-x-1/2' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769340/Bot%C3%A3o_compraragora_jx8emp.svg" alt="Comprar Agora" /> */}
                        <SubscribeButton userId={usuarioCadastroId} planMap={'3month'} />
                    </div>


                    <div className='relative min-w-72 min-h-60'>
                        <img className='absolute w-full h-full min-w-72 min-h-60' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764771712/tabela_de_pre%C3%A7o_180_dias_ufksvd.svg" alt="" />
                        {/* <img onClick={() => nav('/cadastro')} className='absolute bottom-7 min-w-52 max-md:w-[100px] transform transition duration-300 hover:scale-105 cursor-pointer z-50 left-1/2 -translate-x-1/2' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769340/Bot%C3%A3o_compraragora_jx8emp.svg" alt="Comprar Agora" /> */}
                        <SubscribeButton userId={usuarioCadastroId} planMap={'6month'} />

                    </div>

                    <div className='relative min-w-72 min-h-60'>
                        <img className='absolute w-full h-full min-w-72 min-h-60' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764771737/tabela_de_pre%C3%A7o_365_dias_pq9ck5.svg" alt="" />
                        {/* <img onClick={() => nav('/cadastro')} className='absolute bottom-7 min-w-52 max-md:w-[100px] transform transition duration-300 hover:scale-105 cursor-pointer z-50 left-1/2 -translate-x-1/2' src="https://res.cloudinary.com/dgsfhenzu/image/upload/v1764769340/Bot%C3%A3o_compraragora_jx8emp.svg" alt="Comprar Agora" /> */}
                        <SubscribeButton userId={usuarioCadastroId} planMap={'12month'} />
                    </div>

                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
                    <button
                        className="group relative px-8 py-4 bg-gradient-to-r from-[#0d6bc4] to-[#60baf1] hover:from-[#6024AF] hover:to-[#190B70] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                        onClick={() => setShowModal(true)}
                    >
                        <span className="flex items-center space-x-2">
                            <span>🎫</span>
                            <span>Tenho Cupom</span>
                        </span>
                    </button>

                    <button
                        className="group relative px-8 py-4 bg-gradient-to-r from-[#0d6bc4] to-[#60baf1] text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:from-[#6024AF] hover:to-[#190B70]"
                        onClick={() => window.location.reload()}
                    >
                        <span className="flex items-center space-x-2">
                            <span>✅</span>
                            <span>Já Paguei!</span>
                        </span>
                    </button>
                </div>

                {/* Decorative Elements */}
                {/* <div className="absolute top-20 right-20 w-24 h-24 border border-[#5524E8]/30 rounded-full animate-spin-slow"></div>
                <div className="absolute bottom-20 left-20 w-20 h-20 bg-[#42ACF0]/20 rounded-lg rotate-45 animate-pulse"></div> */}
            </div>
        </div>
    );
}

export default Plans;
