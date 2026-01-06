"use client";
import { Keyboard } from "@/components/Keyboard";
import {
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Keycap } from "@/components/Keycap";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import { useFrame, useThree } from "@react-three/fiber";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function CameraController() {
  const { camera, size } = useThree();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  
  // Safe window check for build time
  const preferedReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentPositionRef = useRef(new THREE.Vector3(0, 0, 4));
  const baseCameraPosition = {
    x: 0,
    y: 0,
    z: 4,
  };

  useFrame(() => {
    const mouse = mouseRef.current;
    
    // Adjusted logic slightly to prevent large jumps if mouse is 0
    const tiltX = (mouse.y - 0.5) * 0.3;
    const tiltY = (mouse.x - 0.5) * 0.3;

    if (preferedReducedMotion) {
      camera.position.set(
        baseCameraPosition.x,
        baseCameraPosition.y,
        baseCameraPosition.z
      );
      camera.lookAt(targetRef.current);
      return;
    }

    const targetPosition = new THREE.Vector3(
      baseCameraPosition.x + tiltY,
      baseCameraPosition.y - tiltX,
      baseCameraPosition.z
    );

    currentPositionRef.current.lerp(targetPosition, 0.05);

    camera.position.copy(currentPositionRef.current); // Use the ref, not just target
    camera.lookAt(targetRef.current);
  });

  useEffect(() => {
    if (preferedReducedMotion) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX / size.width;
      mouseRef.current.y = event.clientY / size.height;
    };

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [size, preferedReducedMotion]);

  return null;
}

export function Scene() {
  const keyboardGroupRef = useRef<THREE.Group>(null);
  
  // Hydration safety for window usage
  const [scalingFactor, setScalingFactor] = useState(1);
  useEffect(() => {
    setScalingFactor(window.innerWidth <= 500 ? 0.5 : 1);
  }, []);

  const [lightIntensityScaler, setLightIntensityScaler] = useState(0);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (!keyboardGroupRef.current) return;

      const keyboard = keyboardGroupRef.current;

      // Light Animation
      gsap.to(
        { val: 0 },
        {
          val: 1,
          duration: 3.5,
          delay: 0.5,
          ease: "power2.inOut",
          onUpdate: function () {
            setLightIntensityScaler(this.targets()[0].val);
          },
        }
      );

      // Keyboard Movement Timeline
      const tl = gsap.timeline({ ease: "power2.inOut" });

      tl.to(keyboard.position, {
        x: 0,
        y: -0.5,
        z: 0.5,
        duration: 2,
      })
        .to(
          keyboard.rotation,
          {
            x: 1.4,
            y: 0,
            z: 0,
            duration: 1.8,
          },
          "<"
        )
        .to(keyboard.position, {
          x: 0.2,
          y: -0.5,
          z: 1.9,
          duration: 2,
          delay: 0.5,
        })
        .to(
          keyboard.rotation,
          {
            x: 1.6,
            y: 0.4,
            z: 0,
            duration: 2,
          },
          "<"
        )
        .call(() => {
           // Cleanup or Trigger next event if needed
        });
    });
  });

  return (
    <group>
      <CameraController />
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />

      <group scale={scalingFactor}>
        <group ref={keyboardGroupRef}>
          <Keyboard scale={9} />
        </group>

        <group>
          {/* Keycaps */}
          <Keycap position={[0, -0.4, 2.6]} rotation={[0, 2, 3]} texture={0} />
          <Keycap position={[-1.4, 0, 2.3]} rotation={[3, 2, 1]} texture={1} />
          <Keycap position={[-1.8, 1, 1.5]} rotation={[1, 0, 3]} texture={2} />
          <Keycap position={[0.1, 1, 1]} rotation={[0, 4, 2]} texture={3} />
          <Keycap position={[0.7, 0.9, 1.4]} rotation={[3, 2, 0]} texture={4} />
          <Keycap position={[1.3, -0.3, 2.3]} rotation={[1, 2, 0]} texture={5} />
          <Keycap position={[0, 1, 2]} rotation={[2, 2, 3]} texture={6} />
          <Keycap position={[-0.77, 0.1, 2.8]} rotation={[3, 2, 3]} texture={7} />
          <Keycap position={[2, 0, 1]} rotation={[0, 0, 3]} texture={8} />
        </group>
      </group>

      <Environment
        files={["/hdr/blue-studio.hdr"]}
        environmentIntensity={0.2 * lightIntensityScaler}
      />

      <spotLight
        position={[-2, 1.5, 1]}
        intensity={30 * lightIntensityScaler}
        castShadow
        shadow-bias={-0.0002}
        shadow-normalBias={0.002}
        shadow-mapSize={1024}
      />
    </group>
  );
}