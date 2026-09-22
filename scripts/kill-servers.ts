#!/usr/bin/env tsx

import { execSync } from "child_process"
import { platform } from "os"

const isWindows = platform() === "win32"

console.log("🔪 Killing WeebProfile servers...\n")

// Process names to kill
const processNames = ["next", "vite", "nodemon", "tsx", "node", "pnpm", "npm"]

// Port numbers commonly used by WeebProfile
const ports = [3000, 3001, 3002, 3003, 3004, 3005, 5000, 5001, 5002, 5173, 5174, 8080, 8081]

function killProcesses(): void {
  if (isWindows) {
    // Windows approach
    try {
      console.log("🪟 Windows: Killing processes...")

      // Kill by process name
      processNames.forEach((name) => {
        try {
          const result = execSync(`tasklist /FI "IMAGENAME eq ${name}.exe" /FO CSV`, { encoding: "utf8" })
          if (result.includes(name)) {
            console.log(`  ⚡ Killing ${name}.exe processes...`)
            execSync(`taskkill /F /IM ${name}.exe`, { stdio: "pipe" })
          }
        } catch (error) {
          // Process not found, continue
        }
      })

      // Kill by port
      ports.forEach((port) => {
        try {
          const result = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" })
          if (result.includes(`:${port}`)) {
            console.log(`  🔌 Killing process on port ${port}...`)
            const pids = result.match(/\d+/g)
            if (pids) {
              const lastPid = pids[pids.length - 1]
              execSync(`taskkill /F /PID ${lastPid}`, { stdio: "pipe" })
            }
          }
        } catch (error) {
          // Port not in use, continue
        }
      })
    } catch (error) {
      console.error("❌ Error killing processes:", (error as Error).message)
    }
  } else {
    // Unix/Linux/Mac approach
    try {
      console.log("🐧 Unix: Killing processes...")

      // Kill by process name
      processNames.forEach((name) => {
        try {
          const pids = execSync(`pgrep -f "${name}"`, { encoding: "utf8" }).trim()
          if (pids) {
            console.log(`  ⚡ Killing ${name} processes (PIDs: ${pids})...`)
            execSync(`pkill -f "${name}"`, { stdio: "pipe" })
          }
        } catch (error) {
          // Process not found, continue
        }
      })

      // Kill by port
      ports.forEach((port) => {
        try {
          const result = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim()
          if (result) {
            console.log(`  🔌 Killing process on port ${port} (PID: ${result})...`)
            execSync(`kill -9 ${result}`, { stdio: "pipe" })
          }
        } catch (error) {
          // Port not in use, continue
        }
      })
    } catch (error) {
      console.error("❌ Error killing processes:", (error as Error).message)
    }
  }
}

function main(): void {
  console.log("🎯 WeebProfile Server Killer")
  console.log("============================\n")

  killProcesses()

  console.log("\n✅ Done! All WeebProfile servers should be killed.")
  console.log("💡 If servers are still running, check your task manager or restart your terminal.")
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { killProcesses }

