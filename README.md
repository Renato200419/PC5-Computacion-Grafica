# 🎮 Geometry Builder AR - Videojuego Educativo

## 📋 Descripción
Videojuego educativo de realidad aumentada desarrollado con **THREE.js** y **MindAR** que permite a los usuarios construir estructuras 3D mientras aprenden conceptos de geometría y volumen.

## 🎯 Objetivo de Desarrollo Sostenible
**ODS 4 - Educación de Calidad**: El juego promueve el aprendizaje interactivo de conceptos matemáticos y geométricos a través de la tecnología AR.

## 🛠️ Tecnologías Utilizadas
- **THREE.js** - Motor gráfico 3D
- **MindAR** - Librería de realidad aumentada para tracking de imágenes
- **Node.js/Express** - Servidor HTTPS para desarrollo
- **JavaScript ES6** - Lenguaje de programación

## 📱 Características del Juego
- Sistema de grid 7x7 tipo Minecraft
- 4 formas geométricas diferentes (cubo, esfera, cilindro, pirámide)
- Cálculo de volumen en tiempo real
- Sistema de misiones educativas
- Apilamiento vertical de bloques (hasta 5 niveles)
- Animaciones y feedback visual
- Interfaz táctil optimizada para móviles

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js instalado
- Navegador compatible (Chrome/Safari recomendado)
- Dispositivo con cámara (preferiblemente móvil)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
```bash
git clone https://github.com/Renato200419/PC5-Computacion-Grafica.git
cd PC5-Computacion-Grafica
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor**
```bash
npm start
```

4. **Acceder al juego**
- Desde tu computadora: `https://localhost:3000`
- Desde tu móvil: `https://[TU_IP_LOCAL]:3000`

## 🎲 Cómo Jugar

### 1. Crear Target AR
- Accede a `https://hiukim-github-io.translate.goog/mind-ar-js-doc/tools/compile?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc&_x_tr_hist=true`
- Sube una foto de tu carnet o tarjeta
- Haz clic en "Comenzar"
- Espera a que se complete la compilación
- Lo descargas y lo guardas en: `static/assets/targets`

### 2. Jugar
- Accede a `https://localhost:3000/geometry-builder-fixed.html`
- Haz clic en "🎮 Iniciar Geometry Builder AR"
- Apunta la cámara a tu carnet/tarjeta
- Cuando veas "✅ Tarjeta detectada", toca la pantalla para colocar bloques
- Usa los botones inferiores para cambiar entre formas
- Intenta completar las misiones educativas

## 📁 Estructura del Proyecto
```
WebXR-demo2-main/
├── geometry-builder-fixed.html  # Juego principal
├── compile-target.html         # Herramienta para crear targets
├── index.html                  # Página de presentación
├── package.json               # Configuración npm
├── server.js                  # Servidor HTTPS
├── README.md                  # Este archivo
├── cert.pem                   # Certificado SSL (generado)
├── key.pem                    # Llave SSL (generada)
└── static/
    ├── assets/
    │   └── targets/
    │       └── card.mind      # Target AR compilado
    └── libs/
        └── mindar/            # Librerías MindAR
```

## 🎓 Valor Educativo
- **Geometría 3D**: Los estudiantes aprenden sobre diferentes formas geométricas
- **Volumen**: Cálculo en tiempo real del volumen de las estructuras
- **Pensamiento Espacial**: Desarrollo de habilidades de visualización 3D
- **Creatividad**: Libertad para construir diferentes estructuras

## ⚠️ Notas Importantes
- El juego requiere HTTPS para acceder a la cámara
- En dispositivos móviles, acepta el certificado SSL cuando se solicite
- Asegúrate de que el dispositivo esté en la misma red WiFi que el servidor
- La tarjeta/carnet debe estar bien iluminada para un tracking óptimo

## 🤝 Contribuciones
Este proyecto fue desarrollado como parte de un trabajo académico enfocado en el uso de tecnologías emergentes para la educación.

## 📄 Licencia
MIT License - Uso libre para fines educativos


