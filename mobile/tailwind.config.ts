import type { Config } from 'tailwindcss';
// @ts-expect-error - NativeWind preset does not have a properly recognized default export type in this TS configuration
import nativewindPreset from 'nativewind/preset';

const config: Config = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5c7f67", // sage green
          light: "#7a9e85",
          dark: "#425e4c",
        },
        background: {
          DEFAULT: "#E9E6E1", // creamy off-white
          light: "#F2F0EC",
          lighter: "#F9F8F6",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          light: "#F9F8F6",
        },
        text: {
          primary: "#1F2937", // dark gray
          secondary: "#4B5563",
          tertiary: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#e0a96d", // soft peach/pink
          red: "#EF4444",
          yellow: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};

export default config;
