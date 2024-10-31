import imageToBase64 from "image-to-base64"

async function urlToBase64(url: string) {
  return await imageToBase64(url)
}

export default urlToBase64
