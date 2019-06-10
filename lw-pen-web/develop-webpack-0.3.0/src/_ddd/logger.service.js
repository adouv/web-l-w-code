export default {
  logger(object) {
    if (process.env.NODE_ENV === "development") {
      console.log(object);
    }
  }
}
