import { View, useWindowDimensions } from "react-native";
import { Text, Slider,  Masonry, Switch } from "@platform-blocks/ui";

export const SliderPlayground = () => {
  const { width } = useWindowDimensions();
  const isSmall = width < 768;

  const masonryItems = [
    {
      id: '1',
      content: (
        <Switch value={true} onValueChange={() => {}} />
      ),
    }, {
      id: '4',
      content: (
        <Switch value={true} onValueChange={() => {}} />
      ),
    }, {
      id: '5',
      content: (
        <Switch value={true} onValueChange={() => {}} />
      ),
    },
    ]

  return (
    <View style={isSmall && { width: '100%' }}>
      
       <Masonry
      data={masonryItems}
      numColumns={8}
    />
        <Slider
          label="Disabled Slider"
          defaultValue={50}
          min={0}
          max={100}
          step={1}
          disabled
        />
        <Slider
          label="Default Slider"
          defaultValue={30}
          min={0}
          max={100}
          step={1}
        />
    </View>
  );
};