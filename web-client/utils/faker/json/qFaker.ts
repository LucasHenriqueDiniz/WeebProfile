function qFaker() {
  return {
    image: {
      anime: () => getRandomImage("anime"),
    },
  }
}

export default qFaker
