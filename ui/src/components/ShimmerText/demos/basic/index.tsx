import { View, StyleSheet } from 'react-native';
import { ShimmerText } from '../..'; // adjust path
import { Text } from '../../../../components/Text';

export default function ShimmerDemo() {
  return (
    <View style={styles.container}>
      
      <ShimmerText 
        // debug
        // shimmerColor="#fff"
        // colors={['#e34040ff', '#eeeeee', '#b74545ff']}
        duration={2}       // seconds per sweep
        // repeat              // continuous loop
        color="#dc0000ff"        // base text color underneath shimmer
      >
        Shimmering Text ✨
      </ShimmerText>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
    backgroundColor: '#000',
  },
  note: {
    fontStyle: 'italic',
  },
  spacer: {
    height: 16,
  },
});