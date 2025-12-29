let realPluginManager = null

function setPluginManager(manager) {
  realPluginManager = manager
}

class PluginManager {
  static getInstance() {
    if (!realPluginManager) {
      // Import the real plugin manager dynamically
      import("@weeb/weeb-plugins").then(module => {
        realPluginManager = module.PluginManager.getInstance()
      }).catch(err => {
        console.warn("Failed to load real PluginManager:", err)
      })
    }
    return realPluginManager || {
      get: (name) => {
        console.warn(`Plugin ${name} not available - PluginManager not loaded`)
        return null
      }
    }
  }

  get(name) {
    return PluginManager.getInstance().get(name)
  }
}

export { PluginManager }