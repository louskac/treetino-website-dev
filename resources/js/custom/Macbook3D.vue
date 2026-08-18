<template>
    <div
        ref="containerRef"
        class="relative w-full max-w-full mx-auto h-[550px] sm:h-[650px] md:h-[720px] lg:h-[800px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-visible"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
    >
        <!-- Ambient Backlight Spotlight -->
        <div
            class="absolute inset-0 rounded-full bg-t-blue/20 blur-3xl transition-opacity duration-500 pointer-events-none"
        ></div>

        <!-- Three.js 3D WebGL Canvas -->
        <canvas ref="canvasRef" class="w-full h-full block relative z-10 overflow-visible"></canvas>

        <!-- Loading indicator until 3D GLTF model is ready -->
        <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center bg-zinc-950/20 backdrop-blur-sm rounded-3xl z-20 transition-opacity duration-300 pointer-events-none"
        >
            <div class="flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/90 text-white/80 border border-white/10 text-xs font-mono shadow-xl">
                <span class="h-2 w-2 rounded-full bg-t-blue animate-ping"></span>
                Loading 3D MacBook Pro...
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const props = withDefaults(
    defineProps<{
        screenSrc?: string;
        alt?: string;
        rotateY?: number;
        rotateX?: number;
        scale?: number;
        interactive?: boolean;
    }>(),
    {
        screenSrc: '/img/cta/cta-pos-1.webp',
        alt: 'Treetino Pricing ROI Calculator App Screenshot',
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        interactive: true,
    }
);

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isLoading = ref(true);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let pivotGroup: THREE.Group | null = null;
let modelGroup: THREE.Group | null = null;
let screenMesh: THREE.Mesh | null = null;
let animationFrameId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

const textureLoader = new THREE.TextureLoader();
const mouseX = ref(0);
const mouseY = ref(0);
const currentRotateY = ref(0);
const currentRotateX = ref(0);

function handleMouseMove(e: MouseEvent) {
    if (!props.interactive || !containerRef.value) return;
    const rect = containerRef.value.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.value = x * 0.3; // Mouse tilt in radians
    mouseY.value = -y * 0.15; // Mouse tilt in radians
}

function handleMouseLeave() {
    mouseX.value = 0;
    mouseY.value = 0;
}

function updateScreenTexture(src: string) {
    if (!screenMesh) return;
    textureLoader.load(src, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = true;
        texture.offset.set(0, 0);
        texture.center.set(0, 0);
        texture.rotation = 0;
        texture.repeat.set(1, 1);
        
        const mat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
        screenMesh!.material = mat;
    });
}

function updateCameraFrustum() {
    if (!containerRef.value || !renderer || !camera || !modelGroup) return;
    const width = containerRef.value.clientWidth;
    const height = containerRef.value.clientHeight;

    camera.aspect = width / height;

    const box = new THREE.Box3().setFromObject(modelGroup);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);

    // Camera distance 1.38 provides big, bold model scale with complete clearance on all sides
    const cameraDistance = Math.abs((maxDim / 2) / Math.tan(fov / 2)) * 1.38;

    // Offset camera slightly downward (-0.03) to elevate front laptop base comfortably above bottom edge
    camera.position.set(0, -maxDim * 0.03, cameraDistance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function initThreeScene() {
    if (!canvasRef.value || !containerRef.value) return;

    const width = containerRef.value.clientWidth;
    const height = containerRef.value.clientHeight;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera
    camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 1000);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.value,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.8);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-10, 5, -5);
    scene.add(fillLight);

    // 5. Load GLTF 3D Model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
        '/models/macbook.glb',
        (gltf) => {
            modelGroup = gltf.scene;

            // Auto-center model at origin (0,0,0)
            const box = new THREE.Box3().setFromObject(modelGroup);
            const center = new THREE.Vector3();
            box.getCenter(center);

            modelGroup.position.x = -center.x;
            modelGroup.position.y = -center.y;
            modelGroup.position.z = -center.z;

            // Pivot parent group for smooth 3D rotation
            pivotGroup = new THREE.Group();
            pivotGroup.add(modelGroup);
            scene.add(pivotGroup);

            // Set camera distance and framing
            updateCameraFrustum();

            // Identify screen mesh
            modelGroup.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    if (mesh.name === 'matte' || mesh.name === 'screen') {
                        screenMesh = mesh;
                    }
                }
            });

            if (!screenMesh) {
                const found = modelGroup.getObjectByName('matte') || modelGroup.getObjectByName('screen');
                if (found && (found as THREE.Mesh).isMesh) {
                    screenMesh = found as THREE.Mesh;
                }
            }

            isLoading.value = false;

            if (props.screenSrc) {
                updateScreenTexture(props.screenSrc);
            }
        },
        undefined,
        (error) => {
            console.error('Error loading 3D MacBook model:', error);
            isLoading.value = false;
        }
    );

    // Render loop with smooth rotation interpolation
    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        if (pivotGroup) {
            const targetY = (props.rotateY || 0) * (Math.PI / 180) + mouseX.value;
            const targetX = (props.rotateX || 0) * (Math.PI / 180) + mouseY.value;

            // Smooth spring damping interpolation
            currentRotateY.value += (targetY - currentRotateY.value) * 0.08;
            currentRotateX.value += (targetX - currentRotateX.value) * 0.08;

            pivotGroup.rotation.y = currentRotateY.value;
            pivotGroup.rotation.x = currentRotateX.value;
        }

        renderer.render(scene, camera);
    }
    animate();

    // Responsive Resize Observer
    resizeObserver = new ResizeObserver(() => {
        updateCameraFrustum();
    });
    resizeObserver.observe(containerRef.value);
}

watch(
    () => props.screenSrc,
    (newSrc) => {
        if (newSrc) {
            updateScreenTexture(newSrc);
        }
    }
);

onMounted(() => {
    initThreeScene();
});

onUnmounted(() => {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }
    if (resizeObserver && containerRef.value) {
        resizeObserver.unobserve(containerRef.value);
    }
    if (renderer) {
        renderer.dispose();
    }
});
</script>

<style scoped>
</style>
