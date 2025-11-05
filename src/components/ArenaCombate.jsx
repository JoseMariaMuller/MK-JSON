import React, { useState, useEffect, useCallback } from 'react';

const seleccionarOponente = (personajes, jugadorId) => {
    const oponentesDisponibles = personajes.filter(p => p.id !== jugadorId);
    const indiceAleatorio = Math.floor(Math.random() * oponentesDisponibles.length);
    return oponentesDisponibles[indiceAleatorio];
};

const calcularDanio = (atacante, defensor, tipoAtaque = 'basico') => {
    let danioBase, mensaje;

    if (tipoAtaque === 'habilidad') {
        danioBase = atacante.habilidad_poder;
        mensaje = `${atacante.nombre} usa ${atacante.habilidad_nombre}! ¡ESPECIAL! `;
    } else {
        danioBase = Math.max(5, atacante.fuerza - defensor.defensa + Math.floor(Math.random() * 8));
        mensaje = `${atacante.nombre} ataca con un golpe básico. `;
    }

    const varianza = Math.floor(Math.random() * 17) - 8;
    let danio = danioBase + varianza;
    danio = Math.max(1, danio);

    if (Math.random() < 0.2 && tipoAtaque === 'basico') {
        danio *= 2;
        mensaje += "¡GOLPE CRÍTICO! ";
    }

    return { danio, mensaje };
};

const BarraVida = ({ saludActual, saludMax }) => {
    const porcentaje = (saludActual / saludMax) * 100;
    const colorBarra = porcentaje > 50 ? 'bg-green-500' : porcentaje > 20 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2 shadow-inner border border-gray-500">
            <div
                className={`${colorBarra} h-4 rounded-full transition-all duration-500`}
                style={{ width: `${Math.max(0, porcentaje)}%` }}
            ></div>
        </div>
    );
};

function ArenaCombate({ personajeJugador, personajesDisponibles, alFinalizarCombate }) {
    const [oponente, setOponente] = useState(null);
    const [saludJugador, setSaludJugador] = useState(personajeJugador.salud_base);
    const [saludOponente, setSaludOponente] = useState(null);
    const [turno, setTurno] = useState('JUGADOR');
    const [numeroTurno, setNumeroTurno] = useState(1);
    const [mensaje, setMensaje] = useState("Preparando combate...");
    const [ganador, setGanador] = useState(null);
    const [habilidadUsadaJugador, setHabilidadUsadaJugador] = useState(false);
    const [habilidadUsadaOponente, setHabilidadUsadaOponente] = useState(false);
    const [animacionJugador, setAnimacionJugador] = useState(false);
    const [animacionOponente, setAnimacionOponente] = useState(false);

    useEffect(() => {
        if (!oponente) {
            const pc = seleccionarOponente(personajesDisponibles, personajeJugador.id);
            setOponente(pc);
            setSaludOponente(pc.salud_base);
            setSaludJugador(personajeJugador.salud_base);
            setTurno('JUGADOR');
            setGanador(null);
            setNumeroTurno(1);
            setHabilidadUsadaJugador(false);
            setHabilidadUsadaOponente(false);
            setMensaje(`⚔️ ¡Comienza el combate contra ${pc.nombre}!`);
        }
    }, [oponente, personajesDisponibles, personajeJugador]);

    useEffect(() => {
        if (saludJugador == null || saludOponente == null) return;

        if (saludJugador <= 0 && !ganador) {
            setGanador(oponente);
            setMensaje(`💀 FATALITY: ${oponente.nombre} GANA.`);
        } else if (saludOponente <= 0 && !ganador) {
            setGanador(personajeJugador);
            setMensaje(`🏆 VICTORIA: ${personajeJugador.nombre} GANA.`);
        }
    }, [saludJugador, saludOponente, ganador, oponente, personajeJugador]);

    const manejarAtaqueJugador = () => {
        if (ganador || turno !== 'JUGADOR') return;

        const { danio, mensaje: msg } = calcularDanio(personajeJugador, oponente, 'basico');
        setTurno('ESPERA');
        setSaludOponente(prev => Math.max(0, prev - danio));
        setMensaje(`${msg} ${oponente.nombre} recibe ${danio} de daño.`);

        setTimeout(() => {
            setTurno('PC');
            setNumeroTurno(prev => prev + 1);
        }, 1000);
    };

    const manejarHabilidadJugador = () => {
        if (ganador || turno !== 'JUGADOR' || habilidadUsadaJugador) return;

        const { danio, mensaje: msg } = calcularDanio(personajeJugador, oponente, 'habilidad');
        setTurno('ESPERA');
        setSaludOponente(prev => Math.max(0, prev - danio));
        setMensaje(`${msg} ${oponente.nombre} recibe ${danio} de daño.`);
        setHabilidadUsadaJugador(true);

        // Activamos animación aura + zoom
        setAnimacionJugador(true);
        setTimeout(() => setAnimacionJugador(false), 800);

        setTimeout(() => {
            setTurno('PC');
            setNumeroTurno(prev => prev + 1);
        }, 1000);
    };

    const atacarPC = useCallback(() => {
        if (!oponente || ganador || saludJugador <= 0 || saludOponente <= 0) return;

        let usarHabilidad = false;
        const saludJugadorPorcentaje = (saludJugador / personajeJugador.salud_base) * 100;

        if (!habilidadUsadaOponente && saludJugadorPorcentaje <= 50) {
            usarHabilidad = true;
        } else if (!habilidadUsadaOponente) {
            usarHabilidad = Math.random() < 0.3;
        }

        const tipo = usarHabilidad ? 'habilidad' : 'basico';
        const { danio, mensaje: msg } = calcularDanio(oponente, personajeJugador, tipo);

        if (usarHabilidad) {
            setHabilidadUsadaOponente(true);
            setAnimacionOponente(true);
            setTimeout(() => setAnimacionOponente(false), 800);
        }

        setSaludJugador(prev => Math.max(0, prev - danio));
        setMensaje(`${msg} ${personajeJugador.nombre} recibe ${danio} de daño.`);
        setTurno('JUGADOR');
        setNumeroTurno(prev => prev + 1);
    }, [oponente, personajeJugador, ganador, habilidadUsadaOponente, saludJugador, saludOponente]);

    useEffect(() => {
        if (turno === 'PC' && !ganador && oponente && saludJugador > 0 && saludOponente > 0) {
            const timer = setTimeout(() => atacarPC(), 1000);
            return () => clearTimeout(timer);
        }
    }, [turno, ganador, oponente, saludJugador, saludOponente, atacarPC]);

    const reiniciarCombate = () => {
        setSaludJugador(personajeJugador.salud_base);
        setSaludOponente(oponente.salud_base);
        setTurno('JUGADOR');
        setNumeroTurno(1);
        setGanador(null);
        setMensaje(`🔁 ¡Revancha! ${personajeJugador.nombre} vs ${oponente.nombre}`);
        setHabilidadUsadaJugador(false);
        setHabilidadUsadaOponente(false);
    };

    if (!oponente) return <p className="text-center text-xl text-yellow-500">Cargando arena...</p>;

    return (
        <div className="max-w-4xl mx-auto border-4 border-gray-700 bg-gray-800 p-6 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-2 text-yellow-400">Turno {numeroTurno}</h2>
            <h2 className="text-4xl font-bold text-center mb-6" style={{ color: ganador ? 'lime' : 'yellow' }}>
                {ganador
                    ? ganador.nombre === personajeJugador.nombre
                        ? '¡VICTORIA!'
                        : '¡DERROTA!'
                    : 'EN COMBATE'}
            </h2>

            {/* Contenedores de personajes */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                {/* Jugador */}
                <div className="relative w-full sm:w-1/2 text-center overflow-hidden">
                    {animacionJugador && (
                        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 blur-xl animate-ping"></div>
                    )}
                    <h3 className="text-2xl font-bold text-red-500 mb-2 truncate relative z-10">
                        {personajeJugador.nombre}
                    </h3>
                    <BarraVida saludActual={saludJugador} saludMax={personajeJugador.salud_base} />
                    <div className="relative h-52 sm:h-64 flex justify-center items-center">
                        <img
                            src={personajeJugador.imagen_url}
                            alt={personajeJugador.nombre}
                            className={`absolute object-contain max-h-full transition-transform duration-500 ${animacionJugador ? 'scale-125 brightness-125 saturate-150' : 'scale-100'
                                }`}
                        />
                    </div>
                </div>

                <span className="text-4xl font-extrabold text-red-600 self-center my-2 sm:my-0">VS</span>

                {/* Oponente */}
                <div className="relative w-full sm:w-1/2 text-center overflow-hidden">
                    {animacionOponente && (
                        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 blur-xl animate-ping"></div>
                    )}
                    <h3 className="text-2xl font-bold text-blue-500 mb-2 truncate relative z-10">
                        {oponente.nombre}
                    </h3>
                    <BarraVida saludActual={saludOponente} saludMax={oponente.salud_base} />
                    <div className="relative h-52 sm:h-64 flex justify-center items-center">
                        <img
                            src={oponente.imagen_url}
                            alt={oponente.nombre}
                            className={`absolute object-contain max-h-full transition-transform duration-500 ${animacionOponente ? 'scale-125 brightness-125 saturate-150' : 'scale-100'
                                }`}
                        />
                    </div>
                </div>

            </div>

            {/* Mensaje y botones */}
            <div className="text-center">
                <p className={`text-xl font-semibold mb-4 ${ganador ? 'text-lime-400' : 'text-yellow-300'}`}>
                    {mensaje}
                </p>

                {!ganador && turno === 'JUGADOR' ? (
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={manejarAtaqueJugador}
                            className="w-full sm:w-auto px-8 py-3 text-2xl font-extrabold rounded-lg transition-all duration-200 bg-red-600 text-white shadow-lg hover:scale-105 hover:bg-red-700"
                        >
                            ¡ATACAR!
                        </button>

                        <button
                            onClick={manejarHabilidadJugador}
                            disabled={habilidadUsadaJugador}
                            className={`w-full sm:w-auto px-8 py-3 text-2xl font-extrabold rounded-lg transition-all duration-200 ${habilidadUsadaJugador
                                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                    : 'bg-yellow-500 text-gray-900 shadow-lg hover:scale-105 hover:bg-yellow-400'
                                }`}
                        >
                            {personajeJugador.habilidad_nombre.toUpperCase()} {habilidadUsadaJugador ? '(USADA)' : ''}
                        </button>

                        <button
                            onClick={() => alFinalizarCombate()}
                            className="w-full sm:w-auto px-8 py-3 text-2xl font-bold rounded-lg transition-all duration-200 bg-gray-600 text-white shadow-lg hover:bg-gray-500"
                        >
                            Salir al Menú
                        </button>
                    </div>
                ) : (
                    !ganador && <p className="text-2xl font-bold text-yellow-300">Turno de la IA...</p>
                )}

                {ganador && (
                    <div className="mt-6 space-x-4">
                        <button
                            onClick={() => alFinalizarCombate()}
                            className="px-6 py-3 text-xl bg-green-500 text-gray-900 font-bold rounded hover:bg-green-400 transition shadow-lg"
                        >
                            Volver al Menú
                        </button>
                        <button
                            onClick={reiniciarCombate}
                            className="px-6 py-3 text-xl bg-red-600 text-white font-bold rounded hover:bg-red-500 transition shadow-lg"
                        >
                            Reintentar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArenaCombate;
