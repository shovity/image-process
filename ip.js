const Jimp = require('jimp')

const ip = {
  readBase64: (imageBase64, callback) => {
    const imageBuffer = Buffer.from(imageBase64, 'base64')
    Jimp.read(imageBuffer, function (err, imageJimp) {
      callback(new Image(imageBase64, imageBuffer, imageJimp))
    })
  }
}

class Image {
  // image.getPixelColor(x, y);      // returns the colour of that pixel e.g. 0xFFFFFFFF
  // image.setPixelColor(hex, x, y); // sets the colour of that pixel
  constructor(imageBase64, imageBuffer, imageJimp) {
    this.base64 = imageBase64
    this.buffer = Buffer.from(imageBase64, 'base64')
    this.jimp = imageJimp
    this.bitmap = imageJimp.bitmap
    this.gray()
  }

  gray() {
    this.jimp.greyscale()
  }

  applyArray() {
    for (let ih = 0; ih < this.jimp.bitmap.height; ih++) {
      for (let iw = 0; iw < this.jimp.bitmap.width; iw++) {
        this.jimp.setPixelColor(parseInt((this.arr[ih][iw]).toString(16).repeat(3)+'ff', 16), ih, iw)
      }
    }
  }

  process(callback) {
    const w = this.jimp.bitmap.width
    const h = this.jimp.bitmap.height
    this.arr = callback(this.arr, w, h)
    this.applyArray()
  }

  scan(callback) {
    this.jimp.greyscale()
    this.jimp.scan(0, 0, this.jimp.bitmap.width, this.jimp.bitmap.height, (x, y, idx) => {

      // Return new gray value
      const newValue = callback(this.jimp.bitmap.width, this.jimp.bitmap.height, x, y, this.jimp.bitmap.data[idx])
      this.jimp.bitmap.data[ idx + 0 ] = newValue
      this.jimp.bitmap.data[ idx + 1 ] = newValue
      this.jimp.bitmap.data[ idx + 2 ] = newValue
    })
  }

}

module.exports = ip;
