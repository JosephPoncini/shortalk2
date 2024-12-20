import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'lblue' : '#B1CACE',
        'hblue' : '#006cd1',
        'dblue' : '#00529E',
        'lred' : '#F29999',
        'dred' : '#E50000',
        'lgreen' : '#C1F299',
        'dgreen' : '#006110',
        'lgray' : '#DDDDDD',
        'mgray' : '#999999',
        'dgray' : '#5C5757',
        'textGray' : '#545454',
        'lmagenta' : '#F099F2',
        'dmagenta' : '#C500E5',
        'status': 'rgba(255, 255, 255, 0.75)',
        'green': '#04D727',
        'yellow': '#ACA500',
        'purple': '#F300F8',

      },
      fontFamily: {
        'LuckiestGuy':'LuckiestGuy',
        'RobotoBold':'RobotoBold',
        'Roboto':'Roboto'
      }
    },
  },
  plugins: [],
};
export default config;
