import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import addCucumberPreprocessorPlugin from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  defaultCommandTimeout: 10000,
  e2e: {
    // block analytics
    blockHosts: [
      "www.googletagmanager.com",
      "www.google-analytics.com",
      "sentry.is.canonical.com",
    ],
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setupNodeEvents(on: any, config) {
      addCucumberPreprocessorPlugin.addCucumberPreprocessorPlugin(on, config);

      on("task", {
        log(args) {
          console.log(args);

          return null;
        },
        table(message) {
          console.table(message);

          return null;
        },
      });
      on("file:preprocessor", (file) => {
        return createBundler({
          plugins: [createEsbuildPlugin(config)],
        })(file);
      });
      return config;
    },
    baseUrl: "http://0.0.0.0:8400",
    specPattern: [
      "cypress/e2e/**/*.{js,jsx,ts,tsx}",
      "cypress/e2e/**/*.feature",
    ],
    viewportHeight: 1300,
    viewportWidth: 1440,
  },
  env: {
    BASENAME: "/MAAS",
    VITE_BASENAME: "/r",
    nonAdminPassword: "test",
    nonAdminUsername: "user",
    password: "test",
    skipA11yFailures: false,
    username: "admin",
  },
  projectId: "gp2cox",
  retries: {
    runMode: 2,
    openMode: 0,
  },
  video: false,
});
