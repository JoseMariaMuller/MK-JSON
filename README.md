# ⚔️ Mortal Kombat Combat Simulator (React/Vite)

> Proyecto Full-Frontend que simula un combate por turnos al estilo Mortal Kombat, implementado completamente con React y datos locales (JSON estático). Desplegado gratuitamente en Netlify.

## 🔗 Demo en Vivo

**[¡Jugar al Simulador de Kombat!](https://mortalkombatreact.netlify.app/)**

---

## ✨ Características Destacadas

Este proyecto no solo es un juego básico de turnos, sino que resuelve desafíos de lógica y arquitectura:

* **Arquitectura Full-Frontend (JSON):** Elimina la dependencia de un backend de Express y una base de datos externa (como MySQL o Firebase) al integrar los datos de los **21 personajes** directamente en el frontend. Esto permite un **despliegue gratuito y escalable** en servicios de hosting estático.
* **Lógica de Desesperación de la IA:** Implementa una lógica de inteligencia artificial estratégica. El oponente (PC) tiene un **"golpe de acabado" garantizado** (su habilidad especial) que se activa con **100% de probabilidad** si la salud del jugador cae por debajo del 50%. Esto fuerza momentos críticos y permite la derrota.
* **Sistema de Daño Variado:** El cálculo de daño incluye factor de **varianza (`Math.random`)** y probabilidad de **Golpe Crítico (20%)** para asegurar que ningún golpe sea idéntico y que el combate sea impredecible.
* **Flujo de Turnos Estable:** Uso de `useEffect` y `useState` para gestionar el estado de los turnos de manera asíncrona y establecer una pausa de 1.2 segundos para simular el turno de la IA.

## ⚙️ Tecnologías Utilizadas

* **Frontend Framework:** [React (Vite)](https://reactjs.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (Para un diseño rápido y responsivo al estilo MK)
* **Despliegue:** [Netlify](https://www.netlify.com/) (Hosting estático)
* **Datos:** JavaScript Object Notation (JSON) local.

## 🚀 Instalación y Ejecución Local

Para probar el proyecto en tu máquina:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/JoseMariaMuller/MK-JSON.git
    cd mortal-kombat-react
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar el proyecto en modo desarrollo:**
    ```bash
    npm run dev
    ```
    El simulador estará disponible en `http://localhost:5173`.

## 📦 Estructura del Proyecto

Los componentes clave para la lógica de combate se encuentran en:

* `src/data/personajesData.js`: Contiene las estadísticas de los 21 luchadores.
* `src/components/ArenaCombate.jsx`: Contiene toda la lógica del juego (cálculo de daño, flujo de turnos y la lógica de desesperación de la IA).
