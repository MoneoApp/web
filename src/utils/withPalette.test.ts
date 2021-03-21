import { withPalette } from './withPalette';

it('should work without arguments', () => {
  expect(withPalette()?.styles).toMatchSnapshot();
});

it('should inject the correct css rules', () => {
  expect(withPalette(['grey-500', 'grey-0'])?.styles).toMatchSnapshot();
});
