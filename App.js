import React from "react";
import { Canvas, useImage, Image} from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";

const App = () => {
  const {width, height} = useWindowDimensions();

  const bg = useImage(require('./assets/sprites/background-day.png')) //way of importing img in RN skia
  const bird = useImage(require('./assets/sprites/yellowbird-upflap.png'))
  const r = width * 0.33;
  return (
    <Canvas style={{ width, height}}>
      <Image image={bg} width={width} height={height} fit={'cover'} />
      <Image image={bird}
      y={height/2 - 24} //note that the top left corner of the asset is considered the point of origin so we subtracted the pixel size according from x and y
      x={width/2 -32} 
      height={48} 
      width={64} />
    </Canvas>
  );
};

export default App;
