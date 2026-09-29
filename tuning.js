import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const container = document.getElementById("car-viewer");

// صحنه
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x08111f);

// دوربین
const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.set(4, 2, 6);

// رندر
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);

// کنترل چرخش با موس
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 15;

// نور محیطی
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambientLight);

// نور اصلی
const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

directionalLight.position.set(
    5,
    8,
    5
);

scene.add(directionalLight);

// نور پشت ماشین
const backLight = new THREE.DirectionalLight(
    0x4488ff,
    2
);

backLight.position.set(
    -5,
    3,
    -5
);

scene.add(backLight);

// لود مدل
const loader = new GLTFLoader();

loader.load(
    "models/samand.glb",

    function (gltf) {

        const car = gltf.scene;

        scene.add(car);

        // پیدا کردن اندازه ماشین
        const box = new THREE.Box3().setFromObject(car);

        const center = box.getCenter(
            new THREE.Vector3()
        );

        const size = box.getSize(
            new THREE.Vector3()
        );

        // مرکز کردن ماشین
        car.position.x -= center.x;
        car.position.y -= box.min.y;
        car.position.z -= center.z;

        // تنظیم فاصله دوربین
        const maxSize = Math.max(
            size.x,
            size.y,
            size.z
        );

        camera.position.set(
            maxSize * 1.5,
            maxSize * 0.7,
            maxSize * 1.5
        );

        controls.target.set(
            0,
            size.y * 0.4,
            0
        );

        controls.update();
    },

    undefined,

    function (error) {
        console.error(
            "خطا در بارگذاری مدل:",
            error
        );
    }
);

// تغییر اندازه صفحه
window.addEventListener(
    "resize",
    function () {

        camera.aspect =
            container.clientWidth /
            container.clientHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );
    }
);

// اجرای صحنه
function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();