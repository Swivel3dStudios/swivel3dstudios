import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { ShadowOnlyMaterial } from '@babylonjs/materials/shadowOnly';
import '@babylonjs/loaders';
import { gsap } from 'gsap';

export function createScene(engine, canvas) {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0, 0); // Transparent

  // Camera
  const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.minZ = 0.1;
  camera.maxZ = 5000;
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 15;

  // Light
  const light = new DirectionalLight('light', new Vector3(-2, 5, -6), scene);
  light.intensity = 0.7; // Cranked from 0 per airbrush

  // Ground & Shadows
  const ground = Mesh.CreatePlane('ground', 1000, scene);
  ground.rotation.x = Math.PI / 2;
  ground.material = new ShadowOnlyMaterial('shadowOnly', scene);
  ground.receiveShadows = true;
  ground.position.y = -1.6;

  const shadowGenerator = new ShadowGenerator(512, light);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurScale = 3;
  shadowGenerator.setDarkness(0.91);

  // Materials (Boot-specific TBD)
  const pbrLeather = new PBRMaterial("leather", scene);
  pbrLeather.metallic = 0.2;
  pbrLeather.roughness = 0.4;
  // Texture placeholders - add your rasters later
  // pbrLeather.albedoTexture = new Texture('/public/maps/diffuse/boot_leather.png', scene);

  const pbrRubber = new PBRMaterial("rubber", scene);
  pbrRubber.metallic = 0.1;
  pbrRubber.roughness = 0.6;
  // pbrRubber.albedoTexture = new Texture('/public/maps/diffuse/boot_rubber.png', scene);

  // Boot Load
  let materialsMap = {};
  SceneLoader.ImportMeshAsync('', '/public/models/', 'IDF_Scout_HI_REZ_0004_.glb', scene)
    .then((result) => {
      const bootRoot = new Mesh("bootParent", scene);
      result.meshes.forEach(mesh => {
        if (mesh.getTotalVertices() > 0) {
          mesh.setParent(bootRoot);
          shadowGenerator.getShadowMap().renderList.push(mesh);

          // Recursive Material Assignment
          if (mesh.material) {
            materialsMap[mesh.name] = mesh.material;
            if (mesh.name.toLowerCase().includes('leather')) {
              mesh.material = pbrLeather;
            } else if (mesh.name.toLowerCase().includes('rubber') || mesh.name.toLowerCase().includes('sole')) {
              mesh.material = pbrRubber;
            }
          }
        }
      });

      bootRoot.position.y = 5;
      bootRoot.scaling = new Vector3(15, 15, 15); // Fix tiny
      camera.target = bootRoot.position;

      // GSAP Bounce
      gsap.to(bootRoot.position, {
        y: 0.8,
        duration: 1.5,
        ease: "bounce.out",
        onUpdate: () => scene.render()
      });
      console.log('Boot Materials:', materialsMap);
    })
    .catch((error) => console.error('Failed to load boot:', error));

  // Environment (placeholder - IBL next)
  scene.createDefaultEnvironment({
    environmentTexture: '/public/env/blocky_photo_studio_8k.env',
    createGround: false,
    createSkybox: false
  });

  // Render
  engine.runRenderLoop(() => scene.render());

  return {
    scene,
    getMaterials: () => materialsMap
  };
}