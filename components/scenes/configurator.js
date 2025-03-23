import { Scene, ArcRotateCamera, Mesh, VertexBuffer, PBRMaterial, Vector3, DirectionalLight, SceneLoader, MeshBuilder, StandardMaterial, ShadowGenerator, Color3, Color4, Matrix } from '@babylonjs/core';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { ShadowOnlyMaterial } from "@babylonjs/materials";
import { gsap } from "gsap";
import "@babylonjs/loaders";
export function createScene(engine, canvas) {
  let camFactor = 14;
  const scene = new Scene(engine);
  scene.clearColor = new Color4( 0, 0, 0, 0); // Black background

const camera = new ArcRotateCamera("Camera", 0, 0, 0, new Vector3(Math.PI / 5, 0, Math.PI / 0.2), scene);
camera.setPosition(new Vector3(-.15 * camFactor, 0.15 * camFactor, .08 * camFactor));
camera.setTarget(new Vector3(0.0, 0.65, 0.0));
camera.attachControl(canvas, true);
camera.minZ = 0.02;
camera.maxZ = 55;
camera.lowerRadiusLimit = 0.12 * camFactor; // Min distance
camera.upperRadiusLimit = 0.28 * camFactor;
camera.wheelDeltaPercentage = 0.005;
const light = new DirectionalLight('light', new Vector3(-2, 6, 0), scene);
light.direction = new Vector3(-0.3, 0.6, -0.1); // Slight tilt toward z: 0

const shadowGenerator = new ShadowGenerator(2048, light);
shadowGenerator.useBlurExponentialShadowMap = true;
shadowGenerator.blurScale = 3;
shadowGenerator.setDarkness(0.91);

const ground = Mesh.CreatePlane('ground', 1000, scene);
const pbrgroundmat = new ShadowOnlyMaterial('shadowMat', scene);
pbrgroundmat.light = light;
ground.receiveShadows = true;
ground.position.y = 0; // Lowered
ground.rotation.x = Math.PI / 2;
ground.material = pbrgroundmat;

  const model = new URL("/public/models/IDF_ScoutR5.glb", import.meta.url).href;
//  ___________________________MATERIALS ________________________

const pbrsaddlemat = new PBRMaterial("saddlemat", scene);
const pbrPLACARD = new PBRMaterial("pbrSG", scene);
pbrsaddlemat.albedoColor = new Color3(0.4, 0.38, 0.15);
pbrsaddlemat.roughness = 0.9;
pbrsaddlemat.metallic = 0.02
pbrsaddlemat.bumpTexture = new Texture("/public/maps/normal/NormalMapCotton.png", scene);
pbrsaddlemat.bumpTexture.uScale = 3
pbrsaddlemat.bumpTexture.vScale = 3

const pbrDisc = new PBRMaterial("knob", scene);
pbrDisc.bumpTexture = new Texture("../public/maps/normal/DiscNormalINV.png", scene);
pbrDisc.albedoColor = new Color3(0.4, 0.38, 0.15);
pbrDisc.roughness = 0.4;
pbrDisc.metallic = 0.05;
pbrDisc.bumpTexture.vScale = -1

const pbrLACE = new PBRMaterial("knob", scene);
pbrLACE.albedoColor = new Color3(0.2, 0.18, 0.05);
pbrLACE.bumpTexture = new Texture("../public/maps/bump/NormalMapCotton.png", scene);
pbrLACE.roughness = 0.8;
pbrLACE.bumpTexture.uScale = 0.1
pbrLACE.bumpTexture.vScale = 0.1
pbrLACE.metallic = 0.0;

const pbrPIPING = new PBRMaterial("SoftChrome", scene);
pbrPIPING.albedoColor = new Color3(0.4, 0.38, 0.15);
pbrPIPING.bumpTexture = new Texture("../public/maps/bump/NormalMapCotton.png", scene);
pbrPIPING.roughness = 0.8;
pbrPIPING.bumpTexture.uScale = 1
pbrPIPING.bumpTexture.vScale = 1
pbrPIPING.metallic = 0.0;

const pbrinSole = new PBRMaterial("Brass", scene);
pbrinSole.albedoColor = new Color3(0.4, 0.38, 0.15);
pbrinSole.bumpTexture = new Texture("../public/maps/bump/NormalMapCotton.png", scene);
pbrinSole.roughness = 0.8;
pbrinSole.bumpTexture.uScale = 1
pbrinSole.bumpTexture.vScale = 1
pbrinSole.metallic = 0.0;

const pbrweltStitch = new PBRMaterial("Brass", scene);
pbrweltStitch.albedoColor = new Color3(0.4, 0.38, 0.15);
pbrweltStitch.roughness = 0.4;
pbrweltStitch.metallic = 0.05;

const pbrsteel = new PBRMaterial("Steel", scene);
pbrsteel.roughness = 0.3;
pbrsteel.metallic = 0.6;
pbrsteel.albedoColor = new Color3(0.4, 0.38, 0.15);

const pbrToeCapMold = new PBRMaterial("Steel", scene);
pbrToeCapMold.albedoColor = new Color3(0.4, 0.38, 0.15);
pbrToeCapMold.roughness = 0.4;
pbrToeCapMold.metallic = 0.05;
pbrToeCapMold.bumpTexture = new Texture("/public/maps/normal/palladiumTread_NORM3.png", scene);
pbrToeCapMold.bumpTexture.vScale = -1

pbrPLACARD.albedoColor = new Color3(1, 1, 1);
pbrPLACARD.roughness = 0.4;
pbrPLACARD.metallic = 0.05;
pbrPLACARD.albedoTexture = new Texture("/public/maps/diffuse/tag-01.png", scene);
pbrPLACARD.albedoTexture.vScale = -1
const pbrLINER = new PBRMaterial("Collar", scene);
pbrLINER.metallic = 0.0;
pbrLINER.roughness = 0.8;
pbrLINER.bumpTexture = new Texture("../public/maps/bump/NormalMapCotton.png", scene);
pbrLINER.albedoColor = new Color3(0.97, 0.97, 0.97)

//  ______________________END_MATERIALS ________________________

// *************************MODEL LOAD ***********************

async function loadModel() {
    try {
      const ScoutBootModel = await SceneLoader.ImportMeshAsync("", model, "", scene);
      const { meshes } = ScoutBootModel;
      meshes.forEach(mesh => {
        console.log("Mesh:", mesh.name);
        const uvData = mesh.getVerticesData(VertexBuffer.UVKind);
        if (uvData) {
            console.log("UVs:", uvData.slice(0, 8), "...");
            const minU = Math.min(...uvData.filter((_, i) => i % 2 === 0));
            const maxU = Math.max(...uvData.filter((_, i) => i % 2 === 0));
            const minV = Math.min(...uvData.filter((_, i) => i % 2 === 1));
            const maxV = Math.max(...uvData.filter((_, i) => i % 2 === 1));
            console.log("UV Range: U(", minU, maxU, ") V(", minV, maxV, ")");
        } else {
            console.log("No UVs on", mesh.name);
        }
        if (mesh.material && mesh.material.albedoTexture) {
            console.log("Texture:", mesh.material.albedoTexture.url);
        } else {
            console.log("No texture on", mesh.name);
        }
    });
      if (!meshes || meshes.length === 0) {
        console.error("No meshes were loaded.");
        return;
      }
      const parentMesh = new Mesh("airbrushParent", scene);
      meshes.forEach(mesh => {
        if (!mesh || mesh.getTotalVertices() === 0) {
          console.warn(`Mesh ${mesh?.name || "Unnamed"} has no vertices.`);
        } else {
          mesh.setParent(parentMesh);
          mesh.castShadow = true;
          shadowGenerator.getShadowMap().renderList.push(mesh);
        }
      });
      meshes.forEach(part => {
        switch (part.material?.name || "Unnamed Material") {
          case "saddlemat": part.material = pbrsaddlemat; break;
          case "PLACARD": part.material = pbrPLACARD; break;
          case "PIPING": part.material = pbrPIPING; break;
          case "Disc": part.material = pbrDisc; break;
          case "LACE": part.material = pbrLACE; break;
          case "inSole": part.material = pbrinSole; break;
          case "steel": part.material = pbrsteel; break;
          case "LINER": part.material = pbrLINER; break;
          case "soleMold": part.material = pbrToeCapMold;
          break;
          case "weltStitch": part.material = pbrweltStitch; break;
          default: part.material = pbrsaddlemat;
        }
      });
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 /*     let shoeScale = 6
      parentMesh.scaling = new Vector3(shoeScale, shoeScale, shoeScale);
      parentMesh.position.y = 5;
      gsap.to(parentMesh.position, {
        y: 0.1,
        duration: 2.7,
        ease: "bounce.out",
        onUpdate: () => scene.render()
      });

      scene.registerBeforeRender(() => {
        const time = performance.now() * 0.002;
        parentMesh.position.y = .3 + Math.sin(time) * 0.1;
      }); // */

      let shoeScale = 6;
      parentMesh.scaling = new Vector3(shoeScale, shoeScale, shoeScale);
      
      // Variable to track GSAP's animated base Y position
      let baseY = 5;
      
      // Start with the boot up high
      parentMesh.position.y = baseY;
      
      // GSAP drop animation to baseY = 0.1
      gsap.to({ y: baseY }, {
        y: 0.3,
        duration: 2.7,
        ease: "bounce.out",
        onUpdate: function () {
          baseY = this.targets()[0].y;
        }
      });
      
      // Add hover motion on top of animated baseY
      scene.registerBeforeRender(() => {
        const time = performance.now() * 0.002;
        parentMesh.position.y = baseY + Math.sin(time) * 0.05;
      });
      







//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    } catch (error) {
      console.error("Error loading model:", error);
    }

  }

  loadModel();
// ************************END*MODEL LOAD ***********************
  scene.createDefaultEnvironment({
    environmentTexture: "../public/env/blocky_photo_studio_8k.env",
    createGround: false,
    createSkybox: false
  });
  scene.environmentTexture.rotationY = Math.PI / 1.6; // 90 degrees


  scene.registerBeforeRender(() => {

  });



  return scene;
}