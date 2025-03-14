const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const blockSize = 1;
const worldWidth = 10;
const worldHeight = 10;
const blocks = [];

function generateWorld() {
  for (let x = 0; x < worldWidth; x++) {
    for (let y = 0; y < worldHeight; y++) {
      const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const block = new THREE.Mesh(geometry, material);
      block.position.set(x - worldWidth / 2, y - worldHeight / 2, 0);
      scene.add(block);
      blocks.push(block);
    }
  }
}

generateWorld();

camera.position.z = 5;

let isMining = false;

function onMouseClick(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(blocks);

  if (intersects.length > 0) {
    const block = intersects[0].object;
    if (isMining) {
      scene.remove(block); // Mine the block
    } else {
      const newBlock = new THREE.Mesh(new THREE.BoxGeometry(blockSize, blockSize, blockSize), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
      newBlock.position.copy(block.position);
      scene.add(newBlock); // Place a new block
    }
  }
}

document.addEventListener('click', onMouseClick);

document.addEventListener('keydown', (event) => {
  if (event.key === 'm') {
    isMining = !isMining; // Toggle mining mode on/off
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
