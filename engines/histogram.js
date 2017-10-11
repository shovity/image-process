function histogram(image) {

  // Get histogram array
  const hisArr = Array(256).fill(0)
  image.scan((w, h, x, y, v) => {
    hisArr[v]++
    return v
  })

  // Get max value
  let max = hisArr[0]
  for (let i = 0; i < 256; i++) {
    if (hisArr[i] > max) max = hisArr[i]
  }

  // convert to percent
  for (let i = 0; i < 256; i++) {
    hisArr[i] = Math.floor(hisArr[i] / max * 100 + 0.5)
  }

  // Resize
  image.jimp.resize(255, 100)

  // Draw histogram
  image.scan((w, h, x, y, v) => {
    return (hisArr[x] > y)? 0 : 220
  })

  image.jimp.flip(false, true)
}

module.exports = histogram
