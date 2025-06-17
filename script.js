// Efeito de partículas no hero
function createParticles() {
  const container = document.getElementById('particles');
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Tamanho aleatório
    const size = Math.random() * 20 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Posição aleatória
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;

    // Atraso na animação
    particle.style.animationDelay = `${Math.random() * 15}s`;

    container.appendChild(particle);
  }
}

// Visualizador 3D com Three.js
function init3DViewer() {
  const container = document.getElementById('viewer3D');

  // Cena
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1b2a);

  // Câmera
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  // Renderizador
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Luzes
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  // Criar um carro simples (seria substituído por um modelo real)
  function createCarModel() {
    const group = new THREE.Group();

    // Corpo do carro
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);

    // Teto
    const roofGeometry = new THREE.BoxGeometry(1.2, 0.5, 0.9);
    const roofMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 0.5;
    group.add(roof);

    // Rodas
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
    wheelGeometry.rotateZ(Math.PI / 2);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

    const wheelPositions = [
      { x: 0.7, y: -0.4, z: 0.5 },
      { x: -0.7, y: -0.4, z: 0.5 },
      { x: 0.7, y: -0.4, z: -0.5 },
      { x: -0.7, y: -0.4, z: -0.5 }
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos.x, pos.y, pos.z);
      group.add(wheel);
    });

    return group;
  }

  // Adicionar o carro à cena
  const car = createCarModel();
  scene.add(car);

  // Controles de órbita
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Rotação automática
  let autoRotate = true;

  // Botão de rotação
  document.getElementById('rotateBtn').addEventListener('click', () => {
    autoRotate = !autoRotate;
  });

  // Botões de zoom
  document.getElementById('zoomInBtn').addEventListener('click', () => {
    camera.position.z -= 0.5;
  });

  document.getElementById('zoomOutBtn').addEventListener('click', () => {
    camera.position.z += 0.5;
  });

  // Botão de mudar cor
  document.getElementById('changeColorBtn').addEventListener('click', () => {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    car.traverse(child => {
      if (child.isMesh && child.material.color) {
        child.material.color.set(randomColor);
      }
    });
  });

  // Selecionar modelo de carro
  const carOptions = document.querySelectorAll('.car-option');
  carOptions.forEach(option => {
    option.addEventListener('click', function() {
      carOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');

      // Aqui normalmente carregaríamos um modelo diferente
      // Para este exemplo, apenas mudamos a cor
      const colors = [0xff4136, 0x0074d9, 0x2ecc40, 0xffdc00];
      const colorIndex = Array.from(carOptions).indexOf(this);
      const newColor = colors[colorIndex];

      car.traverse(child => {
        if (child.isMesh && child.material.color) {
          child.material.color.set(newColor);
        }
      });
    });
  });

  // Animação
  function animate() {
    requestAnimationFrame(animate);

    if (autoRotate) {
      car.rotation.y += 0.01;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  // Redimensionar
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  animate();
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  init3DViewer();

  // Suavizar rolagem
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Mudar navbar ao rolar
  window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
      nav.style.background = 'rgba(13, 27, 42, 0.98)';
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
    } else {
      nav.style.background = 'rgba(13, 27, 42, 0.95)';
      nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    }
  });
});
