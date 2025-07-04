import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

// Hacer THREE global para que esté disponible en las funciones
window.THREE = THREE;

// Estado global del juego - accesible desde ui-controls.js
window.gameState = {
    // Estado del juego
    currentShape: 'cube',
    blocks: [],
    totalVolume: 0,
    mindarThree: null,
    targetAnchor: null,
    scene: null,
    camera: null,
    renderer: null,
    blockContainer: null,
    isTracking: false,
    isARInitialized: false,
    
    // Sistema de grid
    GRID_SIZE: 0.3,
    GRID_WIDTH: 10,
    GRID_HEIGHT: 10,
    gridPositions: [],
    hoverIndicator: null,
    
    // Variables para rotación del grid
    gridRotationY: 0,
    gridRotationX: 0,
    isRotating: false,
    touchStartAngle: 0,
    lastTouchAngle: 0,
    rotationVelocityY: 0,
    rotationVelocityX: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartRotationY: 0,
    dragStartRotationX: 0,
    
    // Variables para zoom
    currentZoom: 1,
    MIN_ZOOM: 0.5,
    MAX_ZOOM: 2.5,
    isPinching: false,
    initialPinchDistance: 0,
    
    // Modo de control actual
    controlMode: 'rotate',
    deleteMode: false,
    
    // Sistema de desafíos
    challengeBlocks: [],
    score: 0
};

// Hacer referencias locales para facilitar el código
let currentShape = window.gameState.currentShape;
let blocks = window.gameState.blocks;
let totalVolume = window.gameState.totalVolume;
let mindarThree = window.gameState.mindarThree;
let targetAnchor = window.gameState.targetAnchor;
let scene = window.gameState.scene;
let camera = window.gameState.camera;
let renderer = window.gameState.renderer;
let blockContainer = window.gameState.blockContainer;
let isTracking = window.gameState.isTracking;
let isARInitialized = window.gameState.isARInitialized;

const GRID_SIZE = window.gameState.GRID_SIZE;
const GRID_WIDTH = window.gameState.GRID_WIDTH;
const GRID_HEIGHT = window.gameState.GRID_HEIGHT;
const gridPositions = window.gameState.gridPositions;
let hoverIndicator = window.gameState.hoverIndicator;

let gridRotationY = window.gameState.gridRotationY;
let gridRotationX = window.gameState.gridRotationX;
let isRotating = window.gameState.isRotating;
let touchStartAngle = window.gameState.touchStartAngle;
let lastTouchAngle = window.gameState.lastTouchAngle;
let rotationVelocityY = window.gameState.rotationVelocityY;
let rotationVelocityX = window.gameState.rotationVelocityX;
let isDragging = window.gameState.isDragging;
let dragStartX = window.gameState.dragStartX;
let dragStartY = window.gameState.dragStartY;
let dragStartRotationY = window.gameState.dragStartRotationY;
let dragStartRotationX = window.gameState.dragStartRotationX;

let currentZoom = window.gameState.currentZoom;
const MIN_ZOOM = window.gameState.MIN_ZOOM;
const MAX_ZOOM = window.gameState.MAX_ZOOM;
let isPinching = window.gameState.isPinching;
let initialPinchDistance = window.gameState.initialPinchDistance;

let controlMode = window.gameState.controlMode;
let deleteMode = window.gameState.deleteMode;

let challengeBlocks = window.gameState.challengeBlocks;
let score = window.gameState.score;

// Variables globales para el sistema de desafíos
window.currentChallenge = 0;
window.isChallengeSolved = false;
window.isInChallenge = false;

// Inicializar posiciones del grid
for (let x = 0; x < GRID_WIDTH; x++) {
    for (let z = 0; z < GRID_HEIGHT; z++) {
        const worldX = (x - GRID_WIDTH/2 + 0.5) * GRID_SIZE;
        const worldZ = (z - GRID_HEIGHT/2 + 0.5) * GRID_SIZE;
        gridPositions.push({
            x: worldX,
            z: worldZ,
            gridX: x - Math.floor(GRID_WIDTH/2), // Coordenada del grid centrada
            gridZ: z - Math.floor(GRID_HEIGHT/2), // Coordenada del grid centrada
            occupied: false,
            height: 0
        });
    }
}

// Debug: mostrar el rango de coordenadas del grid
console.log('Grid inicializado:');
console.log(`Coordenadas X del grid: ${gridPositions[0].gridX} a ${gridPositions[gridPositions.length-1].gridX}`);
console.log(`Coordenadas Z del grid: ${gridPositions[0].gridZ} a ${gridPositions[gridPositions.length-1].gridZ}`);

const volumes = {
    cube: 0.015625, // (0.25)^3
    sphere: 0.008181, // (4/3)π(0.125)^3
    cylinder: 0.012272, // π(0.125)^2 * 0.25
    pyramid: 0.005208 // (1/3) * base * altura = (1/3) * π(0.125)^2 * 0.25
};

// Desafíos educativos para estudiantes de 9-12 años
// Los desafíos ahora están definidos en challenges.js

window.startAR = async function() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('scorePanel').style.display = 'block';
    document.getElementById('trackingStatus').style.display = 'block';
    document.getElementById('toolbar').style.display = 'flex';
    document.getElementById('touchArea').style.display = 'block';
    document.getElementById('rotationHint').style.display = 'block';
    document.getElementById('zoomControls').style.display = 'flex';
    document.getElementById('zoomIndicator').style.display = 'flex';
    document.getElementById('modeSelector').style.display = 'flex';
    
    try {
        // Inicializar MindAR
        mindarThree = new MindARThree({
            container: document.body,
            imageTargetSrc: './static/assets/targets/card.mind',
            filterMinCF: 0.0001,
            filterBeta: 0.001
        });
        
        ({ renderer, scene, camera } = mindarThree);
        
        // Actualizar referencias globales
        window.gameState.mindarThree = mindarThree;
        window.gameState.scene = scene;
        window.gameState.camera = camera;
        window.gameState.renderer = renderer;
        
        // Iluminación
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 10, 5);
        scene.add(light);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        // Target anchor
        targetAnchor = mindarThree.addAnchor(0);
        window.gameState.targetAnchor = targetAnchor;
        
        // Contenedor principal
        blockContainer = new THREE.Group();
        targetAnchor.group.add(blockContainer);
        
        // Actualizar referencia global
        window.gameState.blockContainer = blockContainer;
        
        // Crear grid visual
        createGrid();
        
        // Configurar controles de rotación
        setupRotationControls();
        
        // Eventos de tracking
        targetAnchor.onTargetFound = () => {
            isTracking = true;
            window.gameState.isTracking = true;
            document.getElementById('trackingStatus').textContent = '✅ Tarjeta detectada';
            document.getElementById('trackingStatus').classList.add('found');
        };
        
        targetAnchor.onTargetLost = () => {
            isTracking = false;
            window.gameState.isTracking = false;
            document.getElementById('trackingStatus').textContent = '❌ Tarjeta perdida';
            document.getElementById('trackingStatus').classList.remove('found');
        };
        
        // Iniciar AR
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            // Usar referencias del estado global
            const state = window.gameState;
            
            // Aplicar rotación suave con inercia para ambos ejes
            if (Math.abs(state.rotationVelocityY) > 0.001) {
                state.gridRotationY += state.rotationVelocityY;
                state.rotationVelocityY *= 0.95; // Fricción
            }
            
            if (Math.abs(state.rotationVelocityX) > 0.001) {
                state.gridRotationX += state.rotationVelocityX;
                state.rotationVelocityX *= 0.95; // Fricción
            }
            
            // Limitar rotación vertical para evitar voltear completamente
            state.gridRotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, state.gridRotationX));
            
            // Aplicar rotaciones
            if (state.blockContainer) {
                state.blockContainer.rotation.y = state.gridRotationY;
                state.blockContainer.rotation.x = state.gridRotationX;
                
                // Aplicar zoom
                state.blockContainer.scale.set(state.currentZoom, state.currentZoom, state.currentZoom);
            }
            
            renderer.render(scene, camera);
        });
        
        // Configurar interacción táctil
        setupTouchInteraction();
        
        // Marcar AR como inicializado
        isARInitialized = true;
        window.gameState.isARInitialized = true;
        console.log('AR inicializado correctamente');
        
    } catch (error) {
        console.error('Error iniciando AR:', error);
        alert('Error iniciando AR: ' + error.message);
        isARInitialized = false;
        window.gameState.isARInitialized = false;
    }
};

function createGrid() {
    // Plano base
    const baseGeometry = new THREE.PlaneGeometry(GRID_WIDTH * GRID_SIZE, GRID_HEIGHT * GRID_SIZE);
    const baseMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x2a2a2a, 
        transparent: true, 
        opacity: 0.8
    });
    const basePlane = new THREE.Mesh(baseGeometry, baseMaterial);
    basePlane.rotation.x = -Math.PI / 2;
    basePlane.position.y = 0;
    blockContainer.add(basePlane);
    
    // Crear indicador de hover
    const hoverGeometry = new THREE.BoxGeometry(GRID_SIZE * 0.9, 0.05, GRID_SIZE * 0.9);
    const hoverMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.5
    });
    hoverIndicator = new THREE.Mesh(hoverGeometry, hoverMaterial);
    hoverIndicator.visible = false;
    blockContainer.add(hoverIndicator);
    
    // Actualizar referencia global
    window.gameState.hoverIndicator = hoverIndicator;
    
    // Líneas del grid
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
    
    for (let i = 0; i <= GRID_WIDTH; i++) {
        const x = (i - GRID_WIDTH/2) * GRID_SIZE;
        const points = [
            new THREE.Vector3(x, 0.01, -GRID_HEIGHT/2 * GRID_SIZE),
            new THREE.Vector3(x, 0.01, GRID_HEIGHT/2 * GRID_SIZE)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        blockContainer.add(line);
    }

    for (let i = 0; i <= GRID_HEIGHT; i++) {
        const z = (i - GRID_HEIGHT/2) * GRID_SIZE;
        const points = [
            new THREE.Vector3(-GRID_WIDTH/2 * GRID_SIZE, 0.01, z),
            new THREE.Vector3(GRID_WIDTH/2 * GRID_SIZE, 0.01, z)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        blockContainer.add(line);
    }
}

// Importar funciones de game-functions.js y touch-controls.js
import './js/game-functions.js';
import { setupTouchInteraction, setupRotationControls } from './js/touch-controls.js';

