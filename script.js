// 🌍 Initialisation de la scène Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("scene"),
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🔦 Ajout du fond et de la lumière
scene.background = new THREE.Color(0x222222);
scene.add(new THREE.AmbientLight(0xffffff, 1));

// 📌 Définition des planètes avec textures, couleurs, tailles et vitesses de rotation
const textureLoader = new THREE.TextureLoader();
const planetData = {
  Mercure: {
    texture: textureLoader.load("textures/mercure.jpg"),
    color: "#8e8c87",
    label: "☿ Mercure",
    scale: 0.76,
    rotationSpeed: 0.017,
  },
  Venus: {
    texture: textureLoader.load("textures/venus.jpg"),
    color: "#d5a253",
    label: "☀️ Vénus",
    scale: 1.9,
    rotationSpeed: 0.004,
  },
  Terre: {
    texture: textureLoader.load("textures/terre.jpg"),
    color: "#4b70dd",
    label: "🌍 Terre",
    scale: 2,
    rotationSpeed: 1.0,
  },
  Lune: {
    texture: textureLoader.load("textures/lune.jpg"),
    color: "#b4bdc4",
    label: "🌙 Lune",
    scale: 0.54,
    rotationSpeed: 0.037,
  },
  Mars: {
    texture: textureLoader.load("textures/mars.jpg"),
    color: "#a1251b",
    label: "🪐 Mars",
    scale: 1.06,
    rotationSpeed: 0.96,
  },
};

// 🔄 Création initiale de la planète (Terre)
let currentRotationSpeed = planetData.Terre.rotationSpeed;
const rotationAmplification = 25; // Facteur pour rendre les rotations lentes visibles
const planetGeometry = new THREE.SphereGeometry(planetData.Terre.scale, 64, 64);
const planetMaterial = new THREE.MeshStandardMaterial({
  map: planetData.Terre.texture,
});
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);
camera.position.set(0, 0, 5);
planet.rotation.x = Math.PI * 0.1;

// 🌍 Animation fluide avec rotation réelle
function animate() {
  requestAnimationFrame(animate);
  planet.rotation.y += currentRotationSpeed * 0.002 * rotationAmplification;
  renderer.render(scene, camera);
}
animate();

// 🎛 Création du conteneur des boutons
const buttonsContainer = document.createElement("div");
buttonsContainer.style.position = "absolute";
buttonsContainer.style.display = "flex";

// ✅ Vérifie si l'utilisateur est sur un mobile
if (window.innerWidth < 600) {
  buttonsContainer.style.top = "auto";
  buttonsContainer.style.bottom = "5px"; // Place les boutons en bas
  buttonsContainer.style.left = "50%"; // Centre horizontalement
  buttonsContainer.style.transform = "translateX(-50%)"; // Ajuste le centrage
  buttonsContainer.style.flexDirection = "row"; // Boutons en ligne
} else {
  buttonsContainer.style.top = "50%";
  buttonsContainer.style.right = "20px"; // Place les boutons à droite
  buttonsContainer.style.transform = "translateY(-50%)"; // Corrige l'alignement vertical
  buttonsContainer.style.flexDirection = "column"; // Boutons empilés sur PC
}

document.body.appendChild(buttonsContainer);

// 📌 Ajout dynamique des boutons avec gestion de la couleur
const buttons = Object.keys(planetData).map((planetKey) => {
  const button = document.createElement("button");
  button.innerText = planetData[planetKey].label;
  button.style.padding = "10px 15px";
  button.style.margin = "5px";
  button.style.fontSize = "18px";
  button.style.background = "#444";
  button.style.color = "white";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.borderRadius = "5px";

  button.addEventListener("click", () => changePlanet(planetKey, button));

  buttonsContainer.appendChild(button);
  return button;
});

// 🔄 Fonction de changement de planète avec ajustement de la taille et de la rotation
function changePlanet(planetKey, activeBtn) {
  planet.geometry.dispose();
  planet.geometry = new THREE.SphereGeometry(
    planetData[planetKey].scale,
    64,
    64
  );
  planetMaterial.map = planetData[planetKey].texture;
  planetMaterial.needsUpdate = true;
  currentRotationSpeed = planetData[planetKey].rotationSpeed;

  buttons.forEach(
    (btn) =>
      (btn.style.background =
        btn === activeBtn ? planetData[planetKey].color : "#444")
  );
}

// 🔄 Sélection correcte du bouton **Terre** au démarrage
changePlanet(
  "Terre",
  buttons.find((btn) => btn.innerText.includes(planetData["Terre"].label))
);

function adjustPlanetScaleForMobile(scale) {
  return window.innerWidth < 600 ? scale * 0.3 : scale; // Réduction à 30% sur mobile
}
