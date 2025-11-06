import React, { useState, useEffect } from 'react';
import SeleccionPersonaje from './components/SeleccionPersonaje';
import ArenaCombate from './components/ArenaCombate';
// 1. IMPORTAMOS DIRECTAMENTE EL JSON LOCAL (la "base de datos")
import personajesData from './data/personajesData';

// Eliminamos la constante API_URL, ya no es necesaria.

function App() {
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
    const [personajesDisponibles, setPersonajesDisponibles] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState(null);
    const [mostrarApp, setMostrarApp] = useState(false);

    useEffect(() => {
        // 2. LA "CARGA" DE DATOS ES AHORA LA ASIGNACIÓN DIRECTA DEL ARRAY JSON
        const cargarDatos = () => {
            try {
                // Asignamos los datos importados directamente
                setPersonajesDisponibles(personajesData);
                setErrorCarga(null);
            } catch (error) {
                // Este error solo ocurriría si el archivo no existe o está mal formateado
                console.error("Error al cargar datos JSON:", error);
                setErrorCarga(`Fallo al cargar datos locales: ${error.message}`);
            } finally {
                // Simulación de delay de carga para la animación
                setTimeout(() => {
                    setCargando(false);
                    setMostrarApp(true);
                }, 1500);
            }
        };
        cargarDatos();
    }, []);

    const manejarSeleccion = (personaje) => {
        setPersonajeSeleccionado(personaje);
    };

    const alFinalizarCombate = () => {
        setPersonajeSeleccionado(null);
    };

    if (cargando) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
                <img
                    src="/images/mklogo.png"
                    alt="Logo Mortal Kombat"
                    className="w-64 mb-6 animate-spin-slow object-contain"
                    style={{ aspectRatio: "1 / 1" }}
                />
                <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 animate-pulse tracking-widest seleccion">
                    Preparando el KOMBAT...
                </h1>
            </div>
        );
    }

    if (errorCarga) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">¡ERROR FATAL!</h1>
                <p className="text-xl text-yellow-400 text-center border-2 border-red-500 p-4 bg-gray-800 rounded-lg shadow-lg">
                    {errorCarga}
                </p>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen bg-gray-900 text-white p-8 transition-opacity duration-700 ${mostrarApp ? 'opacity-100' : 'opacity-0'
                }`}
            style={{
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url('https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2016/01/556580-mortal-kombat-xl-trailer-edicion-completa-mortal-kombat-x.jpg?tf=640x')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <header className="text-center mb-10 flex flex-col items-center gap-4">
                <img
                    src="/images/mklogo.png"
                    alt="Mortal Kombat Logo"
                    className="w-60 sm:w-60 md:w-64 lg:w-80 xl:w-90 mx-auto my-4"
                />
            </header>

            <main>
                {personajeSeleccionado ? (
                    <ArenaCombate
                        personajeJugador={personajeSeleccionado}
                        personajesDisponibles={personajesDisponibles}
                        alFinalizarCombate={alFinalizarCombate}
                    />
                ) : (
                    <SeleccionPersonaje
                        personajes={personajesDisponibles}
                        onSeleccionar={manejarSeleccion}
                    />
                )}
            </main>
        </div>
    );
}

export default App;