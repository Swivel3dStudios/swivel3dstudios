import { Engine } from '@babylonjs/core';

export default function createSceneModal() {
  const app = document.querySelector("body > div");
  if (!app) throw new Error("App div not found");

  const overlay = document.createElement("div");
  overlay.classList.add("fixed", "inset-0", "bg-black", "bg-opacity-70", "flex", "items-center", "justify-center", "z-50", "hidden");

  const modal = document.createElement("div");
  modal.classList.add(
    "bg-gray-900", "text-white", "p-6", "rounded-xl", "shadow-2xl",
    "w-full", "h-full", "relative", "border", "border-gray-700",
    "transform", "transition-all", "duration-300", "scale-95", "flex", "flex-col"
  );

  const header = document.createElement("h3");
  header.classList.add("text-2xl", "font-bold", "text-indigo-400", "text-center", "mb-4");

  const canvas = document.createElement("canvas");
  canvas.id = "sceneCanvas";
  canvas.classList.add("w-full", "flex-grow", "bg-black");

  const closeBtn = document.createElement("button");
  closeBtn.classList.add(
    "w-full", "py-4", "bg-gray-800", "text-indigo-400", "text-xl", "font-bold",
    "rounded-b-xl", "hover:bg-gray-700", "hover:text-indigo-300", "transition-all",
    "border-t", "border-gray-700", "focus:outline-none"
  );
  closeBtn.textContent = "CLOSE";

  modal.appendChild(header);
  modal.appendChild(canvas);
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  app.appendChild(overlay);

  const hide = () => {
    overlay.classList.add("hidden");
    modal.classList.add("scale-95");
    modal.classList.remove("scale-100");
  };

  let engine;

  return {
    show: async (title, scenePath, onClose) => {
console.log(scenePath)
      header.textContent = title;
      overlay.classList.remove("hidden");
      modal.classList.remove("scale-95");
      modal.classList.add("scale-100");

      if (engine) {
        engine.stopRenderLoop();
        engine.dispose();
      }

      engine = new Engine(canvas, true);

      try {
        const sceneModule = await import(/* @vite-ignore */ scenePath);
        const scene = sceneModule.createScene(engine, canvas);
        engine.runRenderLoop(() => scene.render());
      } catch (err) {
        console.error("Failed to load scene:", err);
        header.textContent = `${title} - Load Failed`;
      }

      closeBtn.onclick = () => {
        if (engine) engine.stopRenderLoop();
        hide();
        if (onClose) onClose();
      };
    },
    hide
  };
}