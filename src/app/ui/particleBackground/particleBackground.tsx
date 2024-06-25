"use client";

import {useEffect, useRef, useState} from "react";
import Particles, {initParticlesEngine} from "@tsparticles/react";
import {loadSlim} from "@tsparticles/slim";
import {Container} from "@tsparticles/engine";
import {clsx} from "clsx";
import styles from "./particleBackground.module.css";

export default function ParticleBackground() {
  const [init, setInit] = useState<boolean>(false);
  const ref = useRef<HTMLElement | null>(null);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const onParticlesLoaded = async (container?: Container) => {
    // if we wanted to pause the particles when the ref is off screen, we could do that here
  };

  return (
    init && (
      <div className={clsx("absolute -z-10 w-[100vw] h-[100%]", styles.fadeIn)}>
        <Particles
          id="tsparticles"
          particlesLoaded={onParticlesLoaded}
          ref={ref}
          options={{
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
              color: {
                value: "#3C8CC6",
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
          }}
          className={clsx("opacity-80 w-[100%] h-[140%]", styles.opacityGradient)}
        />
      </div>
    )
  )
}
