'use strict'

const Env = use('Env')
const fs = use("fs")
const MD5 = use('md5')
const Helpers = use('Helpers')
const Database = use('Database')
const RandomString = use('randomstring')

class FileController {
  async upload ({ params, request, response, view, session }) {
    try {
      if (request.file('file')) {
        var file = {}
        const profile = request.file('file', { type: ['image', 'video'], size: '100mb' })
        const profileName = `${RandomString.generate(32)}.${profile.extname}`
        const profilePath = `/uploads/files/tmp/`

        file.fileName = profile.clientName
        file.fileSrc = profilePath + profileName

        await profile.move(Helpers.publicPath(profilePath), {
          name: profileName,
          overwrite: true
        })

        return {
          errno: 0, // 注意：值是数字，不能是字符串
          data: {
            url: file.fileSrc
          }
        }
      }

      return { errno: 1, message: '' }
    } catch (e) {
      console.log(e);
      return { errno: 1, message: e }
    }
  }
}

module.exports = FileController
