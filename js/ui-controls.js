/* =====================================================
   GEOMETRY BUILDER AR - CONTROLES DE INTERFAZ
   Funciones de UI, notificaciones y controles
   ===================================================== */

// Sistema mejorado de notificaciones que no se superponen
let notificationQueue = [];
let currentNotificationIndex = 0;

/**
 * Muestra una notificación en pantalla
 * @param {string} text - Texto de la notificación
 * @param {string} type - Tipo de notificación: 'success', 'warning', 'info'
 */
window.showNotification = function showNotification(text, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Colores según tipo
    if (type === 'warning') {
        notification.style.background = '#FF9800';
    } else if (type === 'info') {
        notification.style.background = '#2196F3';
    } else {
        notification.style.background = '#4CAF50';
    }
    
    notification.textContent = text;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

/**
 * Actualiza todos los elementos de la interfaz
 */
function updateUI() {
    // Actualizar contadores básicos
    document.getElementById('blockCount').textContent = window.gameState.blocks.length;
    document.getElementById('volumeCount').textContent = window.gameState.totalVolume.toFixed(4);
    document.getElementById('scoreCount').textContent = window.gameState.score;
    
    // Actualizar misión basada en el estado
    if (window.isInChallenge && !window.isChallengeSolved) {
        const challenge = window.challenges[window.currentChallenge];
        let progress = '';
        
        // Para desafíos con formas específicas requeridas
        if (challenge.requiredShapes) {
            const shapeCounts = countShapes();
            const shapeProgress = [];
            for (const [shape, required] of Object.entries(challenge.requiredShapes)) {
                const current = shapeCounts[shape] || 0;
                const emoji = getShapeEmoji(shape);
                shapeProgress.push(`${emoji}${current}/${required}`);
            }
            progress = ` (${shapeProgress.join(' ')})`;
        }
        // Para desafíos con número de bloques
        else if (challenge.targetBlocks) {
            progress = ` (${window.gameState.blocks.length}/${challenge.targetBlocks})`;
        }
        
        // Agregar progreso de volumen si aplica
        if (challenge.targetVolume) {
            const volumeProgress = progress ? ' | ' : ' ';
            progress += `${volumeProgress}Vol: ${window.gameState.totalVolume.toFixed(4)}/${challenge.targetVolume.toFixed(4)}`;
        }
        
        // Mostrar forma requerida si existe
        if (challenge.requiredShape) {
            progress += ` | Usar: ${getShapeName(challenge.requiredShape)}`;
        }
        
        document.getElementById('missionText').textContent = challenge.description + progress;
    } else {
        // Modo libre - sin desafíos activos
        let mission = '🆓 Modo Libre';
        if (window.isChallengeSolved) mission = '¡Completado! Siguiente ➡️';
        else if (window.gameState.blocks.length === 0) mission = '🆓 Modo Libre';
        else if (window.gameState.blocks.length >= 50) mission = '🆓 ¡Maestro! 50+ bloques';
        else if (window.gameState.blocks.length >= 20) mission = '🆓 ¡Genial! 20+ bloques';
        else if (window.gameState.blocks.length >= 10) mission = '🆓 ¡Bien! 10+ bloques';
        else if (window.gameState.blocks.length >= 5) mission = '🆓 5+ bloques';
        else if (window.gameState.blocks.length >= 1) mission = '🆓 Sigue construyendo';
        
        document.getElementById('missionText').textContent = mission;
    }
}

/**
 * Funciones de control de zoom
 */
window.zoomIn = function() {
    if (!window.gameState.isGridFrozen) {
        applyZoom(2);
        if (navigator.vibrate) navigator.vibrate(30);
    } else {
        window.showNotification('Grid congelado - Desbloquea primero', 'warning');
    }
};

window.zoomOut = function() {
    if (!window.gameState.isGridFrozen) {
        applyZoom(-2);
        if (navigator.vibrate) navigator.vibrate(30);
    } else {
        window.showNotification('Grid congelado - Desbloquea primero', 'warning');
    }
};

window.resetZoom = function() {
    if (!window.gameState.isGridFrozen) {
        window.gameState.currentZoom = 1;
        updateZoomIndicator();
        if (navigator.vibrate) navigator.vibrate(30);
    } else {
        window.showNotification('Grid congelado - Desbloquea primero', 'warning');
    }
};

/**
 * Aplica zoom al grid
 * @param {number} delta - Cantidad de zoom a aplicar
 */
function applyZoom(delta) {
    const zoomSpeed = 0.1;
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 2.5;
    window.gameState.currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, window.gameState.currentZoom + delta * zoomSpeed));
    updateZoomIndicator();
}

/**
 * Actualiza el indicador visual del zoom
 */
function updateZoomIndicator() {
    const percentage = Math.round(window.gameState.currentZoom * 100);
    document.getElementById('zoomLevel').textContent = percentage + '%';
}

/**
 * Cambia el modo de control actual
 * @param {string} mode - 'rotate', 'zoom', 'place', 'delete'
 */
window.setControlMode = function(mode) {
    window.gameState.controlMode = mode;
    
    // Actualizar botones (excepto el botón freeze)
    document.querySelectorAll('.modeBtn').forEach(btn => {
        if (btn.dataset.mode !== 'freeze') {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        }
    });
    
    // Actualizar hint text
    const hints = {
        'rotate': '🔄 Modo Rotación: Arrastra con 1 dedo | Flechas ← → ↑ ↓',
        'zoom': '🔍 Modo Zoom: Pellizco con 2 dedos | Rueda del mouse | Botones +/-',
        'place': '✋ Modo Colocar: Toca para colocar bloques',
        'delete': '✖️ Modo Eliminar: Toca un bloque para eliminarlo'
    };
    document.getElementById('modeHint').textContent = hints[mode];
    
    // Ocultar/mostrar controles según el modo
    document.getElementById('zoomControls').style.display = mode === 'zoom' ? 'flex' : 'none';
    document.getElementById('toolbar').style.opacity = (mode === 'place' || mode === 'delete') ? '1' : '0.5';
    
    // Habilitar/deshabilitar touchArea según el modo
    if (mode === 'place' || mode === 'rotate' || mode === 'zoom' || mode === 'delete') {
        enableTouchArea();
    } else {
        disableTouchArea();
    }
    
    // Limpiar estados
    window.gameState.isDragging = false;
    window.gameState.isPinching = false;
    window.gameState.isRotating = false;
    
    // Vibrar sutilmente para confirmar el cambio
    if (navigator.vibrate) navigator.vibrate(20);
};

/**
 * Selecciona una forma para construir
 * @param {string} shape - 'cube', 'sphere', 'cylinder', 'pyramid'
 */
window.selectShape = function(shape) {
    window.gameState.currentShape = shape;
    document.querySelectorAll('.shapeBtn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.shape === shape) {
            btn.classList.add('active');
        }
    });
};

/**
 * Alterna el estado de congelado del grid
 */
window.toggleFreezeGrid = function() {
    window.gameState.isGridFrozen = !window.gameState.isGridFrozen;
    
    const freezeBtn = document.getElementById('freezeBtn');
    if (window.gameState.isGridFrozen) {
        freezeBtn.classList.add('active');
        freezeBtn.innerHTML = '🔓<span class="tooltip">Descongelar Grid</span>';
        window.showNotification('🔒 Grid congelado - Mueve tu cámara para explorar', 'info');
        
        // Detener cualquier rotación en curso
        window.gameState.rotationVelocityX = 0;
        window.gameState.rotationVelocityY = 0;
        window.gameState.isDragging = false;
        window.gameState.isPinching = false;
        window.gameState.isRotating = false;
    } else {
        freezeBtn.classList.remove('active');
        freezeBtn.innerHTML = '🔒<span class="tooltip">Congelar Grid</span>';
        window.showNotification('🔓 Grid desbloqueado - Puedes rotarlo y hacer zoom', 'info');
    }
    
    // Vibrar para confirmar
    if (navigator.vibrate) navigator.vibrate(30);
};

/**
 * Limpia todos los bloques del grid
 */
window.clearAll = function(skipConfirmation = false) {
    // Si hay un desafío activo y no está resuelto, solo limpiar los bloques del jugador
    if (window.isInChallenge && !window.isChallengeSolved && !skipConfirmation) {
        if (!confirm('¿Seguro que quieres limpiar tus bloques? El desafío continuará.')) {
            return;
        }
        
        // Solo limpiar los bloques del jugador, NO los fantasma
        window.gameState.blocks.forEach(block => {
            window.gameState.blockContainer.remove(block);
        });
        window.gameState.blocks = [];
        window.gameState.totalVolume = 0;
        window.gameState.gridPositions.forEach(pos => {
            pos.height = 0;
        });
        
        updateUI();
    } else {
        // En modo libre, limpiar todo normalmente
        window.gameState.blocks.forEach(block => {
            window.gameState.blockContainer.remove(block);
        });
        window.gameState.blocks = [];
        window.gameState.totalVolume = 0;
        window.gameState.gridPositions.forEach(pos => {
            pos.height = 0;
        });
        
        // Limpiar bloques fantasma si existen
        window.gameState.challengeBlocks.forEach(ghost => {
            window.gameState.blockContainer.remove(ghost);
        });
        window.gameState.challengeBlocks = [];
        
        document.getElementById('currentConcept').textContent = '';
        
        updateUI();
    }
};

/**
 * Activa el modo sandbox/libre
 */
window.enterSandboxMode = function() {
    // Marcar que ya no hay desafío activo
    window.isInChallenge = false;
    window.isChallengeSolved = false;
    
    // Limpiar bloques fantasma de desafíos
    window.gameState.challengeBlocks.forEach(ghost => {
        window.gameState.blockContainer.remove(ghost);
    });
    window.gameState.challengeBlocks = [];
    
    // Resetear estado de desafío
    window.isChallengeSolved = false;
    
    // Habilitar todas las formas
    document.querySelectorAll('.shapeBtn').forEach(btn => {
        const shape = btn.dataset.shape;
        if (shape !== 'clear') {
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    });
    
    // Actualizar UI
    document.getElementById('currentConcept').textContent = '🎨 Modo Libre';
    document.getElementById('missionText').textContent = '🆓 Construye libremente';
    const challengeBtn = document.getElementById('challengeBtn');
    challengeBtn.textContent = '🏆 Iniciar Desafío';
    challengeBtn.className = 'gradient-button gradient-primary';
    
    // Cambiar botón sandbox
    const sandboxBtn = document.getElementById('sandboxBtn');
    sandboxBtn.textContent = '🎨 Ya estás en Modo Libre';
    sandboxBtn.className = 'gradient-button gradient-success';
    sandboxBtn.disabled = true;
    
    // Cambiar a modo colocar
    setControlMode('place');
    selectShape('cube');
    
    showNotification('🎨 ¡Modo Libre activado! Construye sin restricciones', 'info');
    
    // Vibrar
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
};

/**
 * Sale del modo sandbox
 */
window.exitSandboxMode = function() {
    // Solo salir si estábamos en modo sandbox
    if (!document.getElementById('sandboxBtn').disabled) {
        return;
    }
    
    // Restaurar botón sandbox
    const sandboxBtn = document.getElementById('sandboxBtn');
    sandboxBtn.textContent = '🎨 Modo Libre';
    sandboxBtn.className = 'gradient-button gradient-purple';
    sandboxBtn.disabled = false;
    
    // Limpiar texto de concepto si estaba en modo libre
    const currentConcept = document.getElementById('currentConcept').textContent;
    if (currentConcept.includes('Modo Libre')) {
        document.getElementById('currentConcept').textContent = '';
    }
    
    updateUI();
};

/**
 * Habilita el área táctil para interacciones
 */
function enableTouchArea() {
    const touchArea = document.getElementById('touchArea');
    if (touchArea) {
        touchArea.style.pointerEvents = 'auto';
        touchArea.style.display = 'block';
    }
}

/**
 * Deshabilita el área táctil
 */
function disableTouchArea() {
    const touchArea = document.getElementById('touchArea');
    if (touchArea) {
        touchArea.style.pointerEvents = 'none';
        touchArea.style.display = 'none';
    }
}

// Funciones auxiliares para los desafíos
function countShapes() {
    const counts = {};
    window.gameState.blocks.forEach(block => {
        const shape = block.userData.shape;
        counts[shape] = (counts[shape] || 0) + 1;
    });
    return counts;
}

function getShapeEmoji(shape) {
    const emojis = {
        'cube': '🟦',
        'sphere': '🔵',
        'cylinder': '🟫',
        'pyramid': '🔺'
    };
    return emojis[shape] || '❓';
}

function getShapeName(shape) {
    const names = {
        'cube': 'Cubo',
        'sphere': 'Esfera',
        'cylinder': 'Cilindro',
        'pyramid': 'Pirámide'
    };
    return names[shape] || shape;
}

// Exportar funciones necesarias globalmente
window.showNotification = showNotification;
window.updateUI = updateUI;
window.applyZoom = applyZoom;
window.updateZoomIndicator = updateZoomIndicator;
window.enableTouchArea = enableTouchArea;
window.disableTouchArea = disableTouchArea;
window.countShapes = countShapes;
window.getShapeEmoji = getShapeEmoji;
window.getShapeName = getShapeName;
