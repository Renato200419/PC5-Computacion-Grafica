// Funciones del juego extraídas del HTML principal

// Función para colocar bloques
export function placeBlock(gridPos) {
    // Verificar si hay un desafío activo con forma requerida
    if (window.isInChallenge && !window.isChallengeSolved) {
        const challenge = window.challenges[window.currentChallenge];
        if (challenge.requiredShape && window.gameState.currentShape !== challenge.requiredShape) {
            window.showNotification(`¡Debes usar ${getShapeName(challenge.requiredShape)} para este desafío!`, 'warning');
            return;
        }
    }
    
    let geometry, material;
    
    switch(window.gameState.currentShape) {
        case 'cube':
            geometry = new window.THREE.BoxGeometry(0.25, 0.25, 0.25);
            material = new window.THREE.MeshPhongMaterial({ color: 0x4CAF50 });
            break;
        case 'sphere':
            geometry = new window.THREE.SphereGeometry(0.125, 16, 16);
            material = new window.THREE.MeshPhongMaterial({ color: 0x2196F3 });
            break;
        case 'cylinder':
            geometry = new window.THREE.CylinderGeometry(0.125, 0.125, 0.25, 16);
            material = new window.THREE.MeshPhongMaterial({ color: 0xFF9800 });
            break;
        case 'pyramid':
            geometry = new window.THREE.ConeGeometry(0.125, 0.25, 4);
            material = new window.THREE.MeshPhongMaterial({ color: 0x9C27B0 });
            break;
    }
    
    const block = new window.THREE.Mesh(geometry, material);
    block.position.set(
        gridPos.x,
        0.125 + gridPos.height * 0.25,
        gridPos.z
    );
    
    // Guardar información de la posición en el grid para verificación posterior
    block.userData.gridX = gridPos.gridX;
    block.userData.gridY = gridPos.height;
    block.userData.gridZ = gridPos.gridZ;
    block.userData.shape = window.gameState.currentShape;
    
    console.log(`Bloque colocado en: worldPos(${gridPos.x.toFixed(2)}, ${gridPos.z.toFixed(2)}) -> grid(${gridPos.gridX}, ${gridPos.height}, ${gridPos.gridZ})`);
    
    // Animación de aparición
    block.scale.set(0, 0, 0);
    window.animateScale(block, { x: 1, y: 1, z: 1 }, 300);
    
    window.gameState.blockContainer.add(block);
    window.gameState.blocks.push(block);
    gridPos.height++;
    
    // Actualizar stats
    const volumes = {
        cube: 0.015625,
        sphere: 0.008181,
        cylinder: 0.012272,
        pyramid: 0.005208
    };
    window.gameState.totalVolume += volumes[window.gameState.currentShape];
    window.updateUI();
    
    // Vibración sutil
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    // Verificar si se completó el desafío
    if (window.isInChallenge && !window.isChallengeSolved) {
        window.checkChallengeCompletion();
    }
}

// Función auxiliar para obtener el nombre de la forma en español
export function getShapeName(shape) {
    const names = {
        'cube': 'cubos',
        'sphere': 'esferas',
        'cylinder': 'cilindros',
        'pyramid': 'pirámides'
    };
    return names[shape] || shape;
}

// Función para obtener emoji de cada forma
export function getShapeEmoji(shape) {
    const emojis = {
        'cube': '🟦',
        'sphere': '🔵',
        'cylinder': '🟫',
        'pyramid': '🔺'
    };
    return emojis[shape] || '?';
}

// Función para contar las formas colocadas
export function countShapes() {
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

// Función para verificar si los bloques coinciden con el patrón
export function checkPatternMatch(pattern, requiredShape = null) {
    const blocks = window.gameState.blocks;
    
    // Si no hay suficientes bloques, no puede estar completo
    if (blocks.length < pattern.length) return false;
    
    // Crear un mapa de las posiciones ocupadas
    const occupiedPositions = new Map();
    blocks.forEach(block => {
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
    return blocks.length === pattern.length && matchedCount === pattern.length;
}

// Función para completar desafío
export function completeChallenge() {
    // Marcar que el desafío fue completado
    window.isChallengeSolved = true;
    // Ya no estamos en modo desafío activo
    window.isInChallenge = false;
    
    // Calcular puntos (sin bonus de tiempo)
    const challenge = window.challenges[window.currentChallenge];
    const totalPoints = challenge.points;
    window.gameState.score += totalPoints;
    
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
    successMsg.className = 'success-message';
    successMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 30px 50px;
        font-size: 24px;
        z-index: 500;
        animation: successPulse 2s ease;
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
        ${challenge.educationalConcept ? `<div style="margin-top: 10px; font-size: 14px; opacity: 0.8;">📚 Aprendiste: ${challenge.educationalConcept}</div>` : ''}
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
    
    // Limpiar bloques fantasma del desafío
    window.gameState.challengeBlocks.forEach(ghost => {
        window.gameState.blockContainer.remove(ghost);
    });
    window.gameState.challengeBlocks = [];
    
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

// Función de animación
export function animateScale(object, target, duration) {
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

// Función para mostrar notificaciones
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Estilos según el tipo
    const baseStyle = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 30px;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: notificationPulse 0.5s ease;
        text-align: center;
        max-width: 80%;
    `;
    
    const typeClasses = {
        info: 'gradient-blue',
        success: 'gradient-success',
        warning: 'gradient-orange',
        error: 'error'
    };
    
    notification.className = `notification ${typeClasses[type] || typeClasses.info}`;
    notification.style.cssText = baseStyle;
    
    document.body.appendChild(notification);
    
    // Animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes notificationPulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.05); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Vibración según el tipo
    if (navigator.vibrate) {
        if (type === 'warning' || type === 'error') {
            navigator.vibrate([100, 50, 100]);
        } else {
            navigator.vibrate(50);
        }
    }
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 1500);
}

// Función para mostrar bloques fantasma
export function showGhostBlocks(pattern) {
    const blockContainer = window.gameState.blockContainer;
    const challengeBlocks = window.gameState.challengeBlocks;
    const gridPositions = window.gameState.gridPositions;
    
    // Limpiar bloques fantasma anteriores
    challengeBlocks.forEach(ghost => blockContainer.remove(ghost));
    challengeBlocks.length = 0;
    
    // Obtener la forma requerida para el desafío actual
    const challenge = window.challenges[window.currentChallenge];
    const requiredShape = challenge.requiredShape || 'cube';
    
    // Crear bloques fantasma semi-transparentes
    pattern.forEach(pos => {
        let geometry;
        
        // Crear geometría según la forma requerida
        switch(requiredShape) {
            case 'sphere':
                geometry = new window.THREE.SphereGeometry(0.125, 16, 16);
                break;
            case 'cylinder':
                geometry = new window.THREE.CylinderGeometry(0.125, 0.125, 0.25, 16);
                break;
            case 'pyramid':
                geometry = new window.THREE.ConeGeometry(0.125, 0.25, 4);
                break;
            default:
                geometry = new window.THREE.BoxGeometry(0.25, 0.25, 0.25);
        }
        
        const material = new window.THREE.MeshPhongMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.3,
            emissive: 0x00ff00,
            emissiveIntensity: 0.2
        });
        const ghost = new window.THREE.Mesh(geometry, material);
        
        // Encontrar la posición del grid más cercana a las coordenadas del patrón
        let closestPos = null;
        
        gridPositions.forEach(gridPos => {
            if (gridPos.gridX === pos.x && gridPos.gridZ === pos.z) {
                closestPos = gridPos;
            }
        });
        
        if (closestPos) {
            ghost.position.set(
                closestPos.x,
                0.125 + pos.y * 0.25,
                closestPos.z
            );
            blockContainer.add(ghost);
            challengeBlocks.push(ghost);
            
            console.log(`Fantasma en: grid(${pos.x}, ${pos.y}, ${pos.z}) -> pos(${closestPos.x.toFixed(2)}, ${closestPos.z.toFixed(2)})`);
        }
        
        // Animación de pulso
        const pulse = () => {
            ghost.material.opacity = 0.3 + Math.sin(Date.now() * 0.003) * 0.1;
            if (challengeBlocks.includes(ghost)) {
                requestAnimationFrame(pulse);
            }
        };
        pulse();
    });
}

// Función para aplicar zoom
export function applyZoom(delta) {
    const zoomSpeed = 0.1;
    const MIN_ZOOM = window.gameState.MIN_ZOOM;
    const MAX_ZOOM = window.gameState.MAX_ZOOM;
    window.gameState.currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, window.gameState.currentZoom + delta * zoomSpeed));
    updateZoomIndicator();
}

// Función para actualizar el indicador de zoom
export function updateZoomIndicator() {
    const percentage = Math.round(window.gameState.currentZoom * 100);
    document.getElementById('zoomLevel').textContent = percentage + '%';
}

// Exportar funciones globalmente para que estén disponibles
window.placeBlock = placeBlock;
window.getShapeName = getShapeName;
window.getShapeEmoji = getShapeEmoji;
window.countShapes = countShapes;
window.checkPatternMatch = checkPatternMatch;
window.completeChallenge = completeChallenge;
window.animateScale = animateScale;
window.showNotification = showNotification;
window.showGhostBlocks = showGhostBlocks;
window.applyZoom = applyZoom;
window.updateZoomIndicator = updateZoomIndicator;
