// Data 5 Halaman / Spesies Bioluminesens Laut Dalam
const seaPages = {
    abyss: {
        depth: "KEDALAMAN: 1.200M",
        glowType: "SIMBIOSIS CAHAYA",
        title: "Taman Bioluminesens",
        latin: "Bathypelagic Flora & Fauna",
        desc: "Di bawah zona senja samudra, organisme menghasilkan pendar turquoise dan violet melalui reaksi luciferin untuk berkomunikasi dan menarik mangsa.",
        spectrum: "Turquoise & Violet",
        motion: "Denyut Arus Pelagis",
        shapeType: "jelly",
        bellColor: 0x2dd4bf,
        emissiveColor: 0x0d9488,
        tentacleColor: 0xc084fc,
        bellRadius: 1.35,
        tentacleCount: 14
    },
    aurelia: {
        depth: "KEDALAMAN: 850M",
        glowType: "PENDAR MUTIARA",
        title: "Moon Jelly",
        latin: "Aurelia aurita abyssal",
        desc: "Memiliki kubah transparan seperti kaca mutiara dengan empat cincin organ bercahaya di bagian tengah yang berdenyut selaras dengan arus air.",
        spectrum: "Putih Mutiara & Cyan",
        motion: "Kontraksi Kubah Ritmis",
        shapeType: "jelly",
        bellColor: 0xf0f9ff,
        emissiveColor: 0x38bdf8,
        tentacleColor: 0x2dd4bf,
        bellRadius: 1.5,
        tentacleCount: 18
    },
    anemone: {
        depth: "KEDALAMAN: 2.100M",
        glowType: "UJUNG FLUORESENS",
        title: "Crystal Anemone",
        latin: "Actiniaria biolumina",
        desc: "Menyerupai bunga mekar di dasar palung dengan puluhan tentakel lentur yang ujungnya menyala terang bagai kristal neon saat tersentuh arus.",
        spectrum: "Turquoise Terang",
        motion: "Lambaian Radial",
        shapeType: "anemone",
        bellColor: 0x0f766e,
        emissiveColor: 0x2dd4bf,
        tentacleColor: 0xf0f9ff,
        bellRadius: 1.1,
        tentacleCount: 24
    },
    gorgonian: {
        depth: "KEDALAMAN: 1.650M",
        glowType: "GELOMBANG VIOLET",
        title: "Violet Sea Fan",
        latin: "Gorgonia violacea",
        desc: "Koloni polip bercabang menyerupai kipas sutra bawah laut yang memancarkan gelombang cahaya ungu lembut dari pangkal hingga ujung rantingnya.",
        spectrum: "Violet & Magenta Lembut",
        motion: "Ayunan Kipas Halus",
        shapeType: "coral",
        bellColor: 0xc084fc,
        emissiveColor: 0x7e22ce,
        tentacleColor: 0x2dd4bf,
        bellRadius: 1.25,
        tentacleCount: 16
    },
    atolla: {
        depth: "KEDALAMAN: 3.000M",
        glowType: "CINCIN ALARM",
        title: "Atolla Crown",
        latin: "Atolla wyvillei",
        desc: "Dikenal sebagai ubur-ubur mahkota laut dalam dengan lekukan mahkota bergerigi dan satu tentakel panjang pengintai yang berkilau bak permata.",
        spectrum: "Violet & Putih Kristal",
        motion: "Rotasi Mahkota",
        shapeType: "jelly",
        bellColor: 0xe879f9,
        emissiveColor: 0x2dd4bf,
        tentacleColor: 0xf0f9ff,
        bellRadius: 1.2,
        tentacleCount: 12
    }
};

const pageKeys = Object.keys(seaPages);
let currentPageIndex = 0;
let currentSpeedMultiplier = 1.0;

// Setup Scene, Camera, Renderer
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020617, 0.05);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.8, 7.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3.5;
controls.maxDistance = 13;

// Pencahayaan Bawah Laut
const ambientLight = new THREE.AmbientLight(0x0f766e, 0.8);
scene.add(ambientLight);

const topCyanLight = new THREE.PointLight(0x2dd4bf, 2.2, 20);
topCyanLight.position.set(2, 5, 3);
scene.add(topCyanLight);

const sideVioletLight = new THREE.PointLight(0xc084fc, 2.4, 18);
sideVioletLight.position.set(-4, -1, 3);
scene.add(sideVioletLight);

const pearlCoreLight = new THREE.PointLight(0xf0f9ff, 1.5, 12);
pearlCoreLight.position.set(0, 0, 0);
scene.add(pearlCoreLight);

// Grup Utama Organisme 3D
const organismGroup = new THREE.Group();
scene.add(organismGroup);

let domeMesh = null;
let tentacles = [];

// Membangun Organisme Bioluminesens 3D
function buildOrganism(config) {
    while (organismGroup.children.length > 0) {
        organismGroup.remove(organismGroup.children[0]);
    }
    tentacles = [];
    domeMesh = null;

    // 1. Kubah / Kelopak Utama (Dome atau Base Anemone)
    const domePoints = [];
    if (config.shapeType === "anemone") {
        // Bentuk kelopak mangkuk terbuka menghadap ke atas
        for (let i = 0; i <= 12; i++) {
            const t = i / 12;
            const radius = 0.35 + Math.sin(t * Math.PI * 0.6) * config.bellRadius;
            const y = (t - 0.5) * 1.1;
            domePoints.push(new THREE.Vector2(radius, y));
        }
    } else {
        // Bentuk kubah ubur-ubur / mahkota melengkung
        for (let i = 0; i <= 14; i++) {
            const t = i / 14;
            const radius = Math.sin(t * Math.PI * 0.58) * config.bellRadius;
            const y = Math.cos(t * Math.PI * 0.55) * 1.25;
            domePoints.push(new THREE.Vector2(radius, y));
        }
    }

    const domeGeo = new THREE.LatheGeometry(domePoints, 32);
    const domeMat = new THREE.MeshPhysicalMaterial({
        color: config.bellColor,
        emissive: config.emissiveColor,
        emissiveIntensity: 0.55,
        roughness: 0.15,
        transmission: 0.45,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide
    });

    domeMesh = new THREE.Mesh(domeGeo, domeMat);
    organismGroup.add(domeMesh);

    // 2. Inti Cahaya Dalam (Bioluminescent Core)
    const coreGeo = new THREE.SphereGeometry(0.35, 20, 20);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0xf0f9ff,
        transparent: true,
        opacity: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = config.shapeType === "anemone" ? 0.1 : 0.45;
    organismGroup.add(coreMesh);

    // 3. Tentakel / Sulur Karang Bercahaya
    const tentacleMat = new THREE.MeshStandardMaterial({
        color: config.tentacleColor,
        emissive: config.tentacleColor,
        emissiveIntensity: 0.7,
        roughness: 0.3
    });

    const tipGeo = new THREE.SphereGeometry(0.055, 10, 10);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0xf0f9ff });

    for (let i = 0; i < config.tentacleCount; i++) {
        const angle = (i / config.tentacleCount) * Math.PI * 2;
        const ringRadius = config.bellRadius * (config.shapeType === "coral" ? 0.5 : 0.78);

        const curvePoints = [];
        const length = 2.2 + (i % 3) * 0.45;

        for (let j = 0; j <= 6; j++) {
            const frac = j / 6;
            if (config.shapeType === "anemone" || config.shapeType === "coral") {
                // Menjulur mekar ke atas & samping
                const r = ringRadius * 0.5 + frac * 1.1;
                const y = frac * length * 0.85;
                curvePoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
            } else {
                // Menggantung lembut ke bawah
                const r = ringRadius + Math.sin(frac * Math.PI) * 0.2;
                const y = 0.15 - frac * length;
                curvePoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
            }
        }

        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 18, 0.025, 6, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, tentacleMat);

        // Titik cahaya mutiara di ujung tentakel
        const tipPoint = curvePoints[curvePoints.length - 1];
        const tipMesh = new THREE.Mesh(tipGeo, tipMat);
        tipMesh.position.copy(tipPoint);

        const tentacleHolder = new THREE.Group();
        tentacleHolder.add(tubeMesh);
        tentacleHolder.add(tipMesh);

        organismGroup.add(tentacleHolder);
        tentacles.push({ mesh: tentacleHolder, phase: i * 0.45 });
    }
}

// 4. Partikel Plankton & Gelembung Bioluminesens
const planktonCount = 240;
const planktonGeo = new THREE.BufferGeometry();
const planktonPos = new Float32Array(planktonCount * 3);
const planktonCol = new Float32Array(planktonCount * 3);

const cTurquoise = new THREE.Color(0x2dd4bf);
const cViolet = new THREE.Color(0xc084fc);
const cPearl = new THREE.Color(0xf0f9ff);

for (let i = 0; i < planktonCount; i++) {
    planktonPos[i * 3] = (Math.random() - 0.5) * 16;
    planktonPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    planktonPos[i * 3 + 2] = (Math.random() - 0.5) * 16;

    const pick = i % 3 === 0 ? cTurquoise : (i % 3 === 1 ? cViolet : cPearl);
    planktonCol[i * 3] = pick.r;
    planktonCol[i * 3 + 1] = pick.g;
    planktonCol[i * 3 + 2] = pick.b;
}

planktonGeo.setAttribute('position', new THREE.BufferAttribute(planktonPos, 3));
planktonGeo.setAttribute('color', new THREE.BufferAttribute(planktonCol, 3));

const planktonMat = new THREE.PointsMaterial({
    size: 0.085,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
});

const planktonSystem = new THREE.Points(planktonGeo, planktonMat);
scene.add(planktonSystem);

// Navigasi Antar Halaman Spesies
function loadPage(pageKey) {
    const data = seaPages[pageKey];
    if (!data) return;

    currentPageIndex = pageKeys.indexOf(pageKey);

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === pageKey);
    });

    const card = document.getElementById('info-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(12px)';

    setTimeout(() => {
        document.getElementById('page-depth').textContent = data.depth;
        document.getElementById('page-glow-type').textContent = data.glowType;
        document.getElementById('page-title').textContent = data.title;
        document.getElementById('page-latin').textContent = data.latin;
        document.getElementById('page-desc').textContent = data.desc;
        document.getElementById('page-specs').innerHTML = `
            <div class="spec-item">
                <span class="spec-label">Spektrum Cahaya</span>
                <span class="spec-value">${data.spectrum}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Pola Gerak</span>
                <span class="spec-value">${data.motion}</span>
            </div>
        `;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 200);

    buildOrganism(data);
}

function nextPage() {
    const nextIdx = (currentPageIndex + 1) % pageKeys.length;
    loadPage(pageKeys[nextIdx]);
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => loadPage(btn.dataset.page));
});

// Toggle Kecepatan Arus Laut
document.getElementById('toggle-pulse').addEventListener('click', function () {
    if (currentSpeedMultiplier === 1.0) {
        currentSpeedMultiplier = 2.4;
        this.textContent = "Mode Arus: Deras";
    } else {
        currentSpeedMultiplier = 1.0;
        this.textContent = "Mode Arus: Tenang";
    }
});

// Loop Animasi Bawah Laut
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime() * currentSpeedMultiplier;

    // Gerakan melayang organik (mengapung naik-turun)
    organismGroup.position.y = Math.sin(t * 1.1) * 0.25;
    organismGroup.rotation.y += 0.004 * currentSpeedMultiplier;

    // Denyut kontraksi kubah
    if (domeMesh) {
        const pulseScale = 1 + Math.sin(t * 2.2) * 0.06;
        domeMesh.scale.set(pulseScale, 1 - Math.sin(t * 2.2) * 0.05, pulseScale);
    }

    // Lambaian tentakel mengikuti gelombang sinus
    tentacles.forEach(item => {
        item.mesh.rotation.z = Math.sin(t * 1.8 + item.phase) * 0.09;
        item.mesh.rotation.x = Math.cos(t * 1.5 + item.phase) * 0.07;
    });

    // Plankton melayang perlahan ke atas seperti gelembung mikro
    planktonSystem.rotation.y = t * 0.03;
    planktonSystem.position.y = Math.sin(t * 0.4) * 0.35;

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Jalankan halaman pertama
loadPage('abyss');
animate();
