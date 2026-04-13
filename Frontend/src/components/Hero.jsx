import sliderImg from "../assets/sliderimg.jpg";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "animate.css";
import AOS from "aos";
import "aos/dist/aos.css";

// Particles Component
function Particles() {
  const particlesRef = useRef();
  const particleCount = 100;

  useEffect(() => {
    const particles = particlesRef.current;
    particles.children.forEach((particle) => {
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );
    });
  }, []);

  useFrame(() => {
    particlesRef.current.children.forEach((particle) => {
      particle.position.add(particle.velocity);
      if (particle.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 15) {
        particle.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
      }
    });
    particlesRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: particleCount }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

const Hero = () => {
  return (
    <div>
      <section
        className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden"
        data-aos="fade-up"
      >
        <img
          src={sliderImg}
          alt="Trescol Background"
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        />
        <div className="absolute inset-0 z-0 opacity-30">
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <Particles />
          </Canvas>
        </div>
        <div className="absolute top-10 left-10 w-40 h-40 bg-purple-300 opacity-60 blur-3xl rounded-full z-0 animate__animated animate__zoomIn animate__infinite animate__slow"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300 opacity-50 blur-3xl rounded-full z-0 animate__animated animate__zoomIn animate__infinite animate__slower"></div>
        <div className="relative z-10 text-center px-4 animate__animated animate__fadeInUp animate__slower flex flex-col items-center">
          <div className="bg-teal-100/80 backdrop-blur-sm text-teal-800 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider mb-6 border border-teal-200/50 shadow-sm">
            Admission'2025 Now Open
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-4 tracking-tight font-display">
            Leadership & <br /> Professional <br />
            <span className="text-teal-600">Development Center</span>
          </h1>
          <h3 className="text-xl md:text-3xl font-medium text-slate-700 mb-8 max-w-2xl">
            Empowering the next generation of tech leaders with Trescol.
          </h3>
          <p className="text-base md:text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
            Discover premium courses crafted by industry veterans to transform your career path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => document.getElementById('featured-courses').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-teal-600 text-white rounded-full font-bold text-lg hover:bg-teal-700 hover:shadow-2xl hover:shadow-teal-600/30 transform hover:-translate-y-1 transition-all active:scale-95 shadow-xl"
            >
              Explore Courses
            </button>
            <button className="px-8 py-4 bg-white/70 backdrop-blur-md text-teal-700 border border-teal-100 rounded-full font-bold text-lg hover:bg-white hover:shadow-xl transition-all active:scale-95 shadow-lg">
              Watch Tour
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
