import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import * as IK from 'ikts'
import { GUI } from 'dat.gui'
import { GraphicsApp } from './GraphicsApp'
import { RobotPart } from './RobotPart';

export class MeshViewer extends GraphicsApp
{ 
    // State variables
    private debugMode : boolean;

    // The root node of the robot
    private robotRoot: RobotPart;
    private robotChain: IK.Chain3D;
    private ikSolver: IK.Structure3D;

    // Draggable target mesh
    private targetMesh: THREE.Mesh;

    constructor()
    {
        // Pass in the aspect ratio to the constructor
        super(60, 1920/1080, 0.1, 10);

        this.debugMode = false;

        this.ikSolver = new IK.Structure3D();
        this.robotChain = new IK.Chain3D();
        this.robotRoot = new RobotPart('root', this.robotChain);

        this.targetMesh = new THREE.Mesh();
    }

    createScene(): void
    {
        // Setup camera
        this.camera.position.set(0, 0, 1.5);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 1, 0);

        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

        // Create an ambient light
        var ambientLight = new THREE.AmbientLight('white', 0.3);
        this.scene.add(ambientLight);

        // Create a directional light
        var directionalLight = new THREE.DirectionalLight('white', .6);
        directionalLight.position.set(0, 2, 1);
        this.scene.add(directionalLight)

        // Create the GUI
        var gui = new GUI();
        
        var debugControls = gui.addFolder('Debugging');
        debugControls.open();

        var debugController = debugControls.add(this, 'debugMode');
        debugController.name('Debug Mode');
        debugController.onChange((value: boolean) => { this.toggleDebugMode(value) });

        // Add the target mesh to the scene
        this.targetMesh.geometry = new THREE.SphereGeometry(0.02);
        this.targetMesh.material = new THREE.MeshLambertMaterial({color: 'skyblue'});
        this.targetMesh.position.set(0.5, 0, -0.5)
        this.scene.add(this.targetMesh);

        const transformControls = new TransformControls(this.camera, this.renderer.domElement);
        transformControls.setSize(0.5);
        transformControls.attach(this.targetMesh);
        transformControls.addEventListener('mouseDown', ()=>{
            orbitControls.enabled = false;
        });
        transformControls.addEventListener('mouseUp', ()=>{
            orbitControls.enabled = true;
        });
        this.scene.add(transformControls);

        // Create a grid helper for the ground plane
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add( gridHelper );
        gridHelper.translateY(-0.6);

        // Create the robot skeleton
        this.robotRoot.createSkeleton();

        // Create all the meshes for the robot
        this.robotRoot.createMeshes();

        // Initialize the IK structure
        this.ikSolver.add(this.robotChain, new IK.V3(this.targetMesh.position.x, this.targetMesh.position.y, this.targetMesh.position.z));

        // Move the entire robot down to the ground plane
        this.robotRoot.translateY(-0.6);

        // Add the robot root transform to the scene
        this.scene.add(this.robotRoot);
    }

    update(deltaTime: number): void
    {
        this.ikSolver.targets[0].set(this.targetMesh.position.x, this.targetMesh.position.y, this.targetMesh.position.z);
        this.ikSolver.update();
        this.robotRoot.update();
    }

    private toggleDebugMode(debugMode: boolean): void
    {
        this.robotRoot.setDebugMode(debugMode);
    }
}
