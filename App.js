import React, { useEffect, useState } from "react";
import { Canvas, useImage, Image, Group, Text, useFont } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";



const GRAVITY = 1000;
const JUMP_FORCE = -500;
const App = () => {
  const { width, height } = useWindowDimensions();
  const [score, setScore] = useState(0);

  const bg = useImage(require("./assets/sprites/background-day.png")); //way of importing img in RN skia specifically
  const bird = useImage(require("./assets/sprites/yellowbird-upflap.png"));
  const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
  const pipeTop = useImage(require("./assets/sprites/pipe-green-top.png"));

  const base = useImage(require("./assets/sprites/base.png"));

  const x = useSharedValue(width - 50); //to update the animation value without rerender
  const birdY = useSharedValue(height / 3);
  const birdYVelocity = useSharedValue(0);

    useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(-200, { duration: 3000, easing: Easing.linear }),
        withTiming(width, { duration: 0 }),
      ),
      -1, // -1 = repetition infinte num of times
    ); //withTiming makes the movement of pipe slowly, withSequence runs animations one after another, withRepeat used for repition

    birdY.value = withTiming(height, { duration: 1000 });
  }, []);


  useAnimatedReaction(
    () =>  x.value,
    (currentValue, previousValue) => {
      const middle = width/2;

      if (
        currentValue !== previousValue &&
        previousValue &&
        currentValue <= middle &&
        previousValue > middle
      ) { 
        runOnJS(setScore)(score + 1);
        console.log(score);
        
      }
    }
  );


  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt) {
      return;
    }
    birdY.value = birdY.value + (birdYVelocity.value * dt) / 1000;
    birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000; //to inc. velocity based on acc due to grav(g)
  });
  //useFrameCallback is called at every frame renderv


  const gesture = Gesture.Tap().onStart(() => {
    birdYVelocity.value = JUMP_FORCE;
  });

    const birdTransform = useDerivedValue(() => {
    return [
      {
        rotate: interpolate(
          birdYVelocity.value,
          [-500, 500],
          [-0.5, 0.5],
          Extrapolation.CLAMP,
        ),
      },
    ]; //clamp makes sure it doesn't rotate more than 0.5
  });

  const birdOrigin = useDerivedValue(() => {
    return { x: width / 4 + 32, y: birdY.value + 24 };
  });
 

  const pipeOffset = 0; //moves pipes up and down
  const font = useFont(require("./assets/fonts/Roboto-VariableFont_wdth,wght.ttf"), 40);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width, height }}>
          {/*Background*/}
          <Image image={bg} width={width} height={height} fit={"cover"} />

          {/*Pipes*/}
          <Image
            image={pipeTop}
            x={x}
            y={pipeOffset - 320}
            width={104}
            height={640}
          />

          <Image
            image={pipeBottom}
            x={x}
            y={height - 320 + pipeOffset}
            width={104}
            height={640}
          />

          {/*Base*/}
          <Image
            image={base}
            x={0}
            y={height - 75}
            width={width}
            height={150}
            fit={"cover"}
          />

          {/*Bird*/}
          <Group //we add group because we can't style the image comp directly
            transform={birdTransform}
            origin={birdOrigin} //to get the center of the bird bcz initially top left corner is taken as axis point
          >
            <Image
              image={bird}
              y={birdY} //the top left corner of the asset is considered the point of origin so we subtracted the pixel size according from x and y
              x={width / 4}
              height={48}
              width={64}
            /> 
          </Group>

          {/*SCORE */}
          <Text x={width/2} y={150} text={score.toLocaleString()} font={font}color="white"/> 
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default App;
