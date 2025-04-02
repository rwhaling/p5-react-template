import p5 from "p5";

// Parameter definitions moved from main.tsx to here
export const numericParameterDefs = {
  "timeMultiplier": {
    "min": 0,
    "max": 1.0,
    "step": 0.01,
    "defaultValue": 0.5, 
  },
};

// This type represents the parameter store structure
export type ParameterStore = {
  [K in keyof typeof numericParameterDefs]: number;
};

// Create initialization function here too
export function initParameterStore(): ParameterStore {
  // Initialize from default values in the parameter definitions
  const store = {} as ParameterStore;
  
  Object.entries(numericParameterDefs).forEach(([key, def]) => {
    store[key as keyof ParameterStore] = def.defaultValue;
  });
  
  return store;
}

// This function creates the p5 sketch
export function createSketch(parameterStore: ParameterStore) {
  let currentParams = parameterStore;
  
  return function sketch(p: p5) {
    let font: p5.Font;
    let startTime = p.millis();
   
    // Expose a method to update parameters
    (p as any).updateParameters = (newParams: ParameterStore) => {
      currentParams = newParams;
    };
   
    p.preload = function() {
      // can preload assets here...
      font = p.loadFont(
        new URL("/public/fonts/inconsolata.otf", import.meta.url).href
      );
    };
    
    p.setup = function() {
      // Keep the fixed dimensions - this is the actual size of your visualization
      p.createCanvas(400, 400, p.WEBGL);
      
      // Make sure we're using the right coordinate system
      p.translate(-p.width/2, -p.height/2); // Move to top-left for image drawing
      
      // Fix any potential canvas styling issues
      const canvas = document.querySelector('.p5Canvas');
      if (canvas) {
        (canvas as any).style.margin = '0 auto';
        (canvas as any).style.display = 'block';
      }

      // draw a black background
      p.background("#000000");
      
    }
    

    let frameCount = 0;
    let prevTime = 0;
    p.draw = function() {
      frameCount++;

      // Make comment match the actual value
      // const frameRate = 30; // Simulate 30fps
      let frameRate = 30
      const deltaTimePerFrame = 1000 / frameRate;
      const currentTime = frameCount * deltaTimePerFrame;

        
      p.translate(-p.width/2, -p.height/2);

      let drawFrameInterval = Math.ceil(frameRate * currentParams.timeMultiplier);
      if (frameCount % drawFrameInterval == 0) {
        // draw a red circle at a random position on the canvas
        let x = p.random(0, p.width);
        let y = p.random(0, p.height);
        p.fill("#FF0000");
        p.circle(x, y, 10);        
      }
    }

  };
}