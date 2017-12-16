/**
 * Gian histogram
 * @param  {[type]} image  [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function gianhs(image, params) {
  console.log('Gian histogram....')
  params[0] = +params[0]
  params[1] = +params[1]
  const [lmax = 255, lmin = 0] = params

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
