// import getDDSLoader from '../../jsm/loaders/DDSLoader.js';
// import getMTLLoader from '../../jsm/loaders/MTLLoader.js';
import getOBJLoader from '../loaders/OBJLoader.js';
import { OrbitControls } from '../loaders/OrbitControls';

export default function (canvas, THREE,filepath) {
    // let { DDSLoader } = getDDSLoader(THREE);
    // let { MTLLoader } = getMTLLoader(THREE);
    let OBJLoader = getOBJLoader(THREE);
    let window = THREE.global;

    let camera, scene, renderer, controls;

    let object;

    init();
    animate();


    function init() {
        //renderer
        {
            renderer = new THREE.WebGLRenderer({ canvas });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        //camera
        {
            camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 2000);
            camera.position.z = 250;
        }
        //controls
        {
            controls = new OrbitControls(camera, canvas);
            controls.target.set(0, 5, 0);
            controls.update();
        }

        // scene & light
        {
            scene = new THREE.Scene();

            let ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
            scene.add(ambientLight);
            //scene.background = new THREE.Color(0xf0f0f0);
            let pointLight = new THREE.PointLight(0xffffff, 0.8);
            camera.add(pointLight);
            scene.add(camera);
        }
        
        // manager

        function loadModel() {

            //object.traverse(function (child) {

               // if (child.isMesh) child.material.map = texture;

            //});

            //object.position.y = - 95;
            //var material = new THREE.MeshBasicMaterial({ color: 0xed3ed3 });
            //var cube = new THREE.Mesh(object, material);
            //var obj3D = new THREE.Object3D()
            //obj3D.add(object)
            
            scene.add(object);

        }

        let manager = new THREE.LoadingManager(loadModel);

        manager.onProgress = function (item, loaded, total) {

            console.log(item, loaded, total);

        };

        // texture

        // let textureLoader = new THREE.TextureLoader(manager);

        // let texture = textureLoader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg');

        // model

        function onProgress(xhr) {

            if (xhr.lengthComputable) {

                let percentComplete = xhr.loaded / xhr.total * 100;
                console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

            }

        }
 
        function onError() { }

        let loader = new OBJLoader(manager);
        

        loader.load(filepath, function (obj) {
         

            object = obj;

        }, onProgress, onError);

    }

    function animate() {

        canvas.requestAnimationFrame(animate);
        render();

    }

    function render() {

        camera.lookAt(scene.position);
        controls.update();
        renderer.render(scene, camera);

    }


}