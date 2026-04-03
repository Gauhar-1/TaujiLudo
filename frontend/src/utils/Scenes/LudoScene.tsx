import { useRef, useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const LudoScene = () => {
  const { camera } = useThree();
  const tableRef = useRef<THREE.Group>(null);
  
  // Load both models
  const { scene: tableModel } = useGLTF('/ludo_table.glb'); 
  const { scene: boardModel } = useGLTF('/ludo_board.glb'); 

  useLayoutEffect(() => {
    if (!tableRef.current) return;
    const table = tableRef.current;

    // We create a dummy object to hold our camera's focus point.
    // Animating this object allows the camera to smoothly shift where it's looking!
    const lookAtTarget = { x: 0, y: 0, z: 0.01 };

    // Set initial Camera Position (For the Hero Section)
    camera.position.set(0, 12, 0); // High up, top-down view

    camera.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z);
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".main-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2, // Smooth follow
          onUpdate: () => {
            // This runs on every frame of the scroll, forcing the camera to look at our animated target
            camera.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z);
          }
        },
      });

      /* ------------------------------------------------------------------------
         TRANSITION 1: Hero -> Card 1 (High Stakes)
         Action: Camera drops down to the right side, table rotates slightly.
      ------------------------------------------------------------------------ */
      tl.to(camera.position, { x: 0, y: 15, z: 0, ease: "power1.inOut" }, "phase1")
        .to(table.rotation, { y: Math.PI/5, ease: "power1.inOut" }, "phase1")
        // ADD THIS LINE: Move the table up on the Y axis
        .to(table.position, { x: -1.5, y: 13.5,z :3, ease: "power1.inOut" }, "phase1") 
        .to(lookAtTarget, { x: 0, y: 14, z: 3, ease: "power1.inOut" }, "phase1");

      /* ------------------------------------------------------------------------
         TRANSITION 2: Card 1 -> Card 2 (Instant Payouts)
         Action: Camera sweeps over to the left side, closer to the board.
      ------------------------------------------------------------------------ */
      tl.to(camera.position, { 
          x:0,       // Sweep far to the left
          y: 14,       // Stay high (table is at y: 13)
          z: 1,        // Pull back slightly for a wider angle
          ease: "power1.inOut" 
        }, "phase2")
        // .to(table.rotation, { 
        //   y: Math.PI / 4, 
        //   ease: "power1.inOut" 
        // }, "phase2")
        .to(table.rotation, { y: Math.PI/2, ease: "power1.inOut" }, "phase2")
        // ADD THIS LINE: Move the table up on the Y axis
        .to(table.position, { x: 0, y: 13.25,z :2, ease: "power1.inOut" }, "phase2") 
        .to(lookAtTarget, { x: 0, y: 14, z: 3, ease: "power1.inOut" }, "phase2");


    });

    return () => ctx.revert(); 
  }, [camera]);

  return (
    <>
      {/* Lighting makes a huge difference in how premium it feels */}
      <Environment preset="city" />
      <ambientLight intensity={0.6} />
      {/* Warm spotlight to simulate a lamp hanging over the table */}
      <spotLight position={[0, 15, 0]} angle={0.4} penumbra={1} intensity={1.5} castShadow />
      
      <PerspectiveCamera makeDefault fov={45} />

      {/* Floating effect gives the table life even when the user isn't scrolling */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group ref={tableRef}>
          
          <primitive 
            object={tableModel} 
            scale={1} 
            position={[0, 0, 0]} 
          />

          <primitive 
            object={boardModel} 
            scale={1} 
            position={[0.25, 0.65, 0]} 
          />
          
        </group>
      </Float>
    </>
  );
};

useGLTF.preload('/ludo_table.glb');
useGLTF.preload('/ludo_board.glb');

export default LudoScene;