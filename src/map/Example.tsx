import * as React from 'react';
import * as BABYLON from 'babylonjs';
import { AdvancedDynamicTexture, Button, Control } from '@babylonjs/gui/2D';
import Scene from './Scene'; // import the component above linking to file we just created.

export default class Page extends React.Component<{}, {}> {
    onSceneMount = (e) => {
        const { canvas, scene, engine } = e;

        // // Parameters : name, position, scene
        // var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);

        // // Targets the camera to a particular position. In this case the scene origin
        // camera.setTarget(BABYLON.Vector3.Zero());
    
        // // Attach the camera to the canvas
        // camera.attachControl(canvas, true);

        // // Parameters: alpha, beta, radius, target position, scene
        // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

        // // Positions the camera overwriting alpha, beta, radius
        // camera.setPosition(new BABYLON.Vector3(0, 0, 20));
    
        // // This attaches the camera to the canvas
        // camera.attachControl(canvas, true);

        // // Parameters: name, position, scene
        // var camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 5, -10), scene);

        // // Airplane like rotation, with faster roll correction and banked-turns.
        // // Default is 100. A higher number means slower correction.
        // camera.rollCorrect = 10;
        // // Default is false.
        // camera.bankedTurn = true;
        // // Defaults to 90° in radians in how far banking will roll the camera.
        // camera.bankedTurnLimit = Math.PI / 2;
        // // How much of the Yawing (turning) will affect the Rolling (banked-turn.)
        // // Less than 1 will reduce the Rolling, and more than 1 will increase it.
        // camera.bankedTurnMultiplier = 1;

        // // This attaches the camera to the canvas
        // camera.attachControl(canvas, true);

        // Need a free camera for collisions
        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, -20), scene);
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        // var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Point light
        // var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, 10, 1), scene);
        
        // Directional light
        // var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);

        // Spot light
        var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Turn off
        light.setEnabled(true);

        // Set how far the light can reach
        light.range = 50;

        // var myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 2}, scene);

        // // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

        // // Move the sphere upward 1/2 its height
        // sphere.position.y = 1;

        // var myPoints =[
        //     new BABYLON.Vector3(0, 0, 0),
        //     new BABYLON.Vector3(0, 1, 1),
        //     new BABYLON.Vector3(0, 1, 0)
        // ];

        // //creates lines
        // var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene);

        var box = BABYLON.MeshBuilder.CreateBox("box", {height: 5, width: 3, depth: 2}, scene);

        box.position.x  =  8;
        box.position.y  =  0;
        box.position.z  =  -10;
        // box.addRotation(Math.PI/4, 0, 0).addRotation(0, Math.PI/4, 0)//.addRotation(0, 0, Math.PI/4);
        // box.scaling.x = 2

        scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

        // myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
        // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        // myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        myMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);
        // myMaterial.alpha = 0.5;
        // myMaterial.wireframe = true;

        box.material = myMaterial

        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        var ground = BABYLON.Mesh.CreatePlane("ground", 20.0, scene);
        ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        ground.position = new BABYLON.Vector3(5, -2, -15);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

        // // Parameters: name, position, scene
        // var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);

        // // The goal distance of camera from target
        // camera.radius = 30;

        // // The goal height of camera above local origin (centre) of target
        // camera.heightOffset = 10;

        // // The goal rotation of camera around local origin (centre) of target in x y plane
        // camera.rotationOffset = 0;

        // // Acceleration of camera in moving from current to goal position
        // camera.cameraAcceleration = 0.005

        // // The speed at which acceleration is halted
        // camera.maxCameraSpeed = 10

        // // This attaches the camera to the canvas
        // camera.attachControl(canvas, true);

        // // NOTE:: SET CAMERA TARGET AFTER THE TARGET'S CREATION AND NOTE CHANGE FROM BABYLONJS V 2.5
        // // targetMesh created here.
        // camera.lockedTarget = box; //version 2.5 onwards
        
        var animationBox = new BABYLON.Animation("myAnimation", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        // An array with all animation keys
        var keys = []; 

        //At the animation key 0, the value of scaling is "1"
        keys.push({
            frame: 0,
            value: 1
        });

        //At the animation key 20, the value of scaling is "0.2"
        keys.push({
            frame: 20,
            value: 0.2
        });

        //At the animation key 100, the value of scaling is "1"
        keys.push({
            frame: 100,
            value: 1
        });

        animationBox.setKeys(keys);
        // box.animations = [];
        // box.animations.push(animationBox);

        // scene.beginAnimation(box, 0, 100, true);

        scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Enable Collisions
        scene.collisionsEnabled = true;

        //Then apply collisions and gravity to the active camera
        camera.checkCollisions = true;
        camera.applyGravity = true;

        //Set the ellipsoid around the camera (e.g. your player's size)
        camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

        //finally, say which mesh will be collisionable
        ground.checkCollisions = true;
        box.checkCollisions = true;

        //When pointer down event is raised
        // scene.onPointerDown = function (evt, pickResult) {
        //     // if the click hits the ground object, we change the impact position
        //     if (pickResult.hit) {
        //         console.log(pickResult);
        //     }
        // };

        // var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("myUI", true, scene);
        
        // var button1 = Button.CreateSimpleButton("but1", "Click Me");
        // button1.width = "150px"
        // button1.height = "40px";
        // button1.color = "white";
        // button1.cornerRadius = 20;
        // button1.background = "green";
        // button1.onPointerUpObservable.add(function() {
        //     alert("you did it!");
        // });
        // advancedTexture.addControl(button1); 
        // button1.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        // GUI
        var plane = BABYLON.Mesh.CreatePlane("plane", 2, scene);
        plane.position.y = 0;
        plane.position.x = 8;
        plane.position.z = -11.01
        //@ts-ignore
        var advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

        var button1 = Button.CreateSimpleButton("but1", "Click Me");
        button1.width = 1;
        button1.height = 0.4;
        button1.color = "white";
        button1.fontSize = 50;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            alert("you did it!");
        });
        advancedTexture.addControl(button1);

        var color = true
        setInterval(() => {
            if(color) {
                myMaterial.ambientColor = new BABYLON.Color3(1, 0, 0);
                color = false;
            } else {
                myMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);
                color = true;
            }
        }, 1000)

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });
    }

    render() {               
        return (
            <div style={{width: "100%", height: "100%"}}>
                <Scene onSceneMount={this.onSceneMount} />
            </div>
        )
    }
}