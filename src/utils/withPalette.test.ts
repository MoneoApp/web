import { withPalette } from './withPalette';

it('should work without arguments', () => {
  expect(withPalette()?.styles).toMatchSnapshot();
});

it('should inject the correct css rules', () => {
  expect(withPalette(['gray-500', 'gray-0'])?.styles).toMatchSnapshot();
});
