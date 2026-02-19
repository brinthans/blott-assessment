/**
 * Colors derived from Figma design tokens.
 *
 * Fixed tokens: constants/tokens/fixed/
 * Semantic tokens: constants/tokens/semantic/ (consumed via gluestack-ui-provider/config.ts)
 */

export const FixedColors = {
  backgroundLight: '#FBFBFB',
  backgroundDark: '#181719',
  textWhite: '#FFFFFF',
  textGray: '#D4D4D4',
  textBlack: '#181718',
};

const tintColorLight = '#805AD5'; // primary-500 from Figma
const tintColorDark = '#E6E6E6'; // primary-500 dark from Figma

export const Colors = {
  light: {
    text: FixedColors.textBlack,
    background: FixedColors.backgroundLight,
    tint: tintColorLight,
    icon: '#737373', // typography-600
    tabIconDefault: '#737373',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: FixedColors.textWhite,
    background: FixedColors.backgroundDark,
    tint: tintColorDark,
    icon: '#A3A3A3', // typography-400 dark
    tabIconDefault: '#A3A3A3',
    tabIconSelected: tintColorDark,
  },
};
