/* ==========================================================================
   UTTAM TRADERS - Three.js Interactive Cement Showcase Scene
   Interactive 3D Cement Bags (OPC, PPC, PSC) with Raycaster Click Detection
   ========================================================================== */

(function () {
  'use strict';

  let scene, camera, renderer, raycaster, mouse;
  let bagOPC, bagPPC, bagPSC;
  let activeSelectedMesh = null;
  let isVisible = true;

  const CEMENT_DATA = {
    'OPC': {
      title: 'OPC Cement (Ordinary Portland Cement)',
      grade: '53 & 43 Grade',
      desc: 'High-strength cement providing fast setting and high early strength development. Essential for heavy load-bearing structural work, RCC slabs, columns, and bridge foundations.',
      uses: 'RCC Work, Columns, Beams, Pre-cast Concrete, Bridges.',
      benefits: 'High initial compressive strength, fast formwork removal.'
    },
    'PPC': {
      title: 'PPC Cement (Portland Pozzolana Cement)',
      grade: 'Premium Fly-Ash Pozzolana',
      desc: 'Eco-friendly and highly durable cement with superior resistance to chemical attacks, micro-cracking, and moisture seepage. Preferred for residential construction and masonry.',
      uses: 'Residential Houses, Brickwork, Plastering, Foundations, Dams.',
      benefits: 'Superior concrete density, lower heat of hydration, crack resistance.'
    },
    'PSC': {
      title: 'PSC Cement (Portland Slag Cement)',
      grade: 'Blast Furnace Slag Blend',
      desc: 'Formulated with granulated blast furnace slag. Offers outstanding sulphate and chloride resistance, making it ideal for coastal Gujarat regions and subterranean structures.',
      uses: 'Coastal Construction, Underground Water Tanks, Sewerage Works.',
      benefits: 'Maximum corrosion protection, long-term strength gain.'
    }
  };

  function startShowcase() {
    const container = document.getElementById('showcase-canvas');
    if (!container || typeof THREE === 'undefined') return;

    try {
      init(container);
      animate();
    } catch (e) {
      console.warn('Three.js Showcase init error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startShowcase);
  } else {
    startShowcase();
  }

  function init(container) {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.04);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3, 9);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = ''; // clear any prior fallback text
    container.appendChild(renderer.domElement);

    // 4. Raycaster & Mouse
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // 5. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xE63C23, 2.5);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 2, 12);
    blueLight.position.set(-6, 2, -2);
    scene.add(blueLight);

    // 6. Platform
    const platformGeo = new THREE.CylinderGeometry(4.2, 4.5, 0.3, 32);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -1.2;
    platform.receiveShadow = true;
    scene.add(platform);

    // Platform Ring Glow
    const ringGeo = new THREE.RingGeometry(4.2, 4.35, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xE63C23, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.04;
    scene.add(ring);

    // 7. Cement Bags Creation
    bagOPC = createShowcaseBag('OPC 53', '#dc2626', -2.2, -0.2, 0.2);
    bagOPC.name = 'OPC';
    scene.add(bagOPC);

    bagPPC = createShowcaseBag('PPC FLY-ASH', '#2563eb', 0, -0.2, 0.8);
    bagPPC.name = 'PPC';
    scene.add(bagPPC);

    bagPSC = createShowcaseBag('PSC SLAG', '#16a34a', 2.2, -0.2, 0.2);
    bagPSC.name = 'PSC';
    scene.add(bagPSC);

    // 8. Event Listeners
    container.addEventListener('click', onCanvasClick);
    container.addEventListener('mousemove', onCanvasHover);

    // Setup Shared Resize Observer
    if (window.setupThreeResizeObserver) {
      window.setupThreeResizeObserver(renderer, camera, container, (w, h) => {
        if (camera) {
          if (w < 500) {
            camera.position.set(0, 3.4, 12.5);
          } else if (w < 768) {
            camera.position.set(0, 3.2, 10.5);
          } else {
            camera.position.set(0, 3, 9);
          }
        }
      });
    }

    // Visibility Observer
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
        });
      }, { threshold: 0 });
      observer.observe(container);
    }

    // Setup Close Button for Info Panel
    const closeBtn = document.getElementById('panel-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const panel = document.getElementById('showcase-info-panel');
        if (panel) panel.classList.remove('active');
        activeSelectedMesh = null;
      });
    }
  }

  function createShowcaseBag(label, badgeColor, x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Bag mesh
    const bagGeo = new THREE.BoxGeometry(1.4, 2.0, 0.7, 4, 4, 4);
    const pos = bagGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let vx = pos.getX(i);
      let vy = pos.getY(i);
      let vz = pos.getZ(i);
      if (Math.abs(vy) < 0.7) {
        vz *= 1.15;
        vx *= 1.08;
      }
      pos.setXYZ(i, vx, vy, vz);
    }
    bagGeo.computeVertexNormals();

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#b4976c';
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = badgeColor;
    ctx.fillRect(20, 20, 216, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UTTAM', 128, 52);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(label, 128, 80);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('NET 50 KG', 128, 170);

    ctx.strokeStyle = badgeColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 236, 236);

    const texture = new THREE.CanvasTexture(canvas);
    const bagMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8
    });

    const mesh = new THREE.Mesh(bagGeo, bagMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Floating 3D Label Badge Above
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 256;
    labelCanvas.height = 80;
    const lCtx = labelCanvas.getContext('2d');
    
    lCtx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    if (typeof lCtx.roundRect === 'function') {
      lCtx.roundRect(10, 10, 236, 60, 12);
    } else {
      lCtx.rect(10, 10, 236, 60);
    }
    lCtx.fill();
    
    lCtx.strokeStyle = '#f59e0b';
    lCtx.lineWidth = 3;
    lCtx.stroke();

    lCtx.fillStyle = '#f59e0b';
    lCtx.font = 'bold 26px sans-serif';
    lCtx.textAlign = 'center';
    lCtx.fillText(label, 128, 48);

    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelSpriteMat = new THREE.SpriteMaterial({ map: labelTex });
    const sprite = new THREE.Sprite(labelSpriteMat);
    sprite.position.set(0, 1.4, 0);
    sprite.scale.set(1.5, 0.5, 1);
    group.add(sprite);

    return group;
  }

  function onCanvasHover(e) {
    if (!renderer) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([bagOPC, bagPPC, bagPSC], true);

    const container = document.getElementById('showcase-canvas');
    if (intersects.length > 0) {
      if (container) container.style.cursor = 'pointer';
    } else {
      if (container) container.style.cursor = 'default';
    }
  }

  function onCanvasClick(e) {
    if (!renderer) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([bagOPC, bagPPC, bagPSC], true);

    if (intersects.length > 0) {
      let topGroup = intersects[0].object;
      while (topGroup.parent && topGroup.parent !== scene) {
        topGroup = topGroup.parent;
      }
      const typeKey = topGroup.name;
      if (typeKey && CEMENT_DATA[typeKey]) {
        showInfoPanel(CEMENT_DATA[typeKey]);
        activeSelectedMesh = topGroup;
      }
    }
  }

  function showInfoPanel(data) {
    const panel = document.getElementById('showcase-info-panel');
    if (!panel) return;

    document.getElementById('panel-type-title').textContent = data.title;
    document.getElementById('panel-type-grade').textContent = 'Grade: ' + data.grade;
    document.getElementById('panel-type-desc').textContent = data.desc;
    document.getElementById('panel-type-uses').textContent = data.uses;
    document.getElementById('panel-type-benefits').textContent = data.benefits;

    panel.classList.add('active');
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible || document.hidden) return;

    const time = Date.now() * 0.001;

    if (bagOPC) bagOPC.position.y = -0.2 + Math.sin(time * 1.5) * 0.05;
    if (bagPPC) bagPPC.position.y = -0.2 + Math.sin(time * 1.5 + 1) * 0.05;
    if (bagPSC) bagPSC.position.y = -0.2 + Math.sin(time * 1.5 + 2) * 0.05;

    if (scene) scene.rotation.y = Math.sin(time * 0.2) * 0.15;
    if (renderer && scene && camera) renderer.render(scene, camera);
  }
})();

