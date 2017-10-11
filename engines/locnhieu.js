function locnhieu(image, params) {
  let [ mask, delta ] = params
  console.log('loc nhieu voi mat na ' + mask + ' dealta ' + delta);
  if (mask % 2 === 0) mask--
  image.jimp.scan(0, 0, image.jimp.bitmap.width, image.jimp.bitmap.height, function (x, y, idx) {
    const stack = []
    const ix = x - (mask - 1) / 2
    const iy = y - (mask - 1) / 2
    for (let i = ix; i <= mask; i++) {
      for (let j = iy; j <= mask; j++) {
        stack.push(image.getPixel(i, j))
      }
    }

    stack.sort()
    const med = stack[Math.floor(stack.length/2)]
    if (Math.abs(med - image.jimp.bitmap.data[idx]) > delta) {
      image.jimp.bitmap.data[ idx + 0 ] = med
      image.jimp.bitmap.data[ idx + 1 ] = med
      image.jimp.bitmap.data[ idx + 2 ] = med
    }

    if (mask == 69) {
      image.jimp.bitmap.data[ idx + 0 ] = 10
      image.jimp.bitmap.data[ idx + 1 ] = 10
      image.jimp.bitmap.data[ idx + 2 ] = 10
    }
  })
}

module.exports = locnhieu;
