// Test script to check if RenderLastFm works with sections
const config = {
  enabled: true,
  sections: ['recent_tracks'],
  style: 'default',
  size: 'half'
}

console.log('Config:', JSON.stringify(config, null, 2))
console.log('Has sections?', config.sections && config.sections.length > 0)
console.log('Enabled?', config.enabled)
