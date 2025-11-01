require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default && (Reanimated.default.call = () => {});
  return Reanimated;
});

global.__reanimatedWorkletInit = () => {};

jest.mock('react-native-svg', () => require('./__mocks__/svgMock.js'));
