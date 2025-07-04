# 🎮 Geometry Builder AR

**Videojuego educativo de realidad aumentada para enseñar geometría y volumen a estudiantes de 9-12 años**

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.ecma-international.org/ecma-262/)
[![THREE.js](https://img.shields.io/badge/THREE.js-r153-green.svg)](https://threejs.org/)
[![MindAR](https://img.shields.io/badge/MindAR-1.2.5-blue.svg)](https://hiukim.github.io/mind-ar-js-doc/)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)

## 📖 Descripción

Geometry Builder AR es un videojuego educativo innovador que utiliza realidad aumentada para enseñar conceptos de geometría 3D y cálculo de volumen. Los estudiantes pueden construir estructuras tridimensionales colocando diferentes formas geométricas en un grid interactivo que aparece sobre una tarjeta física mediante tecnología AR.

### 🎯 Alineado con ODS 4 - Educación de Calidad
Este proyecto contribuye al Objetivo de Desarrollo Sostenible 4 de las Naciones Unidas, promoviendo una educación STEM inclusiva y de calidad a través de tecnología accesible.

## ✨ Características Principales

### 🎲 Gameplay
- **Grid interactivo 11x11** estilo Minecraft para construcción 3D
- **4 formas geométricas**: Cubo, Esfera, Cilindro y Pirámide
- **Apilamiento vertical** hasta 5 bloques de altura
- **Cálculo de volumen** en tiempo real con precisión matemática

### 🏆 Sistema de Desafíos Educativos
- **11 desafíos progresivos** que enseñan diferentes conceptos:
  - Formas básicas y sus propiedades
  - Patrones y estructuras
  - Área y perímetro
  - Volumen y geometría espacial
  - Creatividad con formas mixtas
- **Sistema de puntuación** para motivar el aprendizaje
- **Modo Libre (Sandbox)** para construcción creativa sin restricciones

### 🎮 Controles Intuitivos
- **4 modos de interacción**:
  - 🔄 **Rotación**: Arrastra para rotar la vista
  - 🔍 **Zoom**: Pellizca o usa botones +/-
  - ✋ **Colocar**: Toca para agregar bloques
  - ❌ **Eliminar**: Toca bloques para quitarlos

### 📱 Optimizado para Móviles
- Interface compacta y responsive
- Controles táctiles naturales
- Rendimiento optimizado para dispositivos móviles
- Compatible con tablets y smartphones

## 🛠️ Tecnologías Utilizadas

- **[THREE.js](https://threejs.org/)** - Motor de gráficos 3D WebGL
- **[MindAR](https://hiukim.github.io/mind-ar-js-doc/)** - Framework AR basado en web
- **JavaScript ES6+** - Módulos nativos para mejor organización
- **HTML5/CSS3** - Interface moderna y responsive
- **Node.js/Express** - Servidor HTTPS para desarrollo

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 14+ instalado
- Navegador moderno con soporte WebRTC (Chrome/Safari recomendado)
- Dispositivo con cámara
- Impresora para la tarjeta de tracking

### Pasos de Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/tu-usuario/PC5-Computacion-Grafica.git
cd PC5-Computacion-Grafica
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Genera certificados SSL** (necesario para HTTPS)
```bash
# Los certificados ya están incluidos, pero puedes regenerarlos si es necesario
# usando openssl o una herramienta similar
```

4. **Inicia el servidor de desarrollo**
```bash
npm start
```

5. **Abre la aplicación**
   - Navegador: `https://localhost:3000`
   - Móvil: `https://[tu-ip-local]:3000`

### 🎯 Cómo Jugar

1. Crear Target AR
   - Accede a `https://hiukim-github-io.translate.goog/mind-ar-js-doc/tools/compile?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc&_x_tr_hist=true`
   - Sube una foto de tu carnet o tarjeta
   - Haz clic en "Comenzar"
   - Espera a que se complete la compilación
   - Lo descargas y lo guardas en: `static/assets/targets`

2. **Inicia el juego**
   - Abre la página principal en tu navegador
   - Haz clic en "Empezar a Jugar"
   - En la siguiente página, haz clic en "🎮 Iniciar Geometry Builder AR"
   - Permite el acceso a la cámara cuando se solicite

3. **Detecta la tarjeta**
   - Apunta la cámara a la tarjeta impresa
   - Espera a que aparezca "✅ Tarjeta detectada"

4. **¡Construye y aprende!**
   - Selecciona formas con los botones inferiores
   - Cambia entre modos usando los botones de la derecha
   - Toca el grid verde para colocar bloques
   - Completa desafíos para ganar puntos

## 📁 Estructura del Proyecto

```
PC5-Computacion-Grafica/
├── 📄 index.html                 # Página de inicio
├── 📄 geometry-builder.html      # Aplicación AR principal
├── 📄 app.js                     # Módulo principal de inicialización
├── 📁 js/                        # Módulos JavaScript
│   ├── 📄 challenges.js          # Sistema de desafíos
│   ├── 📄 game-functions.js      # Lógica del juego
│   ├── 📄 touch-controls.js      # Controles táctiles
│   └── 📄 ui-controls.js         # Interfaz de usuario
├── 📁 styles/                    # Estilos CSS
│   └── 📄 geometry-builder.css   # Estilos principales
├── 📁 static/                    # Assets estáticos
│   └── 📁 assets/
│       └── 📁 targets/           # Imágenes de tracking AR
├── 📄 server.js                  # Servidor HTTPS Express
├── 📄 package.json               # Configuración npm
└── 📄 README.md                  # Este archivo
```

## 🎓 Conceptos Educativos

El juego enseña los siguientes conceptos geométricos:

1. **Identificación de formas 3D** y sus propiedades
2. **Volumen de sólidos** (cubo, esfera, cilindro, cono)
3. **Patrones espaciales** y pensamiento lógico
4. **Área y perímetro** en contexto 3D
5. **Composición y descomposición** de estructuras
6. **Creatividad matemática** y resolución de problemas

### 📊 Fórmulas de Volumen Utilizadas
- **Cubo**: V = lado³ = 0.25³ = 0.015625 cm³
- **Esfera**: V = (4/3)πr³ = (4/3)π(0.125)³ = 0.008181 cm³
- **Cilindro**: V = πr²h = π(0.125)²(0.25) = 0.012272 cm³
- **Pirámide**: V = (1/3)base×altura = (1/3)π(0.125)²(0.25) = 0.005208 cm³

## 🤝 Contribuciones

Este proyecto fue desarrollado como parte de un trabajo académico enfocado en el uso de tecnologías emergentes para la educación.

## 📜 Licencia

MIT License - Uso libre para fines educativos