const Product = require('../models/product.js')
const Category = require('../models/category.js')
const Model = require('../models/model.js')
const passport = require('../config/passport.js')

const { getSkip, getPagenation } = require('../tools/pagination.js')
const { imgurFileHandler, imgurManyFileHandler
} = require('../tools/file-heplers.js')

const adminController = {
  getProducts: (req, cb) => {
    1
    const DEFAULT_LIMIT = 8
    const limit = Number(req.params.limit) || DEFAULT_LIMIT
    const page = Number(req.query.page) || 1
    return Promise.all([
      Product.find()
        .lean()
        .sort({ _id: 'asc' })
        .limit(limit)
        .skip(getSkip(page, limit)),
      Product.countDocuments()
    ])
      .then(([products, productCount]) => {
        if (!products) throw new Error('找不到產品!')
        if (!productCount) throw new Error('找不到產品數量!')
        const data = products
        cb(null, { products: data, pagenation: getPagenation(page, limit, productCount) })
      })
      .catch(err => cb(err))
  },
  createProduct: (req, cb) => {
    return Promise.all([
      Category.find().lean(),
      Model.find().lean()
    ])
      .then(([categories, models]) => {
        if (!categories) throw new Error('找不到類別資料!')
        if (!models) throw new Error('找不到模型資料!')
        const data = { categories, models }
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  postProduct: (req, cb) => {
    const { name, categoryId, basePrice, highestPrice, production, introduction, modelId } = req.body
    const { sampleImg, imgUrl } = req.files
    if (!name || !categoryId || !basePrice, !highestPrice || !production || !modelId) throw new Error('新增的產品所有欄位都要填寫。')
    if (sampleImg || imgUrl) {
      return Promise.all([
        Product.findOne({ name }).lean(),
        imgurFileHandler(sampleImg),
        imgurManyFileHandler(imgUrl),
        Category.find(),
        Model.find()
      ]).then(([checkName, productSampleImg, productImgUrl, categories, models]) => {
        if (checkName) throw new Error('這個名稱己用過，請更換!')
        if (!categories) throw new Error('找不到類別資料!')
        if (!models) throw new Error('找不到模型資料!')
        const category = categories.find(item => item._id.toString() === categoryId.toString()).name
        const model = models.find(item => item._id.toString() === modelId.toString()).name
        return Product.create({
          name,
          category,
          model,
          basePrice,
          highestPrice,
          production,
          introduction,
          sampleImg: sampleImg ? productSampleImg : null,
          imgUrl: imgUrl ? productImgUrl : null,
          categoryId,
          modelId
        })
          .then(product => {
            const data = product
            return cb(null, { product: data })
          })
      })
        .catch(err => cb(err))
    } else {
      return Promise.all([
        Product.findOne({ name }).lean(),
        Category.find(),
        Model.find()
      ])
        .then(([checkName, categories, models]) => {
          if (checkName) throw new Error('這個名稱己用過，請更換!')
          if (!categories) throw new Error('找不到類別資料!')
          if (!models) throw new Error('找不到模型資料!')
          const category = categories.find(item => item._id.toString() === categoryId.toString()).name
          const model = models.find(item => item._id.toString() === modelId.toString()).name
          return Product.create({
            name,
            category,
            model,
            basePrice,
            highestPrice,
            production,
            introduction,
            sampleImg: null,
            imgUrl: null,
            categoryId,
            modelId
          })
        })
        .then(product => {
          const data = product
          return cb(null, { product: data })
        })
        .catch(err => cb(err))
    }
  },
  getProduct: (req, cb) => {
    const productId = req.params.productId
    return Product
      .findById(productId)
      .lean()
      .then(product => {
        if (!product) throw new Error('找不到此產品!')
        const data = product
        return cb(null, { product: data })
      })
      .catch(err => cb(err))
  },
  editProduct: (req, cb) => {
    const productId = req.params.productId
    return Promise.all([
      Product.findById(productId).lean(),
      Category.find().lean(),
      Model.find().lean()
    ])
      .then(([product, categories, models]) => {
        if (!product) throw new Error('找不到這個產品!')
        if (!categories) throw new Error('找不到類別資料!')
        if (!models) throw new Error('找不到模型資料!')
        const data = { product, categories, models }
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  putProduct: (req, cb) => {
    const productId = req.params.productId
    const { name, categoryId, basePrice, highestPrice, production, introduction, modelId } = req.body
    const { sampleImg, imgUrl } = req.files
    if (sampleImg || imgUrl) {
      return Promise.all([
        Product.find({ _id: { $nin: [productId] } }).lean(),
        imgurFileHandler(sampleImg),
        imgurManyFileHandler(imgUrl),
        Product.findById(productId).lean(),
        Category.find().lean(),
        Model.find().lean()
      ])
        .then(([products, productSampleImg, productImgUrl, product, categories, models]) => {
          const checkName = products.some(p => p.name === name)
          if (checkName) throw new Error('這個名稱己用過，請更換!')
          if (!product) throw new Error('找不到這個產品!')
          if (!categories) throw new Error('找不到類別資料!')
          if (!models) throw new Error('找不到模型資料!')
          const category = categories.find(item => item._id.toString() === categoryId.toString()).name
          const model = models.find(item => item._id.toString() === modelId.toString()).name
          return Product.updateOne({ _id: productId },
            {
              name,
              category,
              model,
              basePrice,
              highestPrice,
              production,
              introduction,
              sampleImg: sampleImg ? productSampleImg : product.sampleImg,
              imgUrl: imgUrl ? productImgUrl : product.imgUrl,
              categoryId,
              modelId
            })
        })
        .then((product) => {
          const data = product
          return cb(null, { product: data })
        })
        .catch(err => cb(err))
    } else {
      return Promise.all([
        Product.find({ _id: { $nin: [productId] } }).lean(),
        Product.findById(productId).lean(),
        Category.find().lean(),
        Model.find().lean()
      ])
        .then(([products, product, categories, models]) => {
          const checkName = products.some(p => p.name === name)
          if (checkName) throw new Error('這個名稱己用過，請更換!')
          if (!product) throw new Error('找不到這個產品!')
          if (!categories) throw new Error('找不到類別資料!')
          if (!models) throw new Error('找不到模型資料!')
          const category = categories.find(item => item._id.toString() === categoryId.toString()).name
          const model = models.find(item => item._id.toString() === modelId.toString()).name
          if (!product) throw new Error('找不到這個產品!')
          return Product.updateOne({ _id: productId },
            {
              name,
              category,
              model,
              basePrice,
              highestPrice,
              production,
              introduction,
              sampleImg: sampleImg ? productSampleImg : product.sampleImg,
              imgUrl: imgUrl ? productImgUrl : product.imgUrl,
              categoryId,
              modelId
            })
        })
        .then((product) => {
          const data = product
          return cb(null, { product: data })
        })
        .catch(err => cb(err))
    }
  },
  deleteProduct: (req, cb) => {
    const productId = req.params.productId
    return Product
      .findById(productId)
      .lean()
      .then(product => {
        if (!product) throw new Error('找不到這個產品!')
        return Product.deleteOne({ _id: productId })
      })
      .then((product) => {
        const data = product
        return cb(null, { product: data })
      })
      .catch(err => cb(err))
  }
}

module.exports = adminController