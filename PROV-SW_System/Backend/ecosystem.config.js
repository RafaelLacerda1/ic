module.exports = {
  apps: [
    {
      name: "Provsw",
      script: "src/server.js",
      watch: true,
      instances: 1,
      autorestart: true,
      interpreter: "node",
      exec_mode: "cluster",
    }
  ]
};