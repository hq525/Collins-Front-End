import * as React from 'react';
import * as BABYLON from 'babylonjs';
import { AdvancedDynamicTexture, Button, Image } from '@babylonjs/gui/2D';
import Scene from './Scene';
import entrance from './assets/entrance.jpg';

console.log(process.env.PUBLIC_URL);

export default class Map extends React.Component<{}, {}> {
    onSceneMount = (e) => {
        const { canvas, scene, engine } = e;

        var height = 5;

        // Need a free camera for collisions
        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(38, 2, 33), scene);
        camera.rotation.y = -Math.PI/2;
        // var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 100, 30), scene);
        // camera.rotation.x = Math.PI/2;
        camera.attachControl(canvas, true);

        // Spot light
        var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        var ITS700 = BABYLON.MeshBuilder.CreateBox("box", {height: height, width: 4, depth: 2}, scene);

        ITS700.position.x  =  25;
        ITS700.position.z  =  25;

        var CTS2000 = BABYLON.MeshBuilder.CreateBox("box", {height: height, width: 4, depth: 2}, scene);

        CTS2000.position.x = 25;
        CTS2000.position.z = 17.5;

        var ITS701 = BABYLON.MeshBuilder.CreateBox("box", {height: height, width: 3, depth: 3}, scene);

        ITS701.position.x = 25.5;
        ITS701.position.z = 5;

        var ITS700_2 =  BABYLON.MeshBuilder.CreateBox("box", {height: height, width: 3.8, depth: 2}, scene);

        ITS700_2.position.x = 15;
        ITS700_2.position.z = 24;

        var ITS701_2 = BABYLON.MeshBuilder.CreateBox("box", {height: height, width: 5, depth: 2}, scene);

        ITS701_2.position.x = 16;
        ITS701_2.position.z = 6;

        var RFT900 = BABYLON.MeshBuilder.CreateBox("box", {height: height, width:4.75, depth: 2}, scene);

        RFT900.position.x = -5.75;
        RFT900.position.z = 24;

        var RFT1000 = BABYLON.MeshBuilder.CreateBox("box", {height: height, width:5, depth: 3}, scene);

        RFT1000.position.x = -5.5;
        RFT1000.position.z = 10;

        var RFT1000_2 = BABYLON.MeshBuilder.CreateBox("box", {height: height, width:2, depth: 4}, scene);

        RFT1000_2.position.x = -4;
        RFT1000_2.position.z = 38.5;

        var A350_RCTS = BABYLON.MeshBuilder.CreateBox("box", {height: height, width:2, depth: 5}, scene);

        A350_RCTS.position.x = -13.5;
        A350_RCTS.position.z = 39;

        var RFT1000_787 = BABYLON.MeshBuilder.CreateBox("box", {height: height, width:5.5, depth: 2.75}, scene);

        RFT1000_787.position.x = -21;
        RFT1000_787.position.z = 25;

        scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

        myMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);

        ITS700.material = myMaterial
        CTS2000.material = myMaterial
        ITS701.material = myMaterial
        ITS700_2.material = myMaterial
        ITS701_2.material = myMaterial
        RFT900.material = myMaterial
        RFT1000.material = myMaterial
        RFT1000_2.material = myMaterial
        A350_RCTS.material = myMaterial
        RFT1000_787.material = myMaterial;

        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        var ground = BABYLON.Mesh.CreatePlane("ground", 1000.0, scene);
        ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        ground.position = new BABYLON.Vector3(0, 0, 0);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

        // Walls
        var wall1 =  BABYLON.MeshBuilder.CreateBox("wall", {height:8, width: 40, depth: 1}, scene);
        wall1.position.y = 4;
        wall1.position.x = 33;
        wall1.position.z = 10;
        wall1.rotation.y = Math.PI/2;
        wall1.material = myMaterial;

        var wall2 = BABYLON.MeshBuilder.CreatePlane("wall", {height:8, width: 32.5, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);

        wall2.position.y = 4;
        wall2.position.x = 20;
        wall2.position.z = 12;
        wall2.rotation.y = Math.PI/2;
        wall2.material = myMaterial;

        var wall3 = BABYLON.MeshBuilder.CreatePlane("wall", {height:8, width: 21, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);

        wall3.position.y = 4;
        wall3.position.x = -2;
        wall3.position.z = 16.5;
        wall3.rotation.y = Math.PI/2;
        wall3.material = myMaterial;

        var wall4 = BABYLON.MeshBuilder.CreatePlane("wall", {height:8, width: 21, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);

        wall4.position.y = 4;
        wall4.position.x = -17;
        wall4.position.z = 16.5;
        wall4.rotation.y = Math.PI/2;
        wall4.material = myMaterial;

        var wall5 = BABYLON.MeshBuilder.CreateBox("wall", {height:8, width: 36, depth: 1}, scene);

        wall5.position.y = 4;
        wall5.position.x = 15;
        wall5.position.z = -9;
        wall5.material = myMaterial;

        var wall6 = BABYLON.MeshBuilder.CreateBox("wall", {height:8, width: 14, depth: 1}, scene);

        wall6.position.y = 4;
        wall6.position.x = -2;
        wall6.position.z = -4;
        wall6.rotation.y = Math.PI/2;
        wall6.material = myMaterial;

        var wall7 = BABYLON.MeshBuilder.CreateBox("wall", {height:8, width: 28, depth: 1}, scene);

        wall7.position.y = 4;
        wall7.position.x = -16.5;
        wall7.position.z = 2.85;
        wall7.material = myMaterial;

        var wall8 = BABYLON.MeshBuilder.CreateBox("wall", {height:8, width: 37, depth: 1}, scene);

        wall8.position.y = 4;
        wall8.position.x = -30;
        wall8.position.z = 20;
        wall8.rotation.y = Math.PI/2;
        wall8.material = myMaterial;

        var wall9 = BABYLON.MeshBuilder.CreateBox("wall", {height:8, width: 37, depth: 1}, scene);

        wall9.position.y = 4;
        wall9.position.x = -48;
        wall9.position.z = 39;
        wall9.material = myMaterial;

        var wall10 = BABYLON.MeshBuilder.CreateBox("wall", {height:8, width: 30, depth: 1}, scene);

        wall10.position.y = 4;
        wall10.position.x = -67;
        wall10.position.z = 53;
        wall10.rotation.y = Math.PI/2;
        wall10.material = myMaterial;

        var wall11 = BABYLON.MeshBuilder.CreateBox("wall", {height:8, width: 67, depth: 1}, scene);

        wall11.position.y = 4;
        wall11.position.x = -34;
        wall11.position.z = 68;
        wall11.material = myMaterial;

        var wall12 = BABYLON.MeshBuilder.CreateBox("wall", {height:8, width: 1, depth: 32}, scene);

        wall12.position.y = 4;
        wall12.position.x = 0;
        wall12.position.z = 53;
        wall12.material = myMaterial;

        var wall13 = BABYLON.MeshBuilder.CreateBox("wall", {height: 8, width: 49, depth: 1}, scene);

        wall13.position.y = 4;
        wall13.position.x = 24;
        wall13.position.z = 37;
        wall13.material = myMaterial;

        var wall14 = BABYLON.MeshBuilder.CreateBox("wall", {height: 8, width: 1, depth: 9}, scene);

        wall14.position.y = 4;
        wall14.position.x = 48;
        wall14.position.z = 32;
        wall14.material = myMaterial;

        var wall15 = BABYLON.MeshBuilder.CreateBox("wall", {height: 8, width: 17, depth: 1}, scene);

        wall15.position.y = 4;
        wall15.position.x = 41;
        wall15.position.z = 30;
        wall15.material = myMaterial;

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
        ITS700.checkCollisions = true;
        CTS2000.checkCollisions = true;
        ITS701.checkCollisions = true;
        ITS700_2.checkCollisions = true;
        ITS701_2.checkCollisions = true;
        RFT900.checkCollisions = true;
        RFT1000.checkCollisions = true;
        RFT1000_2.checkCollisions = true;
        A350_RCTS.checkCollisions = true;
        RFT1000_787.checkCollisions = true;
        wall1.checkCollisions = true;
        wall2.checkCollisions = true;
        wall3.checkCollisions = true;
        wall4.checkCollisions = true;
        wall5.checkCollisions = true;
        wall6.checkCollisions = true;
        wall7.checkCollisions = true;
        wall8.checkCollisions = true;
        wall9.checkCollisions = true;
        wall10.checkCollisions = true;
        wall11.checkCollisions = true;
        wall12.checkCollisions = true;
        wall13.checkCollisions = true;
        wall14.checkCollisions = true;
        wall15.checkCollisions = true;

        // Decorations
        //Creation of a repeated textured material
        var entranceImg = new BABYLON.StandardMaterial("texturePlane", scene);
        entranceImg.diffuseTexture = new BABYLON.Texture(entrance, scene);
        entranceImg.specularColor = new BABYLON.Color3(0, 0, 0);
        entranceImg.backFaceCulling = false;//Allways show the front and the back of an element

        var entrancePlane = BABYLON.Mesh.CreatePlane("plane", 120, scene);
        entrancePlane.material = entranceImg;
        entrancePlane.position.y = 70;

        // GUI
        // var plane = BABYLON.Mesh.CreatePlane("plane", 2, scene);
        // plane.position.y = 0;
        // plane.position.x = 8;
        // plane.position.z = -11.01
        // //@ts-ignore
        // var advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

        // var button1 = Button.CreateSimpleButton("but1", "Click Me");
        // button1.width = 1;
        // button1.height = 0.4;
        // button1.color = "white";
        // button1.fontSize = 50;
        // button1.background = "green";
        // button1.onPointerUpObservable.add(function() {
        //     alert("you did it!");
        // });
        // advancedTexture.addControl(button1);


        // var color = true
        // setInterval(() => {
        //     if(color) {
        //         myMaterial.ambientColor = new BABYLON.Color3(1, 0, 0);
        //         color = false;
        //     } else {
        //         myMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);
        //         color = true;
        //     }
        // }, 1000)

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