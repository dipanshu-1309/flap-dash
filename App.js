import React, { useEffect } from "react";
import { Canvas, useImage, Image} from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { Easing, useFrameCallback, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";


const GRAVITY = 10;

const App = () => {
  const {width, height} = useWindowDimensions();
  const extraspaceBase = 10;
  const bg = useImage(require('./assets/sprites/background-day.png')) //way of importing img in RN skia
  const bird = useImage(require('./assets/sprites/yellowbird-upflap.png'))
  const pipeBottom = useImage(require('./assets/sprites/pipe-green.png'))
  const pipeTop = useImage(require('./assets/sprites/pipe-green-top.png'))

  const base = useImage(require('./assets/sprites/base.png'))

  const x = useSharedValue(width - 50); //to update the animation value without rerender
  const birdY = useSharedValue(height/2);
  const birdYVelocity = useSharedValue(100);

  useFrameCallback(({ timeSincePreviousFrame : dt })=>{
    if (!dt){
      return;
    }
    birdY.value = birdY.value + (birdYVelocity.value * dt)/1000;
    birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt)/1000 //to inc. velocity based on acc due to grav
  });
  //useFramCallback is called at every frame render

  useEffect(()=>{
    x.value = withRepeat( withSequence (
      withTiming(-200, { duration: 3000, easing: Easing.linear}),
      withTiming(width ,{duration: 0})
  ), -1 // -1 = repetition infinte num of times
);//withTiming makes the movement of pipe slowly, withSequence runs animations one after another//withRepeat used for repition
      
  birdY.value= withTiming(height, {duration: 1000})

}, []);

  const pipeOffset = 0; //moves pipes up and down

  return (
    <Canvas style={{ width, height}}>
      {/*Background*/}
      <Image image={bg} width={width} height={height} fit={'cover'} />
      {/*Pipes*/}
      <Image image={pipeTop} x={x} y={pipeOffset-320} width={104} height={640}/>
      <Image image={pipeBottom} x={x} y={height - 320 + pipeOffset} width={104} height={640}/>
      {/*Base*/}
      <Image image={base} x={0} y={height - 75} width={width} height={150} fit={'cover'}/>

      {/*Bird*/}
      <Image image={bird}
      y={birdY} //the top left corner of the asset is considered the point of origin so we subtracted the pixel size according from x and y
      x={width/4} height={48} width={64} />
    </Canvas>
  );
};

export default App;

