function test(image, params) {

  console.log('Test....')
  image.scan((w, h, x, y, v) => {
    return (v + 150 > 255)? 255 : v+150
  })
}

module.exports = test
