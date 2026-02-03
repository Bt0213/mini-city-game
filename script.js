const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.7, 0.85, 1);

  // Camera
  const camera = new BABYLON.UniversalCamera(
    "camera",
    new BABYLON.Vector3(0, 5, -10),
    scene
  );
  camera.attachControl(canvas, true);
  camera.speed = 1.2;

  // Light
  new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Ground
  BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 200, height: 200 },
    scene
  );

  // Buildings
  for (let i = 0; i < 50; i++) {
    const box = BABYLON.MeshBuilder.CreateBox("b" + i, { size: 4 }, scene);
    box.position.x = Math.random() * 100 - 50;
    box.position.z = Math.random() * 100 - 50;
    box.position.y = 2;
    box.scaling.y = Math.random() * 5 + 1;
  }
// CAR
  const car = BABYLON.MeshBuilder.CreateBox(
    "car",
    { width: 2, height: 1, depth: 4 },
    scene
  );
  car.position.y = 0.5;

  camera.parent = car;

  const inputMap = {};
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyDownTrigger,
      evt => inputMap[evt.sourceEvent.key] = true
    )
  );
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyUpTrigger,
      evt => inputMap[evt.sourceEvent.key] = false
    )
  );

  scene.onBeforeRenderObservable.add(() => {
    if (inputMap["w"]) car.moveWithCollisions(car.forward.scale(0.3));
    if (inputMap["s"]) car.moveWithCollisions(car.forward.scale(-0.3));
    if (inputMap["a"]) car.rotation.y -= 0.04;
    if (inputMap["d"]) car.rotation.y += 0.04;
  });
  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
