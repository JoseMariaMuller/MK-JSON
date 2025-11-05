import React, { useState, useEffect } from 'react';

function SeleccionPersonaje({ personajes, onSeleccionar }) {
    const [hovered, setHovered] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [busqueda, setBusqueda] = useState('');
    const [mostrarSelector, setMostrarSelector] = useState(false);

    useEffect(() => {
        // Delay corto para animar fade-in
        const timer = setTimeout(() => setMostrarSelector(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const personajesFiltrados = personajes.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (personajes.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-2xl text-yellow-500 mb-4">
                    Cargando luchadores desde el servidor...
                </p>
                <div className="animate-spin inline-block w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div
            className={`p-4 transition-all duration-700 transform ${
                mostrarSelector ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
        >
            <h2 className="text-4xl seleccion text-center text-yellow-400 mb-8">
                Elige a tu Campeón para el KOMBATE
            </h2>

            {/* Input de búsqueda */}
            <div className="text-center mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <input
                    type="text"
                    placeholder="Buscar personaje..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2 rounded-lg border-2 bg-black border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                />
                <button
                    onClick={() => setBusqueda('')}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 transition"
                >
                    X
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-visible">
                {personajesFiltrados.length > 0 ? (
                    personajesFiltrados.map((personaje) => (
                        <div
                            key={personaje.id}
                            onClick={() => onSeleccionar(personaje)}
                            onMouseEnter={() => setHovered(personaje.id)}
                            onMouseLeave={() => setHovered(null)}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                            }}
                            className={`relative group bg-gray-900 border-4 rounded-2xl shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 overflow-visible 
                                ${hovered === personaje.id ? 'border-red-600 animate-pulse' : 'border-red-700'}
                            `}
                            style={{
                                borderImageSlice: 1,
                                borderImageSource: hovered === personaje.id ? `conic-gradient(from 0deg at ${mousePos.x}px ${mousePos.y}px, red, orange, yellow, red)` : 'none',
                            }}
                        >
                            <div className="relative w-full overflow-visible">
                                <img
                                    src={personaje.imagen_url}
                                    alt={personaje.nombre}
                                    className="w-full h-80 object-contain mx-auto transition-transform duration-300 group-hover:-translate-y-16 hover:scale-105 z-10"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "https://placehold.co/400x300/1f2937/fff?text=NO+IMAGE";
                                    }}
                                />
                            </div>

                            <div className="bg-gradient-to-t from-red-950 to-gray-900 text-center p-4 rounded-b-2xl relative z-0">
                                <h3 className="text-3xl font-extrabold seleccion text-red-500 drop-shadow-lg mb-1 tracking-wide uppercase">
                                    {personaje.nombre}
                                </h3>
                                <div className="flex justify-center gap-6 text-gray-300 text-sm mt-3 flex-wrap">
                                    <p>
                                        🗡️ Fuerza:{" "}
                                        <span className="font-bold text-white">{personaje.fuerza}</span>
                                    </p>
                                    <p>
                                        🛡️ Defensa:{" "}
                                        <span className="font-bold text-white">{personaje.defensa}</span>
                                    </p>
                                    <p>
                                        ❤️ Salud:{" "}
                                        <span className="font-bold text-white">{personaje.salud_base}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-yellow-300 text-xl">
                        No se encontró ningún personaje
                    </p>
                )}
            </div>
        </div>
    );
}

export default SeleccionPersonaje;
