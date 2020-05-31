const { parseMessage } = require('./handler');

test('It should return id', () => {
  expect(parseMessage({ id: 5 })).toEqual(5);
});
