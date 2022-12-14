// const passport = require('../config/passport.js')

const adminServices = require('../../services/admin-services.js')

const adminController = {
  //  ADMIN PRODUCT 路由
  loginPage: (req, res) => {
    res.render('admin/login')
  },
  // login: passport.authenticate('local', {
  //   successRedirect: '/',
  //   failureRedirect: '/admin/login',
  //   failureFlash: true

  // }),
  // logout: (req, res, next) => {
  //   req.flash('success_messages', '成功登出')
  //   req.logout()
  //   res.redirect('/admin/login')
  // },
  getProducts: (req, res, next) => {
    adminServices.getProducts(req, (err, data) => err ? next(err) : res.json({ 'status': 'success', data }))
  },
  createProduct: (req, res, next) => {
    adminServices.createProduct(req, (err, data) => err ? next(err) : res.json({ 'status': 'success', data }))
  },
  postProduct: (req, res, next) => {
    adminServices.postProduct(req, (err, data) => err ? next(err) : res.json({ 'status': 'success', data } ))
  },
  getProduct: (req, res, next) => {
    adminServices.getProduct(req, (err, data) => err ? next(err) : res.json({ 'status': 'success', data }))
  },
  // editProduct 路由 可以用 createProduct, getProduct 拿到資掉
  putProduct: (req, res, next) => {
    adminServices.putProduct(req, (err, data) => err ? next(err) : res.json({ 'status': 'success', data }))
  },
  deleteProduct: (req, res, next) => {
    adminServices.deleteProduct(req, (err, data) => err ? next(err) : res.json({ 'status': 'success', data }))
  }
}

module.exports = adminController