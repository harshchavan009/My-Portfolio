console.log("Script execution started...");
import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// --- Decryption Logic ---
async function generateAESKey(password) {
    const passwordBuffer = new TextEncoder().encode(password);
    const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
    return crypto.subtle.importKey(
        "raw",
        hashedPassword.slice(0, 32),
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    );
}

async function decryptFile(url, password) {
    const response = await fetch(url);
    const encryptedData = await response.arrayBuffer();
    const iv = new Uint8Array(encryptedData.slice(0, 16));
    const data = encryptedData.slice(16);
    const key = await generateAESKey(password);
    return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
}

// --- Scene Setup ---
const canvas = document.querySelector('#canvas3d');
const scene = new THREE.Scene();
const clock = new THREE.Clock();
let mixer;

const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

const camera = new THREE.PerspectiveCamera(14.5, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 13.1, 24.7);
camera.zoom = 1.1;
camera.updateProjectionMatrix();

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x6366f1, 2, 10);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);

// --- Load Character ---
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('assets/draco/');
loader.setDRACOLoader(dracoLoader);

let character;
let headBone;

async function init() {
    console.log("3D Scene Initializing...");
    try {
        const decryptedData = await decryptFile('assets/models/character.enc', 'MyCharacter12');
        const blobUrl = URL.createObjectURL(new Blob([decryptedData]));

        loader.load(blobUrl, (gltf) => {
            console.log("Character Model Loaded successfully.");
            character = gltf.scene;
            scene.add(character);

            // ⚡ EARLY REVEAL: Hide loading screen immediately
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => loadingScreen.remove(), 1000);
            }

            // --- Posing & Framing (Priority 1) ---
            headBone = character.getObjectByName("spine006");
            const box = new THREE.Box3().setFromObject(character);
            const size = box.getSize(new THREE.Vector3());
            // Professional scaling
            const targetHeight = 14; 
            const scaleFactor = targetHeight / size.y;
            character.scale.set(scaleFactor, scaleFactor, scaleFactor);
            
            // Center character at origin (bottom at y=0)
            character.position.set(0, -box.min.y * scaleFactor, 0); 

            // --- Cinematic Low Angle Camera with Anti-Crop ---
            const aspect = window.innerWidth / window.innerHeight;
            let baseDistance = targetHeight * 4.5; 
            // If screen is narrow (mobile), move camera further back to prevent side cropping
            if (aspect < 1) {
                baseDistance = baseDistance / aspect;
            }
            
            const cameraHeight = targetHeight * 0.25; // More pronounced low angle
            camera.position.set(0, cameraHeight, baseDistance);
            camera.lookAt(0, targetHeight * 0.55, 0); // Look at mid-upper chest for hero pose
            camera.zoom = 1.0; 
            camera.updateProjectionMatrix();

            // --- Section Specific Shadows & Atmosphere ---
            const mainLight = scene.children.find(l => l.isDirectionalLight);
            if (mainLight) {
                mainLight.castShadow = true;
                mainLight.intensity = 1.2; // Smooth lighting
                mainLight.shadow.mapSize.width = 2048; // High-res soft shadows
                mainLight.shadow.mapSize.height = 2048;
                mainLight.shadow.radius = 4; // Soft shadow edges
            }

            // Subtle dark background glow
            const atmosphericGlow = new THREE.PointLight(0x4f46e5, 1.5, 60);
            atmosphericGlow.position.set(0, targetHeight * 0.5, -15); 
            scene.add(atmosphericGlow);

            // Setup Animations
            // --- Defer Non-Critical Assets (Priority 2) ---
            setTimeout(() => {
                // Deck & Equipment Visibility & Shadows
                character.traverse((child) => {
                    const targetNames = ["Plane004", "screenlight", "Monitor", "Desk", "Table"];
                    if (targetNames.some(name => child.name.includes(name))) {
                        child.visible = true;
                        if (child.material) {
                            child.material.transparent = true;
                            child.material.opacity = 1;
                        }
                    }
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                if (gltf.animations && gltf.animations.length) {
                    mixer = new THREE.AnimationMixer(character);
                    let targetClip = gltf.animations.find(clip => 
                        clip.name.toLowerCase().includes('sit') || 
                        clip.name.toLowerCase().includes('work') ||
                        clip.name.toLowerCase().includes('type')
                    ) || gltf.animations[0];
                    mixer.clipAction(targetClip).setEffectiveTimeScale(0.5).play();
                }

                setupScrollAnimations();
                createBackgroundDecor();
                createTechBalls();
                initTilt();
                updateLightingToNeon();
            }, 50);
        });
    } catch (error) {


        console.error("Error loading 3D character:", error);
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.remove(), 1000);
        }
        if (typeof gsap !== 'undefined') setupScrollAnimations();
        initTilt();
        updateLightingToNeon();
    }
}



function initTilt() {
    if (window.VanillaTilt) {
        console.log("VanillaTilt Initialized.");
        window.VanillaTilt.init(document.querySelectorAll(".glass-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.4,
            gyroscope: true,
            perspective: 1000,
            scale: 1.02
        });
    } else {
        console.warn("VanillaTilt not found.");
    }
}



function setupScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Initial state
    gsap.set(".glass-card", { opacity: 0, y: 50 });

    const panels = gsap.utils.toArray(".panel");

    panels.forEach(panel => {
        const card = panel.querySelector(".glass-card");
        gsap.to(card, {
            scrollTrigger: {
                trigger: panel,
                start: "top center",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // --- Master Scroll Timeline (Camera Path) ---
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5 // Smooth scrubbing
        }
    });

    if (character) {
        // Phase 1: Home to What I Do (Profile Shift)
        tl.to(camera.position, { x: 5, y: 10, z: 20 }, 0)
          .to(character.rotation, { y: 1.57 }, 0) // Rotate to profile
          .to(character.position, { x: -4 }, 0); // Shift character left

        // Phase 2: What I Do to Skills (Wide Orbit)
        tl.to(camera.position, { x: 0, y: 15, z: 35 }, 0.3)
          .to(character.rotation, { y: 0 }, 0.3) // Rotate back to front
          .to(character.position, { x: 0, y: 2 }, 0.3);

        // Phase 3: Skills to Projects (Monitor Zoom)
        tl.to(camera.position, { x: -2, y: 11, z: 8 }, 0.6) // Zoom in over shoulder
          .to(camera.rotation, { x: -0.2 }, 0.6);

        // Phase 4: Final Pan (Contact)
        tl.to(camera.position, { x: 10, y: 15, z: 30 }, 0.9)
          .to(character.rotation, { y: -0.5 }, 0.9);
    }

    // --- Section Appearance Animations ---
    const sections = ["#home", "#what-i-do", "#skills", "#journey", "#projects", "#contact"];
    sections.forEach(id => {
        gsap.to(`${id} .glass-card`, {
            scrollTrigger: {
                trigger: id,
                start: "top center",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out"
        });
    });
}


// --- Background Decor ---
function updateLightingToNeon() {
    // Add strong neon pink lights for the theme
    const pinkRim = new THREE.DirectionalLight(0xff00ff, 5);
    pinkRim.position.set(-10, 5, 0);
    scene.add(pinkRim);

    const screenGlow = new THREE.PointLight(0x00ffff, 10, 20); // Cyan glow for contrast
    screenGlow.position.set(0, 5, 0);
    scene.add(screenGlow);
}

const decorElements = [];
const networkGroup = new THREE.Group();

function createBackgroundDecor() {
    const geometrySph = new THREE.SphereGeometry(0.1, 16, 16);
    const geometryCub = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const materialMat = new THREE.MeshStandardMaterial({ 
        color: 0x818cf8, 
        transparent: true, 
        opacity: 0.3,
        emissive: 0x818cf8,
        emissiveIntensity: 0.5
    });

    // Floating Geometries
    for (let i = 0; i < 30; i++) {
        const mesh = new THREE.Mesh(Math.random() > 0.5 ? geometrySph : geometryCub, materialMat);
        mesh.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 30 - 10
        );
        mesh.userData.velocity = {
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        };
        mesh.userData.rotation = (Math.random() - 0.5) * 0.02;
        scene.add(mesh);
        decorElements.push(mesh);
    }

    // Neural Network Nodes
    const nodes = [];
    const nodeCount = 20;
    for (let i = 0; i < nodeCount; i++) {
        const node = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0x818cf8 })
        );
        node.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15 + 10,
            (Math.random() - 0.5) * 10 - 5
        );
        node.userData.basePos = node.position.clone();
        node.userData.phase = Math.random() * Math.PI * 2;
        nodes.push(node);
        networkGroup.add(node);
    }

    // Connecting Lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.15 });
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            if (nodes[i].position.distanceTo(nodes[j].position) < 5) {
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
                const line = new THREE.Line(lineGeometry, lineMaterial);
                line.userData.fromNode = nodes[i];
                line.userData.toNode = nodes[j];
                networkGroup.add(line);
            }
        }
    }
    scene.add(networkGroup);
    createStarfield();
}

function createStarfield() {
    const vertices = [];
    for (let i = 0; i < 2000; i++) {
        const x = THREE.MathUtils.randFloatSpread(100);
        const y = THREE.MathUtils.randFloatSpread(100);
        const z = THREE.MathUtils.randFloatSpread(100);
        vertices.push(x, y, z);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.05, transparent: true, opacity: 0.5 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
}


// --- 3D Bouncing Tech Stack ---
const techStack = [
    "Python", "C", "C++", "Java", "Javascript", "HTML5", "AWS", "Azure", 
    "Django", "FastAPI", "Flask", "React", "Node.js", "MongoDB", "MySQL", 
    "Numpy", "Pandas", "Tensorflow", "Docker", "Git", "Github", "Power BI",
    "Framework7", "Jinja", "Powershell", "R", "Oracle", "Render", "Vercel", "Cisco"
];


const techBalls = [];
const BALL_RADIUS = 0.8;
const BOUNDS = 15;

function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;
    
    // Background circle
    ctx.fillStyle = 'rgba(129, 140, 248, 0.05)';
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Outfit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 64);
    
    return new THREE.CanvasTexture(canvas);
}


function createTechBalls() {
    const ballGroup = new THREE.Group();
    const sphereGeometry = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);

    techStack.forEach((tech, i) => {
        const material = new THREE.MeshPhongMaterial({
            map: createTextTexture(tech),
            transparent: true,
            opacity: 0.9,
            shininess: 100
        });

        const ball = new THREE.Mesh(sphereGeometry, material);
        
        // Random starting positions
        ball.position.set(
            THREE.MathUtils.randFloatSpread(BOUNDS),
            THREE.MathUtils.randFloat(5, 15),
            THREE.MathUtils.randFloatSpread(BOUNDS)
        );

        // Random velocities
        const vel = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(0.2),
            THREE.MathUtils.randFloatSpread(0.2),
            THREE.MathUtils.randFloatSpread(0.2)
        );

        techBalls.push({ mesh: ball, vel });
        ballGroup.add(ball);
    });

    scene.add(ballGroup);
}

function updateTechBalls() {
    techBalls.forEach(ball => {
        ball.mesh.position.add(ball.vel);

        // Bounce off walls
        if (Math.abs(ball.mesh.position.x) > BOUNDS) ball.vel.x *= -1;
        if (ball.mesh.position.y < 0 || ball.mesh.position.y > 20) ball.vel.y *= -1;
        if (Math.abs(ball.mesh.position.z) > BOUNDS) ball.vel.z *= -1;

        // Subtle rotation
        ball.mesh.rotation.x += 0.01;
        ball.mesh.rotation.y += 0.01;
    });
}

// --- Interaction ---

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Render Loop ---
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    // Subtle head tracking
    if (headBone) {
        const targetX = mouseX * 0.5;
        const targetY = mouseY * 0.5;
        headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetX, 0.1);
        headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, targetY, 0.1);
    }

    // --- Animate Decor ---
    const time = Date.now() * 0.001;
    decorElements.forEach(mesh => {
        mesh.position.x += mesh.userData.velocity.x;
        mesh.position.y += mesh.userData.velocity.y;
        mesh.position.z += mesh.userData.velocity.z;
        mesh.rotation.x += mesh.userData.rotation;
        mesh.rotation.y += mesh.userData.rotation;

        // Wrap around bounds
        if (Math.abs(mesh.position.x) > 25) mesh.position.x *= -0.95;
        if (Math.abs(mesh.position.y) > 25) mesh.position.y *= -0.95;
    });

    // --- Animate Network ---
    networkGroup.children.forEach(child => {
        if (child.isMesh) {
            child.position.y = child.userData.basePos.y + Math.sin(time + child.userData.phase) * 0.5;
        } else if (child.isLine) {
            const positions = child.geometry.attributes.position.array;
            const from = child.userData.fromNode.position;
            const to = child.userData.toNode.position;
            positions[0] = from.x; positions[1] = from.y; positions[2] = from.z;
            positions[3] = to.x; positions[4] = to.y; positions[5] = to.z;
            child.geometry.attributes.position.needsUpdate = true;
        }
    });

    updateTechBalls();

    // Ensure camera always looks at the character's upper body during scroll
    if (character) {
        camera.lookAt(0, 14 * 0.55, 0); 
    }

    renderer.render(scene, camera);
}

// Start Scene
init();
animate();


// --- Emergency Fail-safe ---
setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        console.log("Emergency loader removal triggered.");
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 1000);
    }
}, 6000);

