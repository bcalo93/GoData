module.exports = {
    apps : [
      {
        name: "GoDataRegistry",
        script: "./index.js",
        cwd : "./GoDataClientDataProvider/Registry",
        env: {
          NODE_ENV: "development",
        },
        watch: true,
        ignore_watch: "node_modules"
      },
      {
        name: "Easy Info",
        script: "./index.js",
        cwd: "./EasyInfo",
        env: {
          NODE_ENV: "development",
        },
        watch: true,
        ignore_watch: "node_modules"
      },
      {
        name: "Volkswagen",
        script: "./index.js",
        cwd: "./Volkswagen",
        env: {
          NODE_ENV: "development",
        },
        watch: true,
        ignore_watch: "node_modules"
      },
      {
        name: "GoDataTransformation",
        script: "./index.js",
        cwd: "./GoDataClientDataProvider/Transformation",
        env: {
          NODE_ENV: "development",
        },
        instances : 2,
        exec_mode : "cluster",
        watch: true,
        ignore_watch: "node_modules"
      },
      {
        name: "NYCDataAgregator",
        script: "./index.js",
        cwd: "./NYCDataAgregator",
        env: {
          NODE_ENV: "development"
        },
        watch: true,
        ignore_watch: "node_modules"
      },
      {
        name: "GoDataIssueReceiver",
        script: "./index.js",
        cwd: "./GoDataIssueReceiver",
        env: {
          NODE_ENV: "development"
        },
        watch: true,
        ignore_watch: "node_modules"
      },
      {
        name: "GoDataQueryTool",
        script: "./index.js",
        cwd: "./GoDataQueryTool",
        env: {
          NODE_ENV: "development",
        },
        watch: true,
        ignore_watch: "node_modules"
      },
      {
        name: "GoDataSync",
        script: "./index.js",
        cwd: "./GoDataSync",
        env: {
          NODE_ENV: "development",
        },
        watch: true,
        ignore_watch: "node_modules"
      },
      {
        name: "GoDataSyncReports",
        script: "./index.js",
        cwd: "./GoDataSyncReports",
        env: {
          NODE_ENV: "development",
        },
        watch: true,
        ignore_watch: "node_modules"
      },
      {
        name: "StateData",
        script: "./index.js",
        cwd: "./StateData",
        env: {
          NODE_ENV: "development",
        },
        watch: true,
        ignore_watch: "node_modules"
      }
    ]
  }