function dosang(image, params) {
  let [ delta ] = params
  delta = parseInt(delta) || 0
  image.scan((w, h, x, y, v) => {
    let newValue = v + delta;
    if (newValue > 255) newValue = 255
    if (newValue < 0) newValue = 0
    return newValue
  })
}

module.exports = dosang;
