window.addEventListener('DOMContentLoaded', () => {

  const API_IMAGE = 'http://127.0.0.1:3000/api/image'

  const handleInputChange = event => {
    console.log('input file change');

    const input = inpFile
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = e => {
        imagePreviewOrigin.src = e.target.result
        requestProcess('grayscale', [],  [imagePreviewOrigin, imagePreviewResult])
        requestProcess('histogram', [],  [hisO, hisN])
        const file = inpFile.files[0]
        if (!file) return console.log('Nothing in input file');
        const sizeInKb = file.size / 1000
        iname.innerHTML = `(${file.name})`
        infoOLength.innerHTML = `${sizeInKb} kb`
        infoNLength.innerHTML = `${sizeInKb} kb`
      }
      reader.readAsDataURL(input.files[0])
    }
  }



  // active menu controls
  let mactive = 'menui0';
  const ml = 6
  for (let i = 0; i < ml; i++) {
    window['menui'+i].addEventListener('click', (event) => {
      mactive = event.target.id
      // clear active
      for (let j = 0; j < ml; j++) {
        window['menui'+j].className = ''
        window['mcontent'+j].className = ''
      }
      // active selected
      window['menui'+i].className = 'active'
      window['mcontent'+i].className = 'active'
    })
  }

  // Listener

  arrow.addEventListener('click', () => {
    console.log('click arrow, mactive = ' + mactive);

    switch (mactive) {
      case 'menui0':
        // Gian histogram
        console.log('send request gian histogram');
        requestProcess('gianhis', [m0p0.value, m0p1.value], imagePreviewResult, false, (err) => {
          requestProcess('histogram', [],  hisN, true)
        })
        break;

      case 'menui2':
        // Loc nhieu
        console.log('send request loc nhieu');
        requestProcess('locnhieu', [m2p0.value, m2p1.value], imagePreviewResult, false, (err) => {
          requestProcess('histogram', [],  hisN, true)
        })
        break;

      case 'menui4':
        // Do sang
        console.log('send request thay doi do sang');
        requestProcess('dosang', [m4p0.value], imagePreviewResult, false, (err) => {
          requestProcess('histogram', [],  hisN, true)
        })
        break;

      case 'menui5':
        // Test
        console.log('send request test');
        requestProcess('test', [], imagePreviewResult, false, (err) => {
          requestProcess('histogram', [],  hisN, true)
        })
        break;
      default:
        console.log('Case not found!');

    }

  })

  dragZone.addEventListener('dragover', event => {
    event.preventDefault()
    dragZone.className = "active"
    console.log('dragover');
  })


  dragZone.addEventListener('dragleave', event => {
    event.preventDefault()
    dragZone.className = ""
    console.log('dragleave');
  })

  dragZone.addEventListener('drop', event => {
    event.preventDefault()

    var data = event.dataTransfer.getData("text");
    if (data.startsWith('data:image')) {
      // drop a image
      imagePreviewOrigin.src = data
    }

    dragZone.className = ""
    if (event.dataTransfer.files.length === 0) return console.log('Drop nothing');
    const files = event.dataTransfer.files
    inpFile.files = files
  })

  inpFile.addEventListener('change', handleInputChange)

  // Define sonme function

  /**
   * [requestProcess description]
   * @param  {[type]}   cmd                                    [description]
   * @param  {Array}    [params=[]]                            [description]
   * @param  {[type]}   [imageTargetChange=imagePreviewResult] [description]
   * @param  {Boolean}  [previewSource=false]                  [description]
   * @param  {Function} cb                                     [description]
   * @return {[type]}                                          [description]
   */
  function requestProcess(cmd, params = [], imageTargetChange = imagePreviewResult, previewSource = false, cb) {
    if (typeof cb !== 'function') cb = () => {}
    if (previewSource) {
      const body = {
        cmd,
        params,
        dataBase64: imagePreviewResult.src,
        name: 'unknow'
      }

      console.log(`Start request process for command '${cmd}' source is preview`);
      sendApi(body, imageTargetChange, () => null)
    } else {
      // Try to get data from src
      let dataBase64 = (imagePreviewOrigin.src.startsWith('data:image'))? imagePreviewOrigin.src : null

      const input = inpFile
      if (imagePreviewOrigin.src.length < 30 && !e.target.result) return alert('no source')
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = e => {
          const body = {
            cmd,
            params,
            dataBase64: (dataBase64)? dataBase64 : e.target.result,
            name: input.files[0].name || 'Unknow'
          }
          console.log(`Start request process for command '${cmd}'`);
          sendApi(body, imageTargetChange, cb)
        }
        reader.readAsDataURL(input.files[0])
      }
    }
  }

  function sendApi(body, imageTargetChange, cb) {
    fetch(
      API_IMAGE,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    ).then(res => res.json()).then(dataJson => {
      const {
        imageBase64Url,
        size,
        mine
      } = dataJson
      const targets = (Array.isArray(imageTargetChange))? imageTargetChange : [imageTargetChange]
      targets.forEach(t => {
        t.src = dataJson.imageBase64Url
      })

      if (size) infoOSize.innerHTML = size;
      if (mine) infoOMine.innerHTML = mine;
      if (size) infoNSize.innerHTML = size;
      if (mine) infoNMine.innerHTML = mine;

      console.log('Image processed, imageBase64 length = ' + imageBase64Url.length);
      cb()
    }).catch(err => {
      cb(err)
      console.log(err)
    })
  }
})
