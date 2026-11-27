"use client";

import Particles, {ParticlesProvider} from "@tsparticles/react";
import {loadSlim} from "@tsparticles/slim";
import type {Engine, ISourceOptions} from "@tsparticles/engine";
import {clsx} from "clsx";
import styles from "./particleBackground.module.css";

// ParticlesProvider runs this once per application lifetime, and needs the same function on every render
async function initEngine(engine: Engine): Promise<void> {
  await loadSlim(engine);
}

// Particles reloads whenever its options change identity, so they're defined once
const options: ISourceOptions = {
  fullScreen: {
    enable: false,
    zIndex: -1,
  },
  background: {
    color: {
      value: "#ffffff",
    },
    opacity: 0,
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 100,
        duration: 4,
      },
    },
  },
  particles: {
    paint: {
      color: {
        value: "#3C8CC6",
      },
    },
    links: {
      color: "#808080",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 300,
    },
    opacity: {
      value: 0.7,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: {min: 2, max: 4},
    },
  },
  detectRetina: true,
};

export default function ParticleBackground() {
  return (
    // renders its children once the engine has loaded
    <ParticlesProvider init={initEngine}>
      {/* negative z value here breaks rendering of the mt_grid effect */}
      <div className={clsx("absolute z-0 w-[100vw] h-[100%]", styles.fadeIn)}>
        <Particles
          id="tsparticles"
          options={options}
          className={clsx("opacity-80 w-[100%] h-[140%]", styles.opacityGradient)}
        />
      </div>
    </ParticlesProvider>
  );
}
