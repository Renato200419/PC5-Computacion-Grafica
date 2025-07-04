// Funciones de control táctil extraídas del HTML principal

import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function setupTouchInteraction() {
    const touchArea = document.getElementById('touchArea');
    const gameState = window.gameState;
    const gridPositions = gameState.gridPositions;
    const blockContainer = gameState.blockContainer;
    const GRID_SIZE = gameState.GRID_SIZE;
    
    // Crear planos invisibles para cada posición del grid
    const gridHitPlanes = [];
    gridPositions.forEach((pos, index) => {
        const planeGeometry = new THREE.PlaneGeometry(GRID_SIZE * 0.9, GRID_SIZE * 0.9);
        const planeMaterial = new THREE.MeshBasicMaterial({ 
            visible: false,
            side: THREE.DoubleSide 
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(pos.x, 0.01, pos.z);
        plane.userData = { gridIndex: index };
        blockContainer.add(plane);
        gridHitPlanes.push(plane);
    });
    
    // Función para actualizar hover
    function updateHover(event) {
        const hoverIndicator = gameState.hoverIndicator;
        if (!gameState.isTracking || gameState.controlMode !== 'place') {
            hoverIndicator.visible = false;
            return;
        }
        
        // Obtener coordenadas
        let clientX, clientY;
        if (event.type.includes('touch')) {
            clientX = event.touches[0]?.clientX || event.changedTouches[0]?.clientX;
            clientY = event.touches[0]?.clientY || event.changedTouches[0]?.clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        // Convertir a coordenadas normalizadas
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        
        // Raycast
        raycaster.setFromCamera(mouse, gameState.camera);
        const intersects = raycaster.intersectObjects(gridHitPlanes);
        
        if (intersects.length > 0) {
            const gridIndex = intersects[0].object.userData.gridIndex;
            const gridPos = gridPositions[gridIndex];
            
            // Mostrar indicador
            hoverIndicator.visible = true;
            hoverIndicator.position.set(
                gridPos.x,
                0.025 + gridPos.height * 0.25,
                gridPos.z
            );
            
            // Cambiar color según disponibilidad
            if (gridPos.height >= 5) {
                hoverIndicator.material.color.setHex(0xff0000);
            } else {
                hoverIndicator.material.color.setHex(0x00ff00);
            }
        } else {
            hoverIndicator.visible = false;
        }
    }
    
    // Función para manejar toques
    function handleTouch(event) {
        // Solo procesar toques en modo 'place'
        if (gameState.controlMode !== 'place') return;
        
        if (!gameState.isTracking) {
            window.showNotification('Primero apunta a la tarjeta', 'warning');
            return;
        }
        
        event.preventDefault();
        
        // Obtener coordenadas del toque
        let clientX, clientY;
        if (event.type === 'touchstart' || event.type === 'touchend') {
            clientX = event.changedTouches[0].clientX;
            clientY = event.changedTouches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        // Convertir a coordenadas normalizadas
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        
        // Raycast para detectar qué posición del grid fue tocada
        raycaster.setFromCamera(mouse, gameState.camera);
        const intersects = raycaster.intersectObjects(gridHitPlanes);
        
        if (intersects.length > 0) {
            const gridIndex = intersects[0].object.userData.gridIndex;
            const gridPos = gridPositions[gridIndex];
            
            // Verificar si la posición está disponible
            if (gridPos.height < 5) {
                window.placeBlock(gridPos);
                gameState.hoverIndicator.visible = false;
            } else {
                window.showNotification('Esta posición está llena', 'warning');
            }
        }
    }
    
    // Función para manejar eliminación de bloques
    function handleDelete(event) {
        console.log('handleDelete llamado, modo:', gameState.controlMode);
        console.log('Bloques actuales:', gameState.blocks.length);
        
        if (!gameState.isTracking) {
            window.showNotification('Primero apunta a la tarjeta', 'warning');
            return;
        }
        
        event.preventDefault();

        // Convertir a coordenadas normalizadas
        let clientX, clientY;
        if (event.type.includes('touch')) {
            clientX = event.changedTouches[0].clientX;
            clientY = event.changedTouches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        // Raycast para detectar qué bloque fue tocado
        raycaster.setFromCamera(mouse, gameState.camera);
        const intersects = raycaster.intersectObjects(gameState.blocks);
        
        console.log('Intersecciones encontradas:', intersects.length);

        if (intersects.length > 0) {
            const block = intersects[0].object;
            const gridX = block.userData.gridX;
            const gridY = block.userData.gridY;
            const gridZ = block.userData.gridZ;

            // Encontrar todos los bloques que están encima del bloque eliminado
            const blocksToRemove = [block];
            gameState.blocks.forEach(b => {
                if (b.userData.gridX === gridX && 
                    b.userData.gridZ === gridZ && 
                    b.userData.gridY > gridY) {
                    blocksToRemove.push(b);
                }
            });

            // Ordenar bloques por altura (de arriba hacia abajo)
            blocksToRemove.sort((a, b) => b.userData.gridY - a.userData.gridY);

            // Eliminar bloques con animación
            blocksToRemove.forEach((blockToRemove, index) => {
                // Animación de eliminación
                window.animateScale(blockToRemove, { x: 0, y: 0, z: 0 }, 200 + index * 50);
                
                setTimeout(() => {
                    // Remover bloque del contenedor y del array
                    blockContainer.remove(blockToRemove);
                    gameState.blocks = gameState.blocks.filter(b => b !== blockToRemove);
                    
                    // Actualizar volumen total
                    const volumes = {
                        cube: 0.015625,
                        sphere: 0.008181,
                        cylinder: 0.012272,
                        pyramid: 0.005208
                    };
                    gameState.totalVolume -= volumes[blockToRemove.userData.shape];
                    window.updateUI();
                }, 200 + index * 50);
            });

            // Actualizar altura del grid
            const gridIndex = gridPositions.findIndex(pos => 
                pos.gridX === gridX && pos.gridZ === gridZ
            );
            
            if (gridIndex !== -1) {
                gridPositions[gridIndex].height -= blocksToRemove.length;
            }

            // Vibración
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }

            window.showNotification(`${blocksToRemove.length} bloque${blocksToRemove.length > 1 ? 's' : ''} eliminado${blocksToRemove.length > 1 ? 's' : ''}`);
        } else {
            console.log('No se encontraron bloques en la posición del toque');
        }
    }
    
    // Hacer el touchArea receptivo solo cuando sea necesario
    window.enableTouchArea = function() {
        const touchArea = document.getElementById('touchArea');
        if (touchArea) touchArea.style.pointerEvents = 'auto';
    }
    
    window.disableTouchArea = function() {
        const touchArea = document.getElementById('touchArea');
        if (touchArea) touchArea.style.pointerEvents = 'none';
    }
    
    // Eventos táctiles
    touchArea.addEventListener('touchstart', (e) => {
        if (gameState.controlMode === 'place') {
            handleTouch(e);
        } else if (gameState.controlMode === 'delete') {
            handleDelete(e);
        }
    });
    
    touchArea.addEventListener('click', (e) => {
        if (gameState.controlMode === 'place') {
            handleTouch(e);
        } else if (gameState.controlMode === 'delete') {
            handleDelete(e);
        }
    });
    
    touchArea.addEventListener('touchmove', updateHover);
    touchArea.addEventListener('mousemove', updateHover);
}

export function setupRotationControls() {
    const touchArea = document.getElementById('touchArea');
    const gameState = window.gameState;
    let touches = [];
    let pinchDistance = 0;
    
    // Función para calcular el ángulo entre dos toques
    function getTouchAngle(touch1, touch2) {
        return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
    }
    
    // Función para obtener el centro entre dos toques
    function getTouchCenter(touch1, touch2) {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }
    
    // Función para calcular la distancia entre dos toques
    function getTouchDistance(touch1, touch2) {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Variables para rastrear el movimiento del centro
    let lastTouchCenter = null;
    let touchStartCenter = null;
    
    // Manejo de gestos multi-touch para rotación y zoom
    touchArea.addEventListener('touchstart', (e) => {
        // Habilitar touchArea según el modo
        if (gameState.controlMode === 'rotate' || gameState.controlMode === 'zoom') {
            window.enableTouchArea();
        }
        
        // Un solo toque en modo rotación o zoom
        if (e.touches.length === 1 && (gameState.controlMode === 'rotate' || gameState.controlMode === 'zoom')) {
            e.preventDefault();
            if (gameState.controlMode === 'rotate' && !gameState.isGridFrozen) {
                gameState.isDragging = true;
                gameState.dragStartX = e.touches[0].clientX;
                gameState.dragStartY = e.touches[0].clientY;
                gameState.dragStartRotationY = gameState.gridRotationY;
                gameState.dragStartRotationX = gameState.gridRotationX;
                gameState.rotationVelocityY = 0;
                gameState.rotationVelocityX = 0;
            }
        }
        
        // Dos toques para zoom en modo zoom
        if (e.touches.length === 2 && gameState.controlMode === 'zoom' && !gameState.isGridFrozen) {
            e.preventDefault();
            touches = Array.from(e.touches);
            gameState.isPinching = true;
            gameState.initialPinchDistance = getTouchDistance(touches[0], touches[1]);
            pinchDistance = gameState.initialPinchDistance;
        }
    });
    
    touchArea.addEventListener('touchmove', (e) => {
        // Arrastre con un dedo en modo rotación
        if (e.touches.length === 1 && gameState.isDragging && gameState.controlMode === 'rotate') {
            e.preventDefault();
            const deltaX = e.touches[0].clientX - gameState.dragStartX;
            const deltaY = e.touches[0].clientY - gameState.dragStartY;
            
            // Rotación horizontal
            gameState.gridRotationY = gameState.dragStartRotationY + (deltaX * 0.01);
            gameState.blockContainer.rotation.y = gameState.gridRotationY;
            gameState.rotationVelocityY = deltaX * 0.0001;
            
            // Rotación vertical
            gameState.gridRotationX = gameState.dragStartRotationX - (deltaY * 0.01);
            gameState.gridRotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, gameState.gridRotationX));
            gameState.blockContainer.rotation.x = gameState.gridRotationX;
            gameState.rotationVelocityX = -deltaY * 0.0001;
        }
        
        // Zoom con dos dedos en modo zoom
        if (e.touches.length === 2 && gameState.isPinching && gameState.controlMode === 'zoom') {
            e.preventDefault();
            touches = Array.from(e.touches);
            const currentDistance = getTouchDistance(touches[0], touches[1]);
            const zoomDelta = (currentDistance - pinchDistance) / 100;
            window.applyZoom(zoomDelta * 5);
            pinchDistance = currentDistance;
        }
    });
    
    touchArea.addEventListener('touchend', (e) => {
        gameState.isDragging = false;
        gameState.isPinching = false;
        gameState.isRotating = false;
    });
    
    // Control de zoom con rueda del mouse
    touchArea.addEventListener('wheel', (e) => {
        if (!gameState.isGridFrozen) {
            e.preventDefault();
            const delta = -Math.sign(e.deltaY);
            window.applyZoom(delta);
        }
    });
    
    // Controles de mouse para rotación (clic derecho + arrastre)
    touchArea.addEventListener('mousedown', (e) => {
        if (e.button === 2 && !gameState.isGridFrozen) { // Botón derecho y grid no congelado
            e.preventDefault();
            gameState.isDragging = true;
            gameState.dragStartX = e.clientX;
            gameState.dragStartY = e.clientY;
            gameState.dragStartRotationY = gameState.gridRotationY;
            gameState.dragStartRotationX = gameState.gridRotationX;
            gameState.rotationVelocityY = 0;
            gameState.rotationVelocityX = 0;
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (gameState.isDragging) {
            e.preventDefault();
            const deltaX = e.clientX - gameState.dragStartX;
            const deltaY = e.clientY - gameState.dragStartY;
            
            // Rotación horizontal
            gameState.gridRotationY = gameState.dragStartRotationY + (deltaX * 0.01);
            gameState.blockContainer.rotation.y = gameState.gridRotationY;
            gameState.rotationVelocityY = deltaX * 0.0001;
            
            // Rotación vertical
            gameState.gridRotationX = gameState.dragStartRotationX - (deltaY * 0.01);
            gameState.gridRotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, gameState.gridRotationX));
            gameState.blockContainer.rotation.x = gameState.gridRotationX;
            gameState.rotationVelocityX = -deltaY * 0.0001;
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (e.button === 2) {
            gameState.isDragging = false;
        }
    });
    
    // Prevenir menú contextual
    touchArea.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Controles de teclado
    document.addEventListener('keydown', (e) => {
        if (!gameState.isTracking) return;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                gameState.rotationVelocityY = -0.05;
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                gameState.rotationVelocityY = 0.05;
                e.preventDefault();
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                gameState.rotationVelocityX = -0.05;
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                gameState.rotationVelocityX = 0.05;
                e.preventDefault();
                break;
            case 'r':
            case 'R':
                // Reset rotación
                gameState.gridRotationY = 0;
                gameState.gridRotationX = 0;
                gameState.blockContainer.rotation.y = 0;
                gameState.blockContainer.rotation.x = 0;
                gameState.rotationVelocityY = 0;
                gameState.rotationVelocityX = 0;
                window.showNotification('Rotación reiniciada');
                e.preventDefault();
                break;
            case '+':
            case '=':
                window.applyZoom(1);
                e.preventDefault();
                break;
            case '-':
            case '_':
                window.applyZoom(-1);
                e.preventDefault();
                break;
            case '0':
                gameState.currentZoom = 1;
                window.updateZoomIndicator();
                window.showNotification('Zoom reiniciado');
                e.preventDefault();
                break;
        }
    });
}
