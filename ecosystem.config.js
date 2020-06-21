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
        name: "GoDataTransformation",
        script: "./index.js",
        cwd: "./GoDataClientDataProvider/Transformation",
        env: {
          NODE_ENV: "development",
        },
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
      }
    ]
  }