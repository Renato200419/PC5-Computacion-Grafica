/* =====================================================
   GEOMETRY BUILDER AR - SISTEMA DE DESAFÍOS
   Definición de desafíos educativos y su lógica
   ===================================================== */

// Definición de todos los desafíos educativos
const challenges = [
    {
        name: "Punto de Inicio",
        description: "Coloca 1 cubo en el centro del grid (0,0)",
        targetBlocks: 1,
        time: 30,
        points: 30,
        hint: "El centro es donde se cruzan las líneas principales del grid",
        educationalConcept: "Coordenadas iniciales: punto (0,0)",
        requiredShape: 'cube',
        pattern: [
            {x: 0, y: 0, z: 0}
        ]
    },
    {
        name: "Torre de Unidades",
        description: "Apila 3 cubos verticalmente (eje Y)",
        targetBlocks: 3,
        time: 60,
        points: 50,
        hint: "Coloca cada cubo encima del anterior. Y=0, Y=1, Y=2",
        educationalConcept: "Eje vertical (Y) y medida de altura",
        requiredShape: 'cube',
        pattern: [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 2, z: 0}
        ]
    },
    {
        name: "Línea Recta",
        description: "Crea una línea horizontal de 4 cubos (eje X)",
        targetBlocks: 4,
        time: 60,
        points: 60,
        hint: "Muévete solo en el eje X: X=0, X=1, X=2, X=3",
        educationalConcept: "Eje horizontal (X) y alineación",
        requiredShape: 'cube',
        pattern: [
            {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, 
            {x: 2, y: 0, z: 0}, {x: 3, y: 0, z: 0}
        ]
    },
    {
        name: "Cuadrado Completo",
        description: "Forma un cuadrado de 2x2 cubos",
        targetBlocks: 4,
        time: 90,
        points: 80,
        hint: "Un cuadrado tiene 4 lados iguales. Área = lado × lado = 2×2 = 4",
        educationalConcept: "Figuras geométricas planas: el cuadrado",
        requiredShape: 'cube',
        pattern: [
            {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0},
            {x: 0, y: 0, z: 1}, {x: 1, y: 0, z: 1}
        ]
    },
    {
        name: "Pirámide Escalonada",
        description: "Construye una pirámide: base 5x5, nivel medio 3x3, punta 1x1",
        targetBlocks: 35,
        time: 300,
        points: 200,
        hint: "Base de 25 cubos (5x5), segundo nivel 9 cubos (3x3), arriba 1 cubo",
        educationalConcept: "Pirámides escalonadas: volumen y simetría",
        requiredShape: 'cube',
        pattern: [
            // Base 5x5 (25 cubos)
            {x: -2, y: 0, z: -2}, {x: -1, y: 0, z: -2}, {x: 0, y: 0, z: -2}, {x: 1, y: 0, z: -2}, {x: 2, y: 0, z: -2},
            {x: -2, y: 0, z: -1}, {x: -1, y: 0, z: -1}, {x: 0, y: 0, z: -1}, {x: 1, y: 0, z: -1}, {x: 2, y: 0, z: -1},
            {x: -2, y: 0, z: 0}, {x: -1, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 2, y: 0, z: 0},
            {x: -2, y: 0, z: 1}, {x: -1, y: 0, z: 1}, {x: 0, y: 0, z: 1}, {x: 1, y: 0, z: 1}, {x: 2, y: 0, z: 1},
            {x: -2, y: 0, z: 2}, {x: -1, y: 0, z: 2}, {x: 0, y: 0, z: 2}, {x: 1, y: 0, z: 2}, {x: 2, y: 0, z: 2},
            // Nivel medio 3x3 (9 cubos)
            {x: -1, y: 1, z: -1}, {x: 0, y: 1, z: -1}, {x: 1, y: 1, z: -1},
            {x: -1, y: 1, z: 0}, {x: 0, y: 1, z: 0}, {x: 1, y: 1, z: 0},
            {x: -1, y: 1, z: 1}, {x: 0, y: 1, z: 1}, {x: 1, y: 1, z: 1},
            // Punta 1x1 (1 cubo)
            {x: 0, y: 2, z: 0}
        ]
    },
    {
        name: "Círculo y Esferas",
        description: "Coloca 3 esferas formando un triángulo",
        targetBlocks: 3,
        time: 90,
        points: 90,
        hint: "Las esferas no tienen vértices. Forma un triángulo equilátero",
        educationalConcept: "Formas esféricas y distribución triangular",
        requiredShape: 'sphere',
        pattern: [
            {x: 0, y: 0, z: 0},
            {x: 2, y: 0, z: 0},
            {x: 1, y: 0, z: 2}
        ]
    },
    {
        name: "Rectángulo Real",
        description: "Forma un rectángulo de 3×2 cubos",
        targetBlocks: 6,
        time: 120,
        points: 120,
        hint: "Área = largo × ancho = 3×2 = 6. Perímetro = 2×(3+2) = 10",
        educationalConcept: "Área y perímetro del rectángulo",
        requiredShape: 'cube',
        pattern: [
            {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 2, y: 0, z: 0},
            {x: 0, y: 0, z: 1}, {x: 1, y: 0, z: 1}, {x: 2, y: 0, z: 1}
        ]
    },
    {
        name: "Cilindros en Línea",
        description: "Coloca 4 cilindros en fila vertical",
        targetBlocks: 4,
        time: 90,
        points: 110,
        hint: "Los cilindros son como columnas. Radio constante en toda su altura",
        educationalConcept: "Cilindros: altura y alineación vertical",
        requiredShape: 'cylinder',
        pattern: [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 2, z: 0},
            {x: 0, y: 3, z: 0}
        ]
    },
    {
        name: "Torre de Conos",
        description: "Apila 4 conos (pirámides)",
        targetBlocks: 4,
        time: 120,
        points: 140,
        hint: "Los conos tienen base circular y punta. Centro de gravedad = 1/4 de altura",
        educationalConcept: "Equilibrio y centro de gravedad en conos",
        requiredShape: 'pyramid',
        pattern: [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 2, z: 0},
            {x: 0, y: 3, z: 0}
        ]
    },
    {
        name: "Combinación Mágica",
        description: "Usa 1 cubo, 1 esfera, 1 cilindro y 1 cono",
        targetBlocks: 4,
        time: 150,
        points: 180,
        hint: "Cada forma tiene propiedades únicas. ¡Sé creativo!",
        educationalConcept: "Creatividad geométrica con formas diversas",
        mixedShapes: true,
        requiredShapes: {
            cube: 1,
            sphere: 1,
            cylinder: 1,
            pyramid: 1
        }
    },
    {
        name: "🏡 Casa con Jardín",
        description: "Construye una casa con jardín usando TODAS las formas geométricas",
        targetBlocks: 28,
        time: 360,
        points: 400,
        hint: "Casa de cubos, columnas de cilindros, cerca de conos, esferas decorativas",
        educationalConcept: "Integración creativa de todas las formas geométricas aprendidas",
        mixedShapes: true,
        requiredShapes: {
            cube: 12,      // Casa
            cylinder: 4,   // Columnas
            pyramid: 8,    // Cerca
            sphere: 4      // Decoración
        }
    }
];

// Hacer challenges global
window.challenges = challenges;

/**
 * Inicia un nuevo desafío
 */
window.startChallenge = function() {
    console.log('startChallenge llamado');
    console.log('isARInitialized:', window.gameState.isARInitialized);
    console.log('isChallengeSolved:', window.isChallengeSolved);
    console.log('isInChallenge:', window.isInChallenge);
    console.log('currentChallenge:', window.currentChallenge);
    console.log('challenges:', window.challenges);
    
    
    // Si hay un desafío activo no resuelto, el botón funciona como "Terminar Desafío"
    if (window.isInChallenge && !window.isChallengeSolved) {
        console.log('Terminando desafío activo...');
        // Marcar como no activo
        window.isInChallenge = false;
        
        // Limpiar bloques fantasma
        window.gameState.challengeBlocks.forEach(ghost => {
            window.gameState.blockContainer.remove(ghost);
        });
        window.gameState.challengeBlocks = [];
        
        // Actualizar UI
        const challengeBtn = document.getElementById('challengeBtn');
        challengeBtn.textContent = '🏆 Iniciar Desafío';
        challengeBtn.className = 'gradient-button gradient-primary';
        document.getElementById('missionText').textContent = '🆓 Modo Libre';
        
        window.showNotification('Desafío terminado. Puedes intentarlo de nuevo.', 'info');
        return;
    }
    
    // Verificar que AR esté inicializado
    if (!window.gameState.isARInitialized) {
        console.error('AR no está inicializado aún');
        window.showNotification('Por favor, primero inicia Geometry Builder AR', 'warning');
        return;
    }
    
    // Verificar que challenges esté definido
    if (!window.challenges || window.challenges.length === 0) {
        console.error('No hay desafíos definidos');
        window.showNotification('Error: No hay desafíos disponibles', 'warning');
        return;
    }
    
    // Salir del modo sandbox si está activo
    window.exitSandboxMode();
    
    // Si completó el desafío anterior, avanzar al siguiente
    if (window.isChallengeSolved) {
        console.log('🎆 Avanzando al siguiente desafío');
        window.currentChallenge = (window.currentChallenge + 1) % window.challenges.length;
        // IMPORTANTE: Resetear el estado de completado ANTES de iniciar el nuevo desafío
        window.isChallengeSolved = false;
    }
    
    const challenge = window.challenges[window.currentChallenge];
    console.log('challenge seleccionado:', challenge);
    
    // Modo directo: iniciar el desafío sin mostrar modal
    const skipModal = true; // Cambiar a false si quieres el modal
    
    if (skipModal) {
        // Iniciar desafío directamente
        directStartChallenge();
    } else {
        // Verificar que el elemento challengeInfo existe
        const challengeInfoElement = document.getElementById('challengeInfo');
        if (!challengeInfoElement) {
            console.error('Elemento challengeInfo no encontrado');
            // Si no hay modal, iniciar directamente
            directStartChallenge();
            return;
        }
        
        // Mostrar pantalla de información del desafío
        showChallengeInfo(challenge);
    }
};

// Funciones de pausa y reanudar eliminadas - ya no son necesarias sin temporizador

/**
 * Inicia el desafío directamente sin modal
 */
function directStartChallenge() {
    const challenge = window.challenges[window.currentChallenge];
    
    // Mostrar información del desafío en notificación
    window.showNotification(`🎯 ${challenge.name}: ${challenge.description}`, 'info');
    
    // Solo llamar a closeChallengeInfo si NO hemos completado un desafío
    if (!window.isChallengeSolved) {
        window.closeChallengeInfo();
    } else {
        console.log('🛑 No llamando a closeChallengeInfo porque el desafío está completado');
    }
}

/**
 * Muestra la información del desafío en el modal
 */
function showChallengeInfo(challenge) {
    console.log('showChallengeInfo llamado con:', challenge);
    
    // Verificar que todos los elementos existen
    const elements = ['challengeTitle', 'challengeDesc', 'challengeHint', 'challengeGoal', 'challengeInfo'];
    for (const id of elements) {
        const elem = document.getElementById(id);
        if (!elem) {
            console.error(`Elemento ${id} no encontrado`);
            return;
        } else {
            console.log(`Elemento ${id} encontrado:`, elem);
        }
    }
    
    document.getElementById('challengeTitle').textContent = `🎯 ${challenge.name}`;
    document.getElementById('challengeDesc').textContent = challenge.description;
    document.getElementById('challengeHint').textContent = challenge.hint;
    
    // Limpiar concepto educativo previo si existe
    const existingConcept = document.getElementById('educationalConceptDiv');
    if (existingConcept) {
        existingConcept.remove();
    }
    
    // Mostrar concepto educativo en una línea separada
    if (challenge.educationalConcept) {
        const conceptDiv = document.createElement('p');
        conceptDiv.id = 'educationalConceptDiv';
        conceptDiv.style.cssText = 'color: #4CAF50; font-weight: bold; margin-top: 10px;';
        conceptDiv.innerHTML = `📚 <strong>Aprenderás:</strong> ${challenge.educationalConcept}`;
        document.getElementById('challengeHint').parentNode.insertBefore(conceptDiv, document.getElementById('challengeGoal'));
    }
    
    let goalText = '';
    if (challenge.targetBlocks) {
        goalText = `📦 Meta: ${challenge.targetBlocks} bloques`;
    }
    if (challenge.targetVolume) {
        goalText += goalText ? ' | ' : '';
        goalText += `📐 Volumen: ${challenge.targetVolume.toFixed(4)} cm³`;
    }
    goalText += ` | ⭐ Puntos: ${challenge.points}`;
    
    document.getElementById('challengeGoal').textContent = goalText;
    
    // Mostrar el modal con alta prioridad
    const modal = document.getElementById('challengeInfo');
    modal.style.display = 'block';
    modal.style.zIndex = '9999';
    
    // Forzar el modal al frente
    setTimeout(() => {
        modal.style.display = 'block';
        console.log('Modal challengeInfo mostrado');
        console.log('Display actual:', modal.style.display);
        console.log('Z-index actual:', modal.style.zIndex);
        console.log('Posición del modal:', modal.getBoundingClientRect());
    }, 100);
}

/**
 * Cierra el modal de información del desafío e inicia el desafío
 */
window.closeChallengeInfo = function() {
    document.getElementById('challengeInfo').style.display = 'none';
    
    // Salir del modo sandbox si está activo
    window.exitSandboxMode();
    
    // Temporalmente marcar que no estamos en desafío para poder limpiar todo
    const wasInChallenge = window.isInChallenge;
    window.isInChallenge = false;
    
    // Limpiar todo sin restricciones
    window.clearAll(true);
    
    // Ahora sí marcar que estamos en un desafío
    window.isInChallenge = true;
    
    const challenge = window.challenges[window.currentChallenge];
    
    // Actualizar el concepto educativo en el panel principal
    if (challenge.educationalConcept) {
        document.getElementById('currentConcept').textContent = `📚 ${challenge.educationalConcept}`;
    } else {
        document.getElementById('currentConcept').textContent = '';
    }
    
    // Primero, rehabilitar todos los botones por defecto
    document.querySelectorAll('.shapeBtn').forEach(btn => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    });
    
    // Mostrar el desafío al jugador
    window.showNotification(`🎯 ${challenge.name}: ${challenge.description}`, 'info');
    
    // Habilitar/deshabilitar formas según el desafío
    if (challenge.requiredShape) {
        window.selectShape(challenge.requiredShape);
        document.querySelectorAll('.shapeBtn').forEach(btn => {
            const shape = btn.dataset.shape;
            if (shape !== challenge.requiredShape && shape !== 'clear') {
                btn.style.opacity = '0.3';
                btn.style.pointerEvents = 'none';
            }
        });
    } else {
        window.selectShape('cube');
    }
    
    // Cambiar a modo colocar
    window.setControlMode('place');
    
    // Actualizar UI
    window.updateUI();
    
    // Mostrar bloques fantasma si el desafío tiene un patrón
    if (challenge.pattern) {
        window.showGhostBlocks(challenge.pattern);
    }
    
    // Mostrar que el desafío está activo sin temporizador
    if (!window.isChallengeSolved) {
        // Actualizar botón de desafío
        const challengeBtn = document.getElementById('challengeBtn');
        challengeBtn.textContent = '🏁 Terminar Desafío';
        challengeBtn.className = 'gradient-button gradient-blue';
        
    } else {
        // Si completó un desafío, el botón ya debe decir "Siguiente Desafío"
        console.log('🛑 El desafío ya está completado');
    }
};

/**
 * Verifica si se completó el desafío actual
 */
function checkChallengeCompletion() {
    // Evitar verificaciones si ya se completó el desafío
    if (window.isChallengeSolved) {
        console.log('✋ checkChallengeCompletion: Desafío ya resuelto, ignorando');
        return;
    }
    
    const challenge = challenges[window.currentChallenge];
    let completed = false;
    
    // Si el desafío requiere formas mixtas, verificar la composición
    if (challenge.mixedShapes) {
        if (challenge.requiredShapes) {
            // Verificar composición específica de formas
            const shapeCounts = window.countShapes();
            let allShapesMatch = true;
            
            for (const [shape, count] of Object.entries(challenge.requiredShapes)) {
                if (shapeCounts[shape] !== count) {
                    allShapesMatch = false;
                    break;
                }
            }
            
            if (allShapesMatch && window.gameState.blocks.length === challenge.targetBlocks) {
                completed = true;
            }
        } else if (challenge.targetBlocks) {
            // Para desafíos mixtos sin formas específicas
            if (window.gameState.blocks.length === challenge.targetBlocks) {
                completed = true;
            }
        } else if (challenge.targetVolume) {
            // Para desafíos de volumen mixto
            if (Math.abs(window.gameState.totalVolume - challenge.targetVolume) < 0.001) {
                completed = true;
            }
        }
    }
    // Si el desafío tiene un patrón específico, verificar posiciones
    else if (challenge.pattern) {
        completed = window.checkPatternMatch(challenge.pattern, challenge.requiredShape);
    }
    // Verificar por volumen exacto
    else if (challenge.targetVolume && !challenge.targetBlocks) {
        if (Math.abs(window.gameState.totalVolume - challenge.targetVolume) < 0.001) {
            completed = true;
        }
    }
    // Verificar por número de bloques
    else if (challenge.targetBlocks && window.gameState.blocks.length === challenge.targetBlocks) {
        if (!challenge.targetVolume || Math.abs(window.gameState.totalVolume - challenge.targetVolume) < 0.01) {
            completed = true;
        }
    }
    
    if (completed && !window.isChallengeSolved) {
        console.log('✅ Desafío completado! Marcando como resuelto');
        window.isChallengeSolved = true;
        window.completeChallenge();
    }
}

/**
 * Verifica si los bloques coinciden con el patrón
 */
function checkPatternMatch(pattern, requiredShape = null) {
    // Si no hay suficientes bloques, no puede estar completo
    if (window.gameState.blocks.length < pattern.length) return false;
    
    // Crear un mapa de las posiciones ocupadas
    const occupiedPositions = new Map();
    window.gameState.blocks.forEach(block => {
        const x = block.userData.gridX;
        const y = block.userData.gridY;
        const z = block.userData.gridZ;
        const key = `${x},${y},${z}`;
        occupiedPositions.set(key, block);
    });
    
    // Verificar que todas las posiciones del patrón estén ocupadas
    let matchedCount = 0;
    for (const pos of pattern) {
        const key = `${pos.x},${pos.y},${pos.z}`;
        if (occupiedPositions.has(key)) {
            const block = occupiedPositions.get(key);
            // Si hay una forma requerida, verificar que coincida
            if (requiredShape && block.userData.shape !== requiredShape) {
                continue;
            }
            matchedCount++;
            // Cambiar color del bloque para indicar que coincide
            block.material.emissive = new window.THREE.Color(0x00ff00);
            block.material.emissiveIntensity = 0.3;
        }
    }
    
    // Debug info
    console.log(`Patrón: ${matchedCount}/${pattern.length} coincidencias`);
    console.log('Posiciones esperadas:', pattern.map(p => `(${p.x},${p.y},${p.z})`).join(' '));
    console.log('Posiciones ocupadas:', Array.from(occupiedPositions.keys()));
    
    // Solo completar si coinciden EXACTAMENTE todos los bloques del patrón
    return window.gameState.blocks.length === pattern.length && matchedCount === pattern.length;
}

/**
 * Completa el desafío actual
 */
function completeChallenge() {
    console.log('🎆 Desafío completado!');
    
    // Calcular puntos (sin bonus de tiempo)
    const challenge = challenges[window.currentChallenge];
    const totalPoints = challenge.points;
    window.gameState.score += totalPoints;
    
    // IMPORTANTE: No iniciar automáticamente el siguiente desafío
    // El usuario debe presionar "Siguiente Desafío" para continuar
    
    // Efectos visuales de victoria
    window.gameState.blocks.forEach((block, index) => {
        setTimeout(() => {
            window.animateScale(block, { x: 1.2, y: 1.2, z: 1.2 }, 200);
            setTimeout(() => {
                window.animateScale(block, { x: 1, y: 1, z: 1 }, 200);
            }, 200);
        }, index * 50);
    });
    
    // Mostrar mensaje de éxito con animación especial
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #4CAF50, #45a049);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        z-index: 9999;
        animation: successPulse 0.5s ease-out;
        box-shadow: 0 10px 40px rgba(76, 175, 80, 0.5);
        text-align: center;
    `;
    
    // Mensajes motivacionales para niños
    const motivationalMessages = [
        "¡Excelente trabajo!",
        "¡Eres un genio constructor!",
        "¡Increíble!",
        "¡Sigue así!",
        "¡Fantástico!"
    ];
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    successMsg.innerHTML = `
        <div style="font-size: 28px; margin-bottom: 15px;">${randomMessage}</div>
        <div>¡DESAFÍO COMPLETADO!</div>
        <div style="margin-top: 10px; font-size: 20px;">⭐ +${totalPoints} puntos</div>
        ${challenge.educationalConcept ? `<div style="margin-top: 10px; font-size: 16px; opacity: 0.9;">📚 Aprendiste: ${challenge.educationalConcept}</div>` : ''}
    `;
    document.body.appendChild(successMsg);
    
    // Agregar animación de éxito con concepto educativo destacado
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successPulse {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
    
    // Actualizar UI
    document.getElementById('scoreCount').textContent = window.gameState.score;
    const challengeBtn = document.getElementById('challengeBtn');
    challengeBtn.textContent = '🏆 Siguiente Desafío';
    challengeBtn.className = 'gradient-button gradient-success';
    
    
    // Rehabilitar todos los botones de forma para el modo libre
    document.querySelectorAll('.shapeBtn').forEach(btn => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    });
    
    // Vibración de éxito
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
}

// Función updateTimer eliminada - ya no es necesaria sin temporizador

/**
 * Anima la escala de un objeto 3D
 */
function animateScale(object, target, duration) {
    const start = { ...object.scale };
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        object.scale.x = start.x + (target.x - start.x) * eased;
        object.scale.y = start.y + (target.y - start.y) * eased;
        object.scale.z = start.z + (target.z - start.z) * eased;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

/**
 * Cuenta las formas colocadas
 */
function countShapes() {
    const counts = {
        cube: 0,
        sphere: 0,
        cylinder: 0,
        pyramid: 0
    };
    
    window.gameState.blocks.forEach(block => {
        if (block.userData.shape) {
            counts[block.userData.shape]++;
        }
    });
    
    return counts;
}

// Exportar funciones necesarias
window.checkChallengeCompletion = checkChallengeCompletion;
window.checkPatternMatch = checkPatternMatch;
window.completeChallenge = completeChallenge;
window.animateScale = animateScale;
