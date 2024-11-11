import logger from "source/helpers/logger"
import fetchUserData from "./fetchUserData"

async function testFetchUserData() {
  const a = await fetchUserData("LucasHenriqueDiniz", "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")
  logger({
    message: `User data: ${JSON.stringify(a)}`,
    level: "info",
  })
}

testFetchUserData()
