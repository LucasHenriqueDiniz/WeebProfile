function treatJapaneseName(name: string): string {
  if (name.split(",").length !== 2) {
    return name
  } else {
    return name.split(",")[0] + " " + name.split(",")[1]
  }
}

export default treatJapaneseName
