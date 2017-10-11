const express = require('express')
const ip = require('../ip')

const grayscale = require('../engines/grayscale')
const histogram = require('../engines/histogram')
const locnhieu = require('../engines/locnhieu')
const dosang = require('../engines/dosang')
const test = require('../engines/test')

const api = express.Router()

const GRAYSCALE = 'grayscale'
const HISTOGRAM = 'histogram'
const LOCNHIEU = 'locnhieu'
const DOSANG = 'dosang'
const TEST = 'test'

api.get('/', (req, res, next) => {
  res.json({ me: 'Server image processor'})
})

api.route('/image')
  .get((req, res, next) => {
    res.json({ docs: "buiding..."})
  })
  .put((req, res, next) => {
    res.json({ body: req.body })
  })
  .post((req, res, next) => {
    const {
      dataBase64,
      params,
      name,
      cmd
    } = req.body

    const [ , mine, imageBase64] = dataBase64.match(/data:(.+);base64,(.+)/)

    switch (cmd) {
      case GRAYSCALE:
        ip.readBase64(imageBase64, image => {
          grayscale(image)
          image.jimp.getBase64(mine, (err, result) => {
            res.json({ imageBase64Url: result, size: `${image.bitmap.width}x${image.bitmap.height} px`, mine })
          })
        })
        break

        case HISTOGRAM:
          ip.readBase64(imageBase64, image => {
            histogram(image)
            image.jimp.getBase64(mine, (err, result) => {
              res.json({ imageBase64Url: result })
            })
          })
          break

        case LOCNHIEU:
          ip.readBase64(imageBase64, image => {
            locnhieu(image, params)
            image.jimp.getBase64(mine, (err, result) => {
              res.json({ imageBase64Url: result })
            })
          })
          break

        case DOSANG:
          ip.readBase64(imageBase64, image => {
            dosang(image, params)
            image.jimp.getBase64(mine, (err, result) => {
              res.json({ imageBase64Url: result })
            })
          })
          break

          case TEST:
            ip.readBase64(imageBase64, image => {
              test(image, params)
              image.jimp.getBase64(mine, (err, result) => {
                res.json({ imageBase64Url: result })
              })
            })
            break

      default:
        console.log('Command not match');
    }
  })

module.exports = api;
