'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface TrafficSceneProps {
  currentQuestionIndex: number;
  isCelebrating: boolean;
  cameraMode: 'follow' | 'overview' | 'station';
  onStationReached?: (index: number) => void;
}

export const TrafficScene3D: React.FC<TrafficSceneProps> = ({
  currentQuestionIndex,
  isCelebrating,
  cameraMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    character: THREE.Group;
    schoolBus: THREE.Group;
    trafficLights: THREE.Group[];
    signPosts: THREE.Group[];
    confettiParticles: THREE.Points;
    confettiData: { vel: THREE.Vector3; rot: number }[];
    stationPositions: THREE.Vector3[];
    targetCameraPos: THREE.Vector3;
    targetLookAt: THREE.Vector3;
    characterTargetPos: THREE.Vector3;
    isMoving: boolean;
    walkCycle: number;
    celebrateTimer: number;
    leftArm: THREE.Mesh;
    rightArm: THREE.Mesh;
    leftLeg: THREE.Mesh;
    rightLeg: THREE.Mesh;
    torso: THREE.Mesh;
  } | null>(null);

  // Pre-allocated math objects to avoid garbage collection in animation tick
  const _tempVec3 = useRef(new THREE.Vector3()).current;
  const _tempLookAt = useRef(new THREE.Vector3()).current;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL to balance performance
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Bright cheerful cartoon sky blue
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );
    camera.position.set(0, 14, 22);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Room Environment for studio PBR reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(25, 35, 20);
    sunLight.castShadow = !isSoftwareGl;
    if (sunLight.castShadow) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 100;
      const d = 35;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xecfdf5, 0x93c5fd, 1.2);
    hemiLight.position.set(0, 40, 0);
    scene.add(hemiLight);

    // 6. BUILD PROCEDURAL 3D TOWN ENVIRONMENT
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.8,
      metalness: 0.05,
    });

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.85,
      metalness: 0.1,
    });

    const curbMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.5,
      metalness: 0.1,
    });

    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.05,
    });

    const yellowStripeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.4,
      metalness: 0.05,
    });

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const ground = new THREE.Mesh(groundGeo, grassMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    // Main Street (Z-axis running road)
    const roadGeo = new THREE.PlaneGeometry(10, 150);
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.02, 0);
    road.receiveShadow = !isSoftwareGl;
    scene.add(road);

    // Sidewalks
    const sidewalkGeo = new THREE.BoxGeometry(3, 0.2, 150);
    const leftSidewalk = new THREE.Mesh(sidewalkGeo, curbMat);
    leftSidewalk.position.set(-6.5, 0.1, 0);
    leftSidewalk.receiveShadow = !isSoftwareGl;
    scene.add(leftSidewalk);

    const rightSidewalk = new THREE.Mesh(sidewalkGeo, curbMat);
    rightSidewalk.position.set(6.5, 0.1, 0);
    rightSidewalk.receiveShadow = !isSoftwareGl;
    scene.add(rightSidewalk);

    // Road dashed stripes
    for (let i = 0; i < 25; i++) {
      const stripeGeo = new THREE.PlaneGeometry(0.3, 3);
      const stripe = new THREE.Mesh(stripeGeo, yellowStripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, 0.03, -60 + i * 5);
      scene.add(stripe);
    }

    // Zebra Crosswalks
    const crosswalkZPositions = [-40, -10, 20, 50];
    crosswalkZPositions.forEach((cz) => {
      for (let s = -4; s <= 4; s += 1.2) {
        const zebraBar = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 4.5), stripeMat);
        zebraBar.rotation.x = -Math.PI / 2;
        zebraBar.position.set(s, 0.035, cz);
        scene.add(zebraBar);
      }
    });

    // 7. BUILD PROCEDURAL CARTOON TREES
    const createCartoonTree = (x: number, z: number, scale = 1) => {
      const treeGroup = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * scale, 0.5 * scale, 2.5 * scale, 8), trunkMat);
      trunk.position.y = 1.25 * scale;
      trunk.castShadow = !isSoftwareGl;
      treeGroup.add(trunk);

      const foliageMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.32 + Math.random() * 0.05, 0.75, 0.45),
        roughness: 0.7,
      });

      const m1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6 * scale, 1), foliageMat);
      m1.position.y = 3.2 * scale;
      m1.castShadow = !isSoftwareGl;
      treeGroup.add(m1);

      const m2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 * scale, 1), foliageMat);
      m2.position.set(0.4 * scale, 4.2 * scale, 0.2 * scale);
      m2.castShadow = !isSoftwareGl;
      treeGroup.add(m2);

      treeGroup.position.set(x, 0, z);
      return treeGroup;
    };

    for (let z = -65; z <= 65; z += 10) {
      if (Math.abs(z % 30) > 3) {
        scene.add(createCartoonTree(-10.5 - Math.random() * 1.5, z, 0.85 + Math.random() * 0.3));
        scene.add(createCartoonTree(10.5 + Math.random() * 1.5, z, 0.85 + Math.random() * 0.3));
      }
    }

    // 8. BUILD PROCEDURAL CARTOON HOUSES & SCHOOL
    const createCartoonHouse = (x: number, z: number, colorHex: number, roofColorHex: number) => {
      const house = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 });
      const walls = new THREE.Mesh(new THREE.BoxGeometry(5.5, 4.2, 5.5), wallMat);
      walls.position.y = 2.1;
      walls.castShadow = !isSoftwareGl;
      walls.receiveShadow = !isSoftwareGl;
      house.add(walls);

      const roofMat = new THREE.MeshStandardMaterial({ color: roofColorHex, roughness: 0.4 });
      const roof = new THREE.Mesh(new THREE.ConeGeometry(4.3, 2.5, 4), roofMat);
      roof.position.y = 5.45;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = !isSoftwareGl;
      house.add(roof);

      const winMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.2, metalness: 0.3 });
      const win1 = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), winMat);
      win1.position.set(-1.6, 2.6, 2.76);
      house.add(win1);

      const win2 = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), winMat);
      win2.position.set(1.6, 2.6, 2.76);
      house.add(win2);

      house.position.set(x, 0, z);
      if (x > 0) house.rotation.y = -Math.PI / 2;
      else house.rotation.y = Math.PI / 2;
      return house;
    };

    const houseColors = [0xfef08a, 0xfbcfe8, 0xc7d2fe, 0xa7f3d0, 0xfed7aa];
    const roofColors = [0xef4444, 0x0284c7, 0x16a34a, 0xe11d48, 0xd97706];

    for (let i = 0; i < 5; i++) {
      scene.add(createCartoonHouse(-17, -50 + i * 24, houseColors[i % 5], roofColors[i % 5]));
      scene.add(createCartoonHouse(17, -40 + i * 24, houseColors[(i + 2) % 5], roofColors[(i + 3) % 5]));
    }

    // 9. PRIMARY SCHOOL BUILDING
    const school = new THREE.Group();
    const schoolWallMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 });
    const schoolRoofMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 });

    const mainHall = new THREE.Mesh(new THREE.BoxGeometry(16, 6.5, 9), schoolWallMat);
    mainHall.position.y = 3.25;
    mainHall.castShadow = !isSoftwareGl;
    school.add(mainHall);

    const schoolRoof = new THREE.Mesh(new THREE.BoxGeometry(17, 1.2, 10), schoolRoofMat);
    schoolRoof.position.y = 7.1;
    schoolRoof.castShadow = !isSoftwareGl;
    school.add(schoolRoof);

    const tower = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5, 4.5), schoolWallMat);
    tower.position.set(0, 9, 0);
    tower.castShadow = !isSoftwareGl;
    school.add(tower);

    const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(3.4, 3, 4), schoolRoofMat);
    towerRoof.position.set(0, 13, 0);
    towerRoof.rotation.y = Math.PI / 4;
    school.add(towerRoof);

    const clock = new THREE.Mesh(new THREE.CircleGeometry(1.1, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    clock.position.set(0, 9.8, 2.27);
    school.add(clock);

    school.position.set(0, 0, -75);
    scene.add(school);

    // 10. PROCEDURAL YELLOW SCHOOL BUS
    const schoolBus = new THREE.Group();
    const busYellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35, metalness: 0.15 });
    const busWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const busBlackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const busGlassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.5 });
    const busLightMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.6 });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 6.2), busYellowMat);
    chassis.position.y = 1.7;
    chassis.castShadow = !isSoftwareGl;
    schoolBus.add(chassis);

    const busRoof = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 5.8), busWhiteMat);
    busRoof.position.y = 2.9;
    schoolBus.add(busRoof);

    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.2), busGlassMat);
    windshield.position.set(0, 2.1, -3.11);
    windshield.rotation.y = Math.PI;
    schoolBus.add(windshield);

    const sideWinL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 4.6), busGlassMat);
    sideWinL.position.set(-1.31, 2.1, 0.2);
    schoolBus.add(sideWinL);

    const sideWinR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 4.6), busGlassMat);
    sideWinR.position.set(1.31, 2.1, 0.2);
    schoolBus.add(sideWinR);

    const hl1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 12), busLightMat);
    hl1.rotation.x = Math.PI / 2;
    hl1.position.set(-0.85, 1.2, -3.11);
    schoolBus.add(hl1);

    const hl2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 12), busLightMat);
    hl2.rotation.x = Math.PI / 2;
    hl2.position.set(0.85, 1.2, -3.11);
    schoolBus.add(hl2);

    const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 0.4), busBlackMat);
    bumper.position.set(0, 0.7, -3.2);
    schoolBus.add(bumper);

    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.4, 16);
    const wheelPositions = [
      [-1.35, 0.55, -1.8],
      [1.35, 0.55, -1.8],
      [-1.35, 0.55, 1.8],
      [1.35, 0.55, 1.8],
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, busBlackMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      wheel.castShadow = !isSoftwareGl;
      schoolBus.add(wheel);
    });

    schoolBus.position.set(2.6, 0, -25);
    scene.add(schoolBus);

    // 11. PROCEDURAL TRAFFIC LIGHTS
    const trafficLights: THREE.Group[] = [];
    const createTrafficLight = (x: number, z: number, rotationY = 0) => {
      const tl = new THREE.Group();
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.4 });
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 5.2, 10), poleMat);
      pole.position.y = 2.6;
      pole.castShadow = !isSoftwareGl;
      tl.add(pole);

      const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.5), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 }));
      box.position.set(0, 4.4, 0.3);
      tl.add(box);

      const bulbGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const redBulb = new THREE.Mesh(bulbGeo, new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.9 }));
      redBulb.position.set(0, 4.9, 0.56);
      tl.add(redBulb);

      const yellowBulb = new THREE.Mesh(bulbGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.3 }));
      yellowBulb.position.set(0, 4.4, 0.56);
      tl.add(yellowBulb);

      const greenBulb = new THREE.Mesh(bulbGeo, new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.3 }));
      greenBulb.position.set(0, 3.9, 0.56);
      tl.add(greenBulb);

      tl.position.set(x, 0, z);
      tl.rotation.y = rotationY;
      return tl;
    };

    const tl1 = createTrafficLight(-4.8, -12, 0);
    const tl2 = createTrafficLight(4.8, 18, Math.PI);
    trafficLights.push(tl1, tl2);
    scene.add(tl1);
    scene.add(tl2);

    // 12. PROCEDURAL 3D TRAFFIC SIGNS WITH CANVAS TEXTURES
    const createSignTexture = (signType: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      ctx.clearRect(0, 0, 256, 256);

      if (signType === 'cam_xe_dap') {
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(128, 128, 120, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(128, 128, 96, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.arc(80, 160, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(176, 160, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(80, 160);
        ctx.lineTo(115, 160);
        ctx.lineTo(155, 118);
        ctx.lineTo(105, 118);
        ctx.closePath();
        ctx.stroke();
      } else if (signType === 'cam_nguoi_di_bo') {
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(128, 128, 120, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(128, 128, 96, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(128, 85, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(120, 108, 16, 50);

        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(55, 55);
        ctx.lineTo(201, 201);
        ctx.stroke();
      } else if (signType === 'duong_nguoi_di_bo') {
        ctx.fillStyle = '#1D4ED8';
        ctx.beginPath();
        ctx.roundRect(10, 10, 236, 236, 24);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(50, 180, 156, 12);
        ctx.fillRect(60, 160, 136, 12);
        ctx.fillRect(70, 140, 116, 12);

        ctx.beginPath();
        ctx.arc(128, 70, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(120, 92, 16, 44);
      } else if (signType === 'han_che_toc_do_40') {
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(128, 128, 120, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(128, 128, 96, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 96px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('40', 128, 132);
      } else {
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.moveTo(128, 15);
        ctx.lineTo(245, 220);
        ctx.lineTo(11, 220);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        ctx.moveTo(128, 45);
        ctx.lineTo(220, 205);
        ctx.lineTo(36, 205);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(65, 165);
        ctx.lineTo(191, 165);
        ctx.moveTo(65, 185);
        ctx.lineTo(191, 185);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };

    const signPosts: THREE.Group[] = [];
    const signTypesList = ['cam_xe_dap', 'cam_nguoi_di_bo', 'duong_nguoi_di_bo', 'han_che_toc_do_40', 'giao_duong_sat_rao_chan'];
    const signZPositions = [35, 15, -5, -25, -45];

    signTypesList.forEach((type, idx) => {
      const signGroup = new THREE.Group();
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 12), poleMat);
      pole.position.y = 1.9;
      pole.castShadow = !isSoftwareGl;
      signGroup.add(pole);

      const texture = createSignTexture(type);
      const faceMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.1,
      });

      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.06, 24), [
        new THREE.MeshStandardMaterial({ color: 0x94a3b8 }),
        faceMat,
        new THREE.MeshStandardMaterial({ color: 0x94a3b8 }),
      ]);
      plate.rotation.x = Math.PI / 2;
      plate.position.set(0, 3.2, 0.05);
      plate.castShadow = !isSoftwareGl;
      signGroup.add(plate);

      signGroup.position.set(5.3, 0, signZPositions[idx]);
      signPosts.push(signGroup);
      scene.add(signGroup);
    });

    // 13. CUTE 3D STUDENT HERO "BÉ AN"
    const character = new THREE.Group();

    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.5 });
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 0.55, 8, 12), shirtMat);
    torso.position.y = 1.35;
    torso.castShadow = !isSoftwareGl;
    character.add(torso);

    const backpackMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.6 });
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.3), backpackMat);
    backpack.position.set(0, 1.35, -0.32);
    backpack.castShadow = !isSoftwareGl;
    character.add(backpack);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), skinMat);
    head.position.y = 2.05;
    head.castShadow = !isSoftwareGl;
    character.add(head);

    const helmetMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25, metalness: 0.15 });
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.41, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6), helmetMat);
    helmet.position.y = 2.15;
    helmet.castShadow = !isSoftwareGl;
    character.add(helmet);

    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    leftEye.position.set(-0.12, 2.05, 0.32);
    character.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    rightEye.position.set(0.12, 2.05, 0.32);
    character.add(rightEye);

    const limbMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 });
    const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.45, 6, 8), limbMat);
    leftArm.position.set(-0.48, 1.25, 0);
    character.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.45, 6, 8), limbMat);
    rightArm.position.set(0.48, 1.25, 0);
    character.add(rightArm);

    const shortsMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
    const leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.55, 6, 8), shortsMat);
    leftLeg.position.set(-0.2, 0.55, 0);
    leftLeg.castShadow = !isSoftwareGl;
    character.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.55, 6, 8), shortsMat);
    rightLeg.position.set(0.2, 0.55, 0);
    rightLeg.castShadow = !isSoftwareGl;
    character.add(rightLeg);

    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 1.2),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.02;
    character.add(contactShadow);

    character.position.set(-5.5, 0, 48);
    character.rotation.y = Math.PI;
    scene.add(character);

    // 14. 3D CONFETTI BURST
    const confettiCount = 100;
    const confettiGeo = new THREE.BufferGeometry();
    const confettiPositions = new Float32Array(confettiCount * 3);
    const confettiColors = new Float32Array(confettiCount * 3);
    const confettiData: { vel: THREE.Vector3; rot: number }[] = [];

    const palette = [
      new THREE.Color(0xfacc15),
      new THREE.Color(0xef4444),
      new THREE.Color(0x3b82f6),
      new THREE.Color(0x10b981),
      new THREE.Color(0xa855f7),
    ];

    for (let i = 0; i < confettiCount; i++) {
      confettiPositions[i * 3] = 0;
      confettiPositions[i * 3 + 1] = -100;
      confettiPositions[i * 3 + 2] = 0;

      const col = palette[i % palette.length];
      confettiColors[i * 3] = col.r;
      confettiColors[i * 3 + 1] = col.g;
      confettiColors[i * 3 + 2] = col.b;

      confettiData.push({
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          Math.random() * 8 + 4,
          (Math.random() - 0.5) * 8
        ),
        rot: Math.random() * Math.PI,
      });
    }

    confettiGeo.setAttribute('position', new THREE.BufferAttribute(confettiPositions, 3));
    confettiGeo.setAttribute('color', new THREE.BufferAttribute(confettiColors, 3));

    const confettiParticles = new THREE.Points(
      confettiGeo,
      new THREE.PointsMaterial({ size: 0.35, vertexColors: true, transparent: true, opacity: 0.9 })
    );
    scene.add(confettiParticles);

    // 15. Checkpoints calculation
    const stationPositions: THREE.Vector3[] = [];
    const totalQuestions = 19;
    const startZ = 48;
    const endZ = -60;

    for (let q = 0; q < totalQuestions; q++) {
      const alpha = q / (totalQuestions - 1);
      const z = startZ + alpha * (endZ - startZ);
      const x = q % 2 === 0 ? -5.5 : 5.5;
      stationPositions.push(new THREE.Vector3(x, 0, z));
    }

    sceneRef.current = {
      scene,
      camera,
      renderer,
      character,
      schoolBus,
      trafficLights,
      signPosts,
      confettiParticles,
      confettiData,
      stationPositions,
      targetCameraPos: new THREE.Vector3(0, 12, 60),
      targetLookAt: new THREE.Vector3(0, 2, 48),
      characterTargetPos: stationPositions[0].clone(),
      isMoving: false,
      walkCycle: 0,
      celebrateTimer: 0,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      torso,
    };

    // 16. Window resize handler
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 17. Animation Loop
    let animFrameId = 0;
    const animClock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const syncStatus = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (syncStatus === gl.UNSIGNALED) {
          animFrameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          animFrameId = window.setTimeout(cb, 80);
        }
      };
      animFrameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(animClock.getDelta(), 0.05);
      const state = sceneRef.current;

      if (state) {
        const char = state.character;
        const target = state.characterTargetPos;
        const dist = char.position.distanceTo(target);

        if (dist > 0.1) {
          state.isMoving = true;
          char.position.lerp(target, delta * 3.5);
          _tempVec3.subVectors(target, char.position);
          if (_tempVec3.lengthSq() > 0.001) {
            const targetAngle = Math.atan2(_tempVec3.x, _tempVec3.z);
            char.rotation.y = THREE.MathUtils.damp(char.rotation.y, targetAngle, 8, delta);
          }
          state.walkCycle += delta * 10;
          state.leftArm.rotation.x = Math.sin(state.walkCycle) * 0.45;
          state.rightArm.rotation.x = -Math.sin(state.walkCycle) * 0.45;
          state.leftLeg.rotation.x = -Math.sin(state.walkCycle) * 0.45;
          state.rightLeg.rotation.x = Math.sin(state.walkCycle) * 0.45;
          state.torso.position.y = 1.35 + Math.abs(Math.sin(state.walkCycle * 2)) * 0.06;
        } else {
          state.isMoving = false;
          state.leftArm.rotation.x = THREE.MathUtils.damp(state.leftArm.rotation.x, 0, 6, delta);
          state.rightArm.rotation.x = THREE.MathUtils.damp(state.rightArm.rotation.x, 0, 6, delta);
          state.leftLeg.rotation.x = THREE.MathUtils.damp(state.leftLeg.rotation.x, 0, 6, delta);
          state.rightLeg.rotation.x = THREE.MathUtils.damp(state.rightLeg.rotation.x, 0, 6, delta);
          state.torso.position.y = 1.35;
        }

        if (state.celebrateTimer > 0) {
          state.celebrateTimer -= delta;
          const bounce = Math.abs(Math.sin(state.celebrateTimer * 12)) * 0.8;
          char.position.y = bounce;
          state.leftArm.rotation.z = Math.PI * 0.75;
          state.rightArm.rotation.z = -Math.PI * 0.75;
          char.rotation.y += delta * 4;

          const positions = confettiGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < confettiCount; i++) {
            const data = state.confettiData[i];
            positions[i * 3] += data.vel.x * delta;
            positions[i * 3 + 1] += data.vel.y * delta;
            positions[i * 3 + 2] += data.vel.z * delta;
            data.vel.y -= 9.8 * delta;
          }
          confettiGeo.attributes.position.needsUpdate = true;
        } else {
          if (!state.isMoving) {
            char.position.y = 0;
            state.leftArm.rotation.z = 0;
            state.rightArm.rotation.z = 0;
          }
        }

        state.camera.position.lerp(state.targetCameraPos, delta * 3.0);
        _tempLookAt.lerp(state.targetLookAt, delta * 3.5);
        state.camera.lookAt(_tempLookAt);

        state.schoolBus.position.y = Math.sin(animClock.elapsedTime * 1.8) * 0.03;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animFrameId = requestAnimationFrame(tick);
      }
    }

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      animFrameId = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      clearTimeout(animFrameId);
      renderer.dispose();
      groundGeo.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const state = sceneRef.current;
    if (!state) return;

    const clampedIdx = Math.max(0, Math.min(currentQuestionIndex, state.stationPositions.length - 1));
    const stationPos = state.stationPositions[clampedIdx];
    state.characterTargetPos.copy(stationPos);

    if (cameraMode === 'follow') {
      state.targetCameraPos.set(
        stationPos.x + (stationPos.x > 0 ? 3.5 : -3.5),
        stationPos.y + 7.5,
        stationPos.z + 11.0
      );
      state.targetLookAt.set(stationPos.x, stationPos.y + 2.0, stationPos.z - 4.0);
    } else if (cameraMode === 'overview') {
      state.targetCameraPos.set(0, 32, stationPos.z + 28);
      state.targetLookAt.set(0, 2, stationPos.z - 8);
    } else if (cameraMode === 'station') {
      state.targetCameraPos.set(
        stationPos.x + (stationPos.x > 0 ? -4.5 : 4.5),
        stationPos.y + 3.2,
        stationPos.z + 4.5
      );
      state.targetLookAt.set(stationPos.x, stationPos.y + 2.2, stationPos.z);
    }
  }, [currentQuestionIndex, cameraMode]);

  useEffect(() => {
    const state = sceneRef.current;
    if (!state || !isCelebrating) return;

    state.celebrateTimer = 2.4;

    const charPos = state.character.position;
    const positions = state.confettiParticles.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < state.confettiData.length; i++) {
      positions[i * 3] = charPos.x + (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = charPos.y + 2.5 + Math.random();
      positions[i * 3 + 2] = charPos.z + (Math.random() - 0.5) * 1.5;

      state.confettiData[i].vel.set(
        (Math.random() - 0.5) * 6,
        Math.random() * 7 + 4,
        (Math.random() - 0.5) * 6
      );
    }
    state.confettiParticles.geometry.attributes.position.needsUpdate = true;
  }, [isCelebrating]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none touch-none"
      style={{ zIndex: 0 }}
    />
  );
};
