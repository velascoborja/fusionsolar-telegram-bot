module.exports = {
    apps : [{
      name: "Borja Thingicerse Bot",
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