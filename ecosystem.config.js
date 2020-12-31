module.exports = {
    apps : [{
      name: "Thingicerse Bot",
      script: "src/app.js",
      instances: "max",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }