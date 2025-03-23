//import './style.css';
import { Engine } from "@babylonjs/core/Engines/engine";
import { Color3, Color4 } from '@babylonjs/core/Maths/math';
import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from '@babylonjs/core';
import { Vector3 } from "@babylonjs/core/Maths/math";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR";
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { ShadowOnlyMaterial } from "@babylonjs/materials";
import { gsap } from "gsap";
import createHeroSection from "./heroSection.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import "@babylonjs/loaders";

export default function createHeroModelScene() {

console.log("Building components...");
const heroCanvas = createHeroSection();

// Hero Canvas Setup
console.log("Setting up hero canvas...");
if (!heroCanvas) {
  console.error("Hero canvas #renderCanvas not found!");
} else {
  console.log("Hero canvas found, initializing engine...");
  const engine = new Engine(heroCanvas, { alpha: true });
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.0, 0.0, 0.0, 0.0);

  const camera = new ArcRotateCamera("Camera", 0, 0, 0, new Vector3(Math.PI / 5, 0, Math.PI / 2), scene);
  camera.setPosition(new Vector3(-12, 8, -8));
  camera.setTarget(new Vector3(-2, 0.8, 0.0));
  camera.attachControl(heroCanvas, true);
  camera.minZ = 0.1;
  camera.maxZ = 5000;
  camera.lowerRadiusLimit = 2.5;
  camera.upperRadiusLimit = 10;

  const pbrChromeMaterial = new PBRMaterial("Chrome", scene);
  const pbrfuselageMaterial = new PBRMaterial("pbrSG", scene);
  pbrfuselageMaterial.metallic = 1.0;
  pbrfuselageMaterial.roughness = 0.1;
  pbrfuselageMaterial.albedoTexture = new Texture("../public/maps/diffuse/AirBrushFuselage.png", scene);
  pbrfuselageMaterial.bumpTexture = new Texture("../public/maps/normal/NormalMap_fuse.png", scene);

  const pbrKnobMaterial = new PBRMaterial("knob", scene);
  pbrKnobMaterial.bumpTexture = new Texture("../public/maps/normal/knobNormal.png", scene);

  const pbrSoftChromeMaterial = new PBRMaterial("SoftChrome", scene);
  pbrSoftChromeMaterial.albedoColor = new Color3(0.5, 0.5, 0.5);
  pbrSoftChromeMaterial.metallic = 0.5;
  pbrSoftChromeMaterial.roughness = 0.2;

  const pbrBrassMaterial = new PBRMaterial("Brass", scene);
  pbrBrassMaterial.albedoColor = new Color3(0.9, 0.2, 0.2);
  pbrBrassMaterial.specularColor = new Color3(0.9, 0.2, 0.2);
  pbrBrassMaterial.metallic = 0.8;
  pbrBrassMaterial.roughness = 0.3;

  const pbrSteelMaterial = new PBRMaterial("Steel", scene);
  pbrSteelMaterial.albedoColor = new Color3(0.5, 0.5, 0.5);
  pbrSteelMaterial.metallic = 0.8;
  pbrSteelMaterial.roughness = 0.3;

  const pbrCollarMaterial = new PBRMaterial("Collar", scene);
  pbrCollarMaterial.metallic = 1.0;
  pbrCollarMaterial.roughness = 0.1;
  pbrCollarMaterial.albedoTexture = new Texture("../public/maps/diffuse/airbrushCollar.png", scene);
  pbrCollarMaterial.specularTexture = new Texture("../public/maps/diffuse/airbrushCollar.png", scene);
  pbrCollarMaterial.bumpTexture = new Texture("../public/maps/normal/collarNormal.png", scene);

  const light = new DirectionalLight('light', new Vector3(-2, 5, -6), scene);
  light.intensity = 0.0;

  const ground = Mesh.CreatePlane('ground', 1000, scene);
  ground.rotation.x = Math.PI / 2;
  ground.material = new ShadowOnlyMaterial('shadowOnly', scene);
  ground.receiveShadows = true;
  ground.position.y = -1.6;

  const shadowGenerator = new ShadowGenerator(512, light);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurScale = 3;
  shadowGenerator.setDarkness(0.91);

  const model = new URL("../public/AIRBRUSHBlend.glb", import.meta.url).href;

  async function loadModel() {
    try {
      console.log("Loading airbrush model...");
      const AirBrushModel = await SceneLoader.ImportMeshAsync("", model, "", scene);
      const { meshes } = AirBrushModel;

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
          shadowGenerator.getShadowMap().renderList.push(mesh);
        }
      });

      meshes.forEach(part => {
        switch (part.material?.name || "Unnamed Material") {
          case "knob": part.material = pbrKnobMaterial; break;
          case "sttel": part.material = pbrChromeMaterial; break;
          case "fuselage": part.material = pbrfuselageMaterial; break;
          case "collorLock": part.material = pbrCollarMaterial; break;
          case "brass": part.material = pbrBrassMaterial; break;
          case "softChrome": part.material = pbrSoftChromeMaterial; break;
          default: part.material = pbrChromeMaterial;
        }
      });

      camera.target = new Vector3(-2, 2, 0);
      parentMesh.position.y = 5;
      gsap.to(parentMesh.position, {
        y: 0.8,
        duration: 1.5,
        ease: "bounce.out",
        onUpdate: () => scene.render()
      });
    } catch (error) {
      console.error("Error loading model:", error);
    }
  }



  
  loadModel();

  scene.createDefaultEnvironment({
    environmentTexture: "../public/env/blocky_photo_studio_8k.env",
    createGround: false,
    createSkybox: false
  });

  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => engine.resize());
}
} 