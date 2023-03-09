'use strict'

const fs = use("fs");
const QrCode = use('qrcode')
const Moment = use('moment')
const Helpers = use('Helpers')
const Mongodbse = require('../../../../config/mongoose')
const RandomString = use('randomstring')
Moment.locale('zh-cn')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with pages
 */
class PageController {
  /**
   * Show a list of all pages.
   * GET pages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({
    request,
    response,
    view
  }) {

    try {
      return view.render('admin.page.index', {
        data: {
          title: '页面',
          active: 'page'
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Render a form to be used for creating a new page.
   * GET pages/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({
    request,
    response,
    view
  }) {
    return view.render('admin.page.create', {
      data: {
        title: '页面',
        active: 'page'
      }
    })
  }

  /**
   * Create/save a new page.
   * POST pages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({
    request,
    response,
    view,
    session
  }) {
    try {
      const all = request.all()
      const publicPath = `uploads/pages/images/${ Moment().format('YYYY/MM/DD') }/`

      switch (all.submit) {
        case 'create':
          const firstpagesId = await Database.table('pages').insert({
            page_title: all.page_title,
            page_detail: all.detail || '',
            page_catalog_id: all.page_catalog_id || '',
            page_status: all.page_status,
            // project_submit_date: Moment().format('YYYY-MM-DD HH:mm:ss')
          })

          // page_main_img
          if (request.file('page_main_img')) {
            const profileImages = request.file('page_main_img', {
              types: ['image'],
              size: '10mb'
            })

            await profileImages.moveAll(Helpers.publicPath(publicPath), (file) => {
              return {
                name: file.clientName,
                overwrite: true
              }
            })

            if (!profileImages.movedAll()) {
              return profileImages.errors()
            } else {
              for (var i = 0; i < profileImages._files.length; i++) {
                await Database.from('files').insert({
                  clientName: profileImages._files[i].clientName,
                  fileName: profileImages._files[i].fileName,
                  fieldName: profileImages._files[i].fieldName,
                  filePath: publicPath,
                  size: profileImages._files[i].size,
                  type: profileImages._files[i].type,
                  subtype: profileImages._files[i].subtype,
                  status: profileImages._files[i].status,
                  extname: profileImages._files[i].extname,
                  related_id: firstpagesId // 关联 ID
                })
              }
            }
          }

          session.flash({
            type: 'success',
            message: `${ all.page_title } 页面添加成功。`
          })

          return response.route('admin/PageController.index')
          break;
        case 'save':
          await Database.table('pages').where('id', all.id).update({
            page_title: all.page_title,
            page_detail: all.detail || '',
            page_status: all.page_status,
            page_catalog_id: all.page_catalog_id || '',
            modified_at: Moment().format('YYYY-MM-DD HH:mm:ss')
          })

          // page_main_img
          if (request.file('page_main_img')) {
            const profileImages = request.file('page_main_img', {
              types: ['image'],
              size: '10mb'
            })

            await profileImages.moveAll(Helpers.publicPath(publicPath), (file) => {
              return {
                name: file.clientName,
                overwrite: true
              }
            })

            if (!profileImages.movedAll()) {
              return profileImages.errors()
            } else {
              for (var i = 0; i < profileImages._files.length; i++) {
                await Database.from('files').insert({
                  clientName: profileImages._files[i].clientName,
                  fileName: profileImages._files[i].fileName,
                  fieldName: profileImages._files[i].fieldName,
                  filePath: publicPath,
                  size: profileImages._files[i].size,
                  type: profileImages._files[i].type,
                  subtype: profileImages._files[i].subtype,
                  status: profileImages._files[i].status,
                  extname: profileImages._files[i].extname,
                  related_id: all.id // 关联 ID
                })
              }
            }
          }
          break;
      }

      return response.redirect('back')
    } catch (e) {
      console.log(e);
      session.flash({
        type: 'error',
        message: `${ e.message }`
      })
      return response.redirect('back')
    }
  }

  /**
   * Display a single page.
   * GET pages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({
    params,
    request,
    response,
    view
  }) {
    const page = await Database.table('pages').where({
      id: params.id,
      page_status: 1
    }).first()
    return view.render('admin.page.show', {
      data: {
        title: '详情',
        page
      }
    })
  }

  /**
   * Render a form to update an existing page.
   * GET pages/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({
    params,
    request,
    response,
    view,
    session
  }) {
    try {
      const pages = await Database.table('pages').where('id', params.id).first()
      pages['page_main_img'] = await Database.from('files').where({
        'related_id': pages.id,
        'fieldName': 'page_main_img[]'
      }).first()

      const page_catalog = await Database.table('settings').where('key', 'page_catalog').first()
      page_catalog.value = page_catalog.value ? JSON.parse(page_catalog.value) : {}

      return view.render('admin.page.edit', {
        data: {
          title: '编辑页面',
          active: 'page',
          pages,
          page_catalog
        }
      })
    } catch (e) {
      session.flash({
        type: 'error',
        message: `${ e.message }`
      })
      return response.redirect('back')
    }
  }

  /**
   * Update page details.
   * PUT or PATCH pages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({
    params,
    request,
    response
  }) {}

  /**
   * Delete a page with id.
   * DELETE pages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({
    params,
    request,
    response
  }) {}
}

module.exports = PageController
