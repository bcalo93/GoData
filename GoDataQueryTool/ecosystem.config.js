module.exports = {
    apps : [{
      name: "go-data-query-tool",
      script: "./index.js",
      env: {
        NODE_ENV: "development",
      },
      watch: true,
      ignore_watch: "node_modules",
      exec_mode : "cluster"
    }]
  }