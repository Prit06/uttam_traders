/* ==========================================================================
   UTTAM TRADERS - Three.js TMT Steel Bundle 3D Model
   Interactive 3D Steel Rebar Bundle for TMT Sizes Section
   ========================================================================== */

(function () {
  'use strict';

  let scene, camera, renderer, tmtGroup;
  let mouseX = 0, mouseY = 0;
  let isVisible = true;

  function startTMT() {
    const container = document.getElementById('tmt-canvas');
    if (!container || typeof THREE === 'undefined') return;

    try {
      init(container);
      animate();
    } catch (e) {
      console.warn('Three.js TMT Scene init error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTMT);
  } else {
    startTMT();
  }

  function init(container) {
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090d16, 0.05);

    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const blueLight = new THREE.DirectionalLight(0x3b82f6, 3);
    blueLight.position.set(5, 5, 5);
    scene.add(blueLight);

    const redLight = new THREE.PointLight(0xE63C23, 3, 10);
    redLight.position.set(-5, -2, 3);
    scene.add(redLight);

    // Bundle creation
    tmtGroup = new THREE.Group();
    scene.add(tmtGroup);

    const steelTex = createSteelTex();

    // Create 19 steel bars arranged in hexagonal cylinder formation
    const barRadius = 0.12;
    const barLen = 5.0;

    const barGeo = new THREE.CylinderGeometry(barRadius, barRadius, barLen, 16);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.9,
      roughness: 0.3,
      map: steelTex
    });

    // Center bar
    const centerBar = new THREE.Mesh(barGeo, barMat);
    centerBar.castShadow = true;
    tmtGroup.add(centerBar);

    // Outer rings
    for (let r = 1; r <= 2; r++) {
      const radiusStep = r * 0.28;
      const numBars = r * 6;
      for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * Math.PI * 2;
        const mesh = new THREE.Mesh(barGeo, barMat);
        mesh.position.set(
          Math.cos(angle) * radiusStep,
          0,
          Math.sin(angle) * radiusStep
        );
        mesh.castShadow = true;
        tmtGroup.add(mesh);
      }
    }

    // Steel Straps (Brand Red straps holding bundle)
    const strapGeo = new THREE.TorusGeometry(0.72, 0.04, 12, 32);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0xE63C23, metalness: 0.95, roughness: 0.1 });

    const s1 = new THREE.Mesh(strapGeo, strapMat);
    s1.position.y = 1.4;
    s1.rotation.x = Math.PI / 2;
    tmtGroup.add(s1);

    const s2 = new THREE.Mesh(strapGeo, strapMat);
    s2.position.y = -1.4;
    s2.rotation.x = Math.PI / 2;
    tmtGroup.add(s2);

    // Tilt bundle horizontally
    tmtGroup.rotation.z = Math.PI / 4;
    tmtGroup.rotation.x = 0.4;

    // Setup Shared Resize Observer
    if (window.setupThreeResizeObserver) {
      window.setupThreeResizeObserver(renderer, camera, container, (w, h) => {
        if (camera) {
          if (w < 500) {
            camera.position.set(0, 0, 8.5);
          } else {
            camera.position.set(0, 0, 7);
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

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) * 0.002;
      mouseY = (e.clientY - rect.top - rect.height / 2) * 0.002;
    });

    container.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = (touch.clientX - rect.left - rect.width / 2) * 0.003;
        mouseY = (touch.clientY - rect.top - rect.height / 2) * 0.003;
      }
    }, { passive: true });
  }

  function createSteelTex() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 64, 64);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;

    for (let i = 0; i < 64; i += 12) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(64, i + 8);
      ctx.stroke();
    }
    return new THREE.CanvasTexture(canvas);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible || document.hidden) return;

    if (tmtGroup) {
      tmtGroup.rotation.y += 0.008;
      tmtGroup.rotation.x = 0.4 + mouseY;
    }

    renderer.render(scene, camera);
  }
})();

