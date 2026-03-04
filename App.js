import React, { useEffect } from "react";
import { Canvas, useImage, Image} from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";

const App = () => {
  const {width, height} = useWindowDimensions();
  const extraspaceBase = 10;
  const bg = useImage(require('./assets/sprites/background-day.png')) //way of importing img in RN skia
  const bird = useImage(require('./assets/sprites/yellowbird-upflap.png'))
  const pipeBottom = useImage(require('./assets/sprites/pipe-green.png'))
  const pipeTop = useImage(require('./assets/sprites/pipe-green-top.png'))

  const base = useImage(require('./assets/sprites/base.png'))

  const x = useSharedValue(width - 50); //to update the animation value without rerender

  useEffect(()=>{
    x.value = withTiming(-200, { duration: 3000, easing: Easing.linear});//withTiming makes the movement of pipe slowly
  },[])

  const pipeOffset = 0; //moves pipes up and down

  return (
    <Canvas style={{ width, height}}>
      {/*Background*/}
      <Image image={bg} width={width} height={height} fit={'cover'} />
      {/*Pipes*/}
      <Image image={pipeTop} x={x} y={pipeOffset-320} width={104} height={640}/>
      <Image image={pipeBottom} x={x} y={height - 320 + pipeOffset} width={104} height={640}/>
      {/*Base*/}
      <Image image={base} x={-extraspaceBase} y={height - 75} width={width} height={150} fit={'cover'}/>

      {/*Bird*/}
      <Image image={bird}
      y={height/2 - 24} //the top left corner of the asset is considered the point of origin so we subtracted the pixel size according from x and y
      x={width/4} height={48} width={64} />
    </Canvas>
  );
};

export default App;

