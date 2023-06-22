'use strict'
const fs = use("fs");
const Axios = use('axios')
const Helpers = use('Helpers')
const FormData = use('form-data')
const Randomstring = use("randomstring")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tools
 */
class ToolController {
  async token() {
    return await Axios.get(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=QqNpOTVtgKmM97dqDN9u1s6y&client_secret=iuN3S9BDkqUsiakPyVMMhXgYsvCyZDey`)
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log("access_token 获取失败 %s", JSON.stringify(error))
      });
  }

  async ocr ({ request, response, view }) {
    try {
      const all = request.all()
      if (request.file('image')) {
        var image = {}
        const profilePic = request.file('image', { type: ['image'], size: '2mb' })
        const profileName = `${Randomstring.generate(32)}.${profilePic.extname || 'jpg'}`
        const profilePath = `/uploads/files/ocr/`

        image.fileName = profilePic.clientName
        image.fileSrc = profilePath + profileName

        await profilePic.move(Helpers.publicPath(profilePath), {
          name: profileName,
          overwrite: true
        })

        const pathImage = Helpers.publicPath(image.fileSrc);
        const formData = new FormData()
        formData.append('image', Buffer.from(fs.readFileSync(pathImage)).toString('base64'))
        // const localFile = fs.createReadStream(pathImage);
        // formData.append('url', localFile)

        const token = await this.token()
        const ocr = await Axios.post(`https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${ token.access_token }`, formData)
          .then((response) => response.data)
          .catch(function (error) {
            console.log(JSON.stringify(error))
          });

        return {
          errno: 0, // 注意：值是数字，不能是字符串
          data: {
            image,
            ocr
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = ToolController
