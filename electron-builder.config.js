// electron-builder.config.js
require("dotenv").config();

module.exports = {
  appId: "com.example.eyecareapp",
  extraResources: [".env"],
  productName: "EyeRoutineJS",
  files: ["dist/**/*", "node_modules/**/*"],
  directories: {
    output: "build",
  },
  mac: {
    target: ["dmg"],
    notarize: {
      teamId: process.env.APPLE_TEAM_ID,
    },
    category: "public.app-category.healthcare-fitness",
    hardenedRuntime: true,
    gatekeeperAssess: true,
  },
  dmg: {
    iconSize: 80,
    contents: [
      {
        x: 410,
        y: 150,
        type: "link",
        path: "/Applications",
      },
      {
        x: 130,
        y: 150,
        type: "file",
      },
    ],
    window: {
      width: 540,
      height: 380,
    },
  },
};
