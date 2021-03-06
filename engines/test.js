/**
 * Gian histogram
 * @param  {[type]} image  [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function gianhs(image, params) {
  console.log('Gian histogram....')

  const [lmax = 50, lmin = 200] = params

  let min = 255;
  let max = 0;
  image.scan((w, h, x, y, v) => {
    if (v < min) min = v
    if (v > max) max = v
    return v
  })

  image.scan((w, h, x, y, v) => {
    if (v === min) return lmin
    if (v === max) return lmax
    return (lmax - lmin) * (v - min) / (max - min) + lmin
  })
}

module.exports = gianhs
