const nodemailer = require('nodemailer')
const Product = require('../models/product.js')

const linkData = [
  {
    model: 'ZENTAI SUIT GPZ-02',
    url: 'http://goukaou.blog131.fc2.com/blog-entry-424.html'
  },
  {
    model: 'ZENTAI SUIT GPZ-02-C',
    url: 'http://goukaou.blog131.fc2.com/blog-entry-359.html'
  },
  {
    model: 'Super Thick Zentai Suit GPZ-03',
    url: 'http://goukaou.blog131.fc2.com/blog-entry-449.html'
  },
  {
    model: 'Zentai Suit GPZ-04',
    url: 'http://goukaou.blog131.fc2.com/blog-entry-511.html'
  }
]

const productServices = {
  getHome: (req, cb) => {
    const data = { message: null }
    cb(null, { img: data })
  },
  getGoukaou: (req, cb) => {
    const data = { message: null }
    cb(null, { img: data })
  },
  getMaskOnSale: (req, cb) => {
    return Product
      .find({ production: 'true', category: 'mask' })
      .lean()
      .then((products) => {
        if (!products) {
          const err = new Error('沒有找到產品資料!')
          err.status = 404
          throw err
        }
        const newProducts = products.map(p => {
          return {
            ...p,
            introduction: p.introduction ? p.introduction.substring(0, 60) + '...' : null
          }
        })
        return cb(null, {
          products: newProducts
        })
      })
      .catch((err) => cb(err))
  },
  getMaskOffSale: (req, cb) => {
    return Product.find({ production: 'false', category: 'mask' })
      .lean()
      .then((products) => {
        if (!products) {
          const err = new Error('沒有找到產品資料!')
          err.status = 404
          throw err
        }
        const newProducts = products.map(p => {
          return {
            ...p,
            introduction: p.introduction ? p.introduction.substring(0, 60) + '...' : null
          }
        })
        return cb(null, {
          products: newProducts
        })
      })
      .catch((err) => cb(err))
  },
  getOnSaleImg: (req, cb) => {
    const _id = req.params.productId
    return Product.findOne({ _id })
      .lean()
      .then((product) => {
        if (!product) {
          const err = new Error('沒有這個產品!')
          err.status = 404
          throw err
        }
        cb(null, { product })
      })
      .catch((err) => cb(err))
  },
  getOffSaleImg: (req, cb) => {
    const _id = req.params.productId
    return Product.findOne({ _id })
      .lean()
      .then((product) => {
        if (!product) {
          const err = new Error('沒有這個產品!')
          err.status = 404
          throw err
        }
        cb(null, { product })
      })
      .catch((err) => cb(err))
  },
  getZentaiSuit: (req, cb) => {
    let imgLength = 0
    return Product.find({ category: 'zentai' })
      .lean()
      .then((products) => {
        if (!products) {
          const err = new Error('沒有找到產品資料!')
          err.status = 404
          throw err
        }
        let newProducts
        products = products.map((item, _iIndex) => {
          linkData.forEach((j, _jIndex) => {
            if (j.model === item.model) {
              item = { ...item, url: j.url }
            }
          })
          return item
        })
        newProducts = products.sort((a, b) => {
          const indexOfa = a.model.indexOf('-')
          const indexOfb = b.model.indexOf('-')
          const newA = a.model.substr(indexOfa + 1, 2)
          const newB = b.model.substr(indexOfb + 1, 2)
          if (Number(newA) < Number(newB)) {
            return -1
          }
          return 0
        })
        newProducts = newProducts.map((item, _index) => {
          item.imgUrl = item.imgUrl.map((j, indexJ) => {
            j = { ...j, id: imgLength + indexJ + 1 }
            return j
          })
          imgLength += item.imgUrl.length
          return item
        })
        cb(null, { products: newProducts, imgLength })
      })
      .catch((err) => cb(err))
  },
  getContact: (req, cb) => {
    const data = { message: null }
    cb(null, { link: data })
  },
  postContact: async (req, cb) => {
    try {
      const { name, email, subject, message } = req.body
      let msg_error = ''
      let msg_success
      if (!name || !email || !subject || !message) {
        msg_error = {
          name: '訪問者',
          message: '你沒有輸入訊息!'
        }
        return cb(null, { msg_error: msg_error })
      }

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure: false,
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      })
      const output = `
      <p> You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>
        <li>Name: ${req.body.name} </li>
        <li>subject: ${req.body.subject} </li>
        <li>Email: ${req.body.email} </li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `
      msg_success = {
        name: `${req.body.name}`,
        message: '詢問信件己送出。'
      }
      const info = await transporter.sendMail({
        from: `Nodemailer Contact ${process.env.EMAIL_USERNAME}`,
        to: 'tom9876555@gmail.com',
        subject: 'Node Contact Request',
        text: 'Hello world?',
        html: output
      })
      // console.log("Message sent: %s", info.messageId);
      // console.log(info)
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
      return cb(null, { msg_success: msg_success })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = productServices