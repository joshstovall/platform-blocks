const React = require('react');
const { View } = require('react-native');

const SvgMock = (props) => React.createElement(View, props);

module.exports = new Proxy(
  {},
  {
    get: (_, key) => (key === 'default' ? SvgMock : SvgMock),
  }
);
module.exports.ReactComponent = SvgMock;
