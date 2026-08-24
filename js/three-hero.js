/* ==========================================================================
   UTTAM TRADERS - Three.js 3D Hero Scene
   Cinematic Construction Material Render: Cement Bags, TMT Bars, Steel Rods
   ========================================================================== */

(function () {
  'use strict';

  let scene, camera, renderer;
  let cementBagsGroup, tmtBundleGroup, steelRodsGroup, concreteGroup, particles;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  function startHero() {
    const container = document.getElementById('hero-canvas');
    if (!container || typeof THREE === 'undefined') return;

    try {
      init(container);
      animate();
    } catch (e) {
      console.warn('Three.js Hero Scene init error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startHero);
  } else {
    startHero();
  }

  function init(container) {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090d16, 0.035);

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 11);

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const redSpotLight = new THREE.SpotLight(0xE63C23, 4.0);
    redSpotLight.position.set(10, 15, 10);
    redSpotLight.castShadow = true;
    redSpotLight.shadow.mapSize.width = 1024;
    redSpotLight.shadow.mapSize.height = 1024;
    scene.add(redSpotLight);

    const steelDirectional = new THREE.DirectionalLight(0x60a5fa, 2.0);
    steelDirectional.position.set(-10, 8, -5);
    scene.add(steelDirectional);

    const fillWarmLight = new THREE.PointLight(0x512C1A, 2.5, 15);
    fillWarmLight.position.set(0, -2, 4);
    scene.add(fillWarmLight);

    // 5. Create Procedural Textures
    const cementTexture = createCementBagTexture();
    const steelTexture = createSteelTexture();

    // 6. Build 3D Models
    // Container group for main rotating hero setup
    const mainHeroGroup = new THREE.Group();
    mainHeroGroup.position.set(2.8, -0.5, 0); // Position to right side on desktop
    scene.add(mainHeroGroup);

    // Platform ground
    const platformGeo = new THREE.CylinderGeometry(4.5, 5, 0.4, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.2
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -2;
    platform.receiveShadow = true;
    mainHeroGroup.add(platform);

    // A. Cement Bags
    cementBagsGroup = new THREE.Group();
    
    // Cement Bag Geometry (Rounded Box simulation)
    const bagGeo = new THREE.BoxGeometry(1.6, 2.2, 0.75, 4, 4, 4);
    // Deform geometry slightly for bag effect
    const pos = bagGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      // bulge center
      if (Math.abs(y) < 0.8) {
        z *= 1.15;
        x *= 1.08;
      }
      pos.setXYZ(i, x, y, z);
    }
    bagGeo.computeVertexNormals();

    const bagMat = new THREE.MeshStandardMaterial({
      map: cementTexture,
      roughness: 0.85,
      bumpScale: 0.05
    });

    // Cement Bag 1 (Standing)
    const bag1 = new THREE.Mesh(bagGeo, bagMat);
    bag1.position.set(-1.2, -0.7, 0.5);
    bag1.rotation.set(0.1, 0.4, -0.05);
    bag1.castShadow = true;
    bag1.receiveShadow = true;
    cementBagsGroup.add(bag1);

    // Cement Bag 2 (Leaning)
    const bag2 = new THREE.Mesh(bagGeo, bagMat);
    bag2.position.set(-0.2, -0.7, -0.2);
    bag2.rotation.set(-0.15, -0.5, 0.1);
    bag2.castShadow = true;
    bag2.receiveShadow = true;
    cementBagsGroup.add(bag2);

    // Cement Bag 3 (Flat/Stack)
    const bag3 = new THREE.Mesh(bagGeo, bagMat);
    bag3.position.set(-0.8, -1.6, 1.2);
    bag3.rotation.set(-Math.PI / 2 + 0.1, 0, 0.5);
    bag3.castShadow = true;
    bag3.receiveShadow = true;
    cementBagsGroup.add(bag3);

    mainHeroGroup.add(cementBagsGroup);

    // B. Bundles of TMT Steel Bars
    tmtBundleGroup = new THREE.Group();
    const barCount = 14;
    const barRadius = 0.08;
    const barLength = 5.5;

    const barGeo = new THREE.CylinderGeometry(barRadius, barRadius, barLength, 16);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.85,
      roughness: 0.35,
      map: steelTexture
    });

    // Ribbed rings details on TMT
    for (let i = 0; i < barCount; i++) {
      const bar = new THREE.Mesh(barGeo, barMat);
      const angle = (i / barCount) * Math.PI * 2;
      const r = 0.35 + Math.random() * 0.05;
      bar.position.set(
        Math.cos(angle) * r,
        0,
        Math.sin(angle) * r
      );
      bar.rotation.z = Math.PI / 2 - 0.2;
      bar.rotation.y = 0.3;
      bar.castShadow = true;
      bar.receiveShadow = true;
      tmtBundleGroup.add(bar);
    }

    // Tie Wire Ring
    const tieGeo = new THREE.TorusGeometry(0.5, 0.03, 8, 24);
    const tieMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
    
    const tie1 = new THREE.Mesh(tieGeo, tieMat);
    tie1.position.set(1.5, 0, 0);
    tie1.rotation.y = Math.PI / 2;
    tmtBundleGroup.add(tie1);

    const tie2 = new THREE.Mesh(tieGeo, tieMat);
    tie2.position.set(-1.5, 0, 0);
    tie2.rotation.y = Math.PI / 2;
    tmtBundleGroup.add(tie2);

    tmtBundleGroup.position.set(1.2, -0.6, 0.4);
    tmtBundleGroup.rotation.set(0.2, -0.4, 0.1);
    mainHeroGroup.add(tmtBundleGroup);

    // C. Concrete blocks
    concreteGroup = new THREE.Group();
    const blockGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.9,
      metalness: 0.1
    });

    for (let b = 0; b < 3; b++) {
      const block = new THREE.Mesh(blockGeo, blockMat);
      block.position.set(-1.8 + b * 0.8, -1.5, -1.2 + b * 0.3);
      block.rotation.set(Math.random() * 0.2, Math.random() * 0.5, 0);
      block.castShadow = true;
      concreteGroup.add(block);
    }
    mainHeroGroup.add(concreteGroup);

    // E. Floating 3D Animated Logo Emblem Badge
    const logoTextureLoader = new THREE.TextureLoader();
    logoTextureLoader.load('images/logo.png', function(logoTex) {
      const logoGroup = new THREE.Group();
      logoGroup.position.set(0, 2.2, 0.2);

      // Back metallic plate (Mahogany / Dark Bronze)
      const plateBackGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.12, 32);
      const plateBackMat = new THREE.MeshStandardMaterial({
        color: 0x512C1A,
        metalness: 0.85,
        roughness: 0.25
      });
      const plateBack = new THREE.Mesh(plateBackGeo, plateBackMat);
      plateBack.rotation.x = Math.PI / 2;
      logoGroup.add(plateBack);

      // Front Logo Texture Mesh
      const logoFrontGeo = new THREE.PlaneGeometry(2.4, 1.5);
      const logoFrontMat = new THREE.MeshStandardMaterial({
        map: logoTex,
        transparent: true,
        alphaTest: 0.05,
        side: THREE.DoubleSide
      });
      const logoFront = new THREE.Mesh(logoFrontGeo, logoFrontMat);
      logoFront.position.z = 0.08;
      logoGroup.add(logoFront);

      // Outer Glowing Ring (Brand Red #E63C23)
      const ringGeo = new THREE.TorusGeometry(1.65, 0.05, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xE63C23,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xE63C23,
        emissiveIntensity: 0.6
      });
      const glowingRing = new THREE.Mesh(ringGeo, ringMat);
      glowingRing.rotation.x = Math.PI / 2;
      logoGroup.add(glowingRing);

      mainHeroGroup.add(logoGroup);
      mainHeroGroup.userData.logoGroup = logoGroup;
    });

    // D. Particles floating in background
    createFloatingParticles();

    // Event Listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    // Adjust for mobile screens
    if (window.innerWidth < 992) {
      mainHeroGroup.position.set(0, -1.8, -2);
    }
  }

  // Create procedural canvas texture for Cement Bags matching brand logo
  function createCementBagTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Kraft paper background
    ctx.fillStyle = '#b49673';
    ctx.fillRect(0, 0, 512, 512);

    // Noise/texture lines
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 10, Math.random() * 2);
    }

    // Outer border matching logo red
    ctx.strokeStyle = '#E63C23';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 472, 472);

    // Brand Header Badge (Mahogany / Dark Bronze)
    ctx.fillStyle = '#512C1A';
    ctx.fillRect(30, 40, 452, 105);

    // Text: UTTAM TRADERS
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UTTAM TRADERS', 256, 95);
    ctx.fillStyle = '#FFB800';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('STEEL & CEMENT', 256, 128);

    // Red Seal Circle
    ctx.beginPath();
    ctx.arc(256, 260, 80, 0, Math.PI * 2);
    ctx.fillStyle = '#E63C23';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('53 GRADE', 256, 255);
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('OPC / PPC', 256, 285);

    // Weight Text
    ctx.fillStyle = '#361C10';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText('NET WT. 50 KG', 256, 410);

    ctx.fillStyle = '#512C1A';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('GONDAL, GUJARAT 360311', 256, 445);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Create procedural texture for Ribbed Steel Bars
  function createSteelTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 128, 128);

    // Rib pattern lines
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 6;
    for (let y = 0; y < 128; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(128, y + 10);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }

  // Particle System
  function createFloatingParticles() {
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xE63C23,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
  }

  function onWindowResize() {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Adjust position on screen resize
    const mainHeroGroup = scene.children.find(c => c.type === 'Group');
    if (mainHeroGroup) {
      if (window.innerWidth < 992) {
        mainHeroGroup.position.set(0, -1.8, -2);
      } else {
        mainHeroGroup.position.set(2.8, -0.5, 0);
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    // Smooth camera / group rotation based on mouse
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    if (cementBagsGroup && tmtBundleGroup) {
      cementBagsGroup.rotation.y += 0.004;
      tmtBundleGroup.rotation.y += 0.003;
    }

    const mainHeroGroup = scene.children.find(c => c.type === 'Group');
    if (mainHeroGroup && mainHeroGroup.userData.logoGroup) {
      const t = Date.now() * 0.0015;
      mainHeroGroup.userData.logoGroup.rotation.y = Math.sin(t * 0.5) * 0.35;
      mainHeroGroup.userData.logoGroup.position.y = 2.2 + Math.sin(t * 1.5) * 0.15;
    }

    if (particles) {
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
    }

    camera.position.x += (targetX * 3 - camera.position.x) * 0.05;
    camera.position.y += (-targetY * 3 + 2.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
})();
