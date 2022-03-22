import * as THREE from 'three'

export class RobotPart extends THREE.Group
{
    public name: string;

    private defaultMaterial: THREE.MeshLambertMaterial;
    private debugHelper: THREE.AxesHelper;

    constructor(name: string)
    {
        super();

        this.name = name;
        this.defaultMaterial = new THREE.MeshLambertMaterial();
        this.defaultMaterial.wireframe = false;

        // Create a visual representation of the axes
        this.debugHelper = new THREE.AxesHelper(0.07);
        this.debugHelper.visible = false;
        this.add(this.debugHelper);
    }

    createMeshes(): void
    {
        if(this.name == 'root')
        {
            this.add(new RobotPart('upperArm'));
            // Create the base at the root node
            const geometry = new THREE.BoxGeometry(0.5, 0.05, 0.5);
            const mesh = new THREE.Mesh(geometry, this.defaultMaterial);
            mesh.translateY(0.025);
            this.add(mesh);

            const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2);
            const sphereMesh = new THREE.Mesh(sphereGeometry, this.defaultMaterial);
            sphereMesh.translateY(0.05);
            this.add(sphereMesh);

            this.add(new RobotPart('upperArm'));
        }
        if(this.name == 'upperArm')
        {
            const geometry = new THREE.BoxGeometry(0.05, 0.5, 0.05);
            const mesh = new THREE.Mesh(geometry, this.defaultMaterial);
            mesh.translateY(0.25);
            this.add(mesh);

            const sphereGeometry = new THREE.SphereGeometry(0.05);
            const sphereMesh = new THREE.Mesh(sphereGeometry, this.defaultMaterial);
            sphereMesh.translateY(0.5);
            this.add(sphereMesh);

            this.add(new RobotPart('middleArm'));
        }
        else if(this.name == 'middleArm')
        {
            this.translateY(0.5);
            this.rotateZ(45 * Math.PI / 180);

            const geometry = new THREE.BoxGeometry(0.05, 0.4, 0.05);
            const mesh = new THREE.Mesh(geometry, this.defaultMaterial);
            mesh.translateY(0.2);
            this.add(mesh);

            const sphereGeometry = new THREE.SphereGeometry(0.05);
            const sphereMesh = new THREE.Mesh(sphereGeometry, this.defaultMaterial);
            sphereMesh.translateY(0.4);
            this.add(sphereMesh);

            this.add(new RobotPart('lowerArm'));
        }
        else if(this.name == 'lowerArm')
        {
            this.translateY(0.4);
            this.rotateZ(45 * Math.PI / 180);

            const geometry = new THREE.BoxGeometry(0.05, 0.4, 0.05);
            const mesh = new THREE.Mesh(geometry, this.defaultMaterial);
            mesh.translateY(0.2);
            this.add(mesh);

            const sphereGeometry = new THREE.SphereGeometry(0.05);
            const sphereMesh = new THREE.Mesh(sphereGeometry, this.defaultMaterial);
            sphereMesh.translateY(0.4);
            this.add(sphereMesh);

            this.add(new RobotPart('endEffector'));
        }
        else if(this.name == 'endEffector')
        {
            this.translateY(0.4);
            this.rotateZ(45 * Math.PI / 180);
            this.rotateY(90 * Math.PI / 180);

            const pincherLength = 0.2 / 1.5;

            const geometry = new THREE.BoxGeometry(0.025, pincherLength, 0.025);

            const leftMesh1 = new THREE.Mesh(geometry, this.defaultMaterial);
            leftMesh1.rotateZ(45 * Math.PI / 180);
            leftMesh1.translateY(pincherLength/2 + 0.04);
            this.add(leftMesh1);

            const leftMesh2 = new THREE.Mesh(geometry, this.defaultMaterial);
            leftMesh2.translateY(pincherLength/2);
            leftMesh2.rotateZ(-75 * Math.PI / 180);
            leftMesh2.translateY(pincherLength/2 - 0.01225);
            leftMesh1.add(leftMesh2);

            const rightMesh1 = new THREE.Mesh(geometry, this.defaultMaterial);
            rightMesh1.rotateZ(-45 * Math.PI / 180);
            rightMesh1.translateY(pincherLength/2 + 0.04);
            this.add(rightMesh1);

            const rightMesh2 = new THREE.Mesh(geometry, this.defaultMaterial);
            rightMesh2.translateY(pincherLength/2);
            rightMesh2.rotateZ(75 * Math.PI / 180);
            rightMesh2.translateY(pincherLength/2 - 0.01225);
            rightMesh1.add(rightMesh2);
        }
 
        // Recursively call this function for each child robot part
        this.children.forEach((child: THREE.Object3D)=>{
            if(child instanceof RobotPart)
            {
                child.createMeshes();
            }
        });
    }
    

    setRotation(name: string, rotation: THREE.Euler): void
    {
        if(this.name == name)
        {
            this.setRotationFromEuler(rotation);
        }
        else
        {
            // Recursively call this function for each child robot part
            this.children.forEach((child: THREE.Object3D)=>{
                if(child instanceof RobotPart)
                {
                    child.setRotation(name, rotation);
                }
            });
        }
    }

    setDebugMode(debugMode: boolean): void
    {
        this.defaultMaterial.wireframe = debugMode;
        this.debugHelper.visible = debugMode;

        // Recursively call this function for each child robot part
        this.children.forEach((child: THREE.Object3D)=>{
            if(child instanceof RobotPart)
            {
                child.setDebugMode(debugMode);
            }
        });
    }
}