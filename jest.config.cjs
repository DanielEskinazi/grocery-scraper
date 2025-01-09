module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
      },
    ],
  },
  testEnvironment: "jsdom",
  //   setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
