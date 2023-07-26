import { MouseEvent, useEffect, useRef, useState } from 'react';
import { Engine, Render, Bodies, World, Runner } from 'matter-js';

import styles from './App.module.scss';

function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const types = {
  1: {
    sprite: {
      texture: "public/Vector.svg",
      xScale: 0.6,
      yScale: 0.6,
    },
    width: Math.floor(75 * 0.6),
    height: Math.floor(34 * 0.6),
  },
  2: {
    sprite: {
      texture: "public/Vector-1.svg",
      xScale: 0.6,
      yScale: 0.6,
    },
    width: Math.floor(50 * 0.6),
    height: Math.floor(33 * 0.6),
  },
  3: {
    sprite: {
      texture: "public/Vector-2.svg",
      xScale: 0.6,
      yScale: 0.6,
    },
    width: Math.floor(50 * 0.6),
    height: Math.floor(33 * 0.6),
  },
};

function App() {
  const [header] = useState('Matter + React + TS');
  const scene = useRef<HTMLDivElement>(null);
  const engine = useRef(Engine.create());

  useEffect(() => {
    if (scene.current && engine.current) {
      const cw = scene.current.clientWidth;
      const ch = scene.current.clientHeight;
      
      const render = Render.create({
        element: scene.current,
        engine: engine.current,
        options: {
          width: cw,
          height: ch,
          wireframes: false,
          background: 'transparent'
        }
      });
      
      World.add(engine.current.world, [
        Bodies.rectangle(cw / 2, -12, cw, 20, { isStatic: true }),
        Bodies.rectangle(-12, ch / 2, 20, ch, { isStatic: true }),
        Bodies.rectangle(cw / 2, ch - 40, cw, 20, { isStatic: true, render: {
          fillStyle: 'transparent'
        }}),
        Bodies.rectangle(cw + 12, ch / 2, 20, ch, { isStatic: true })
      ]);

      Runner.run(engine.current);
      Render.run(render);
      
      return () => {
        Render.stop(render);
        World.clear(engine.current.world, true);
        Engine.clear(engine.current);
        render.canvas.remove();
        render.textures = {};
      }
    }
  }, []);

  const handleUp = (e: MouseEvent) => {
    const type = Math.floor(randomNumber(1, 4)).toString() as unknown as keyof typeof types;

    if (types[type]) {
      const {height, width, sprite} = types[type];
      const x = Math.floor(randomNumber(220, 280));
      const cube = Bodies.rectangle(
        x,
        370,
        width,
        height,
        {
          mass: 0.2,
          friction: 0.5,
          render: {
            sprite,
          }
        },
      ); 
      
      World.add(engine.current.world, [cube]);
    }
  }

  return (
    <div className={styles.app} >
      <h1 className={styles.headerMain} >{header}</h1>
      <div 
        className={styles.background} 
        onMouseUp={handleUp}
      >
        <div ref={scene} className={styles.scene} ></div>
      </div>
    </div>
  );
}

export default App;
