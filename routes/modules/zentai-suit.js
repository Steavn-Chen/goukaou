const express = require('express')
const router = express.Router()
const Product = require('../../models/product.js')

const linkData = [
  {
    model: 'ZENTAI SUIT GPZ-02',
    url: 'http://goukaou.blog131.fc2.com/blog-entry-424.html',
  },
  {
    model: 'ZENTAI SUIT GPZ-02-C',
    url: 'http://goukaou.blog131.fc2.com/blog-entry-359.html',
  },
  {
    model: 'Super Thick Zentai Suit GPZ-03',
    url: 'http://goukaou.blog131.fc2.com/blog-entry-449.html',
  },
  {
    model: 'Zentai Suit GPZ-04',
    url: 'http://goukaou.blog131.fc2.com/blog-entry-511.html',
  },
]

router.get('/', (req, res) => {
  let imgLength = 0
  return Product.find({ category: 'zentai'})
  .lean()
  .then((products) => {
      let newProducts = products.map((item, index) => {
        linkData.forEach((j, jIndex) => {
          if (j.model === item.model) {
              item = { ...item, url: j.url }
            }
        })
        return item
      })
      newProducts = newProducts.sort((a, b) => {
        const indexOfa = a.model.indexOf('-')
        const indexOfb = b.model.indexOf('-')
        const newA = a.model.substr(indexOfa + 1, 2)
        const newB = b.model.substr(indexOfb + 1, 2)
        if (Number(newA) < Number(newB)) {
          return -1
        }
      })
       newProducts = newProducts.map((item, index) => {
         item.imgUrl = item.imgUrl.map((j, indexJ) => {
           j = { ...j, id: imgLength + indexJ + 1 }
           return j
         })
         imgLength += item.imgUrl.length
         return item
       })
      res.render('zentai-suit', { products: newProducts, imgLength })
    })
    .catch((err) => console.error(err))
})

module.exports = router

// router.get('/', (req, res) => {
//   return Product.find({ category: 'zentai' })
//     .lean()
//     .then((products) => {
//       let imgLength = 0
//       let newProducts = products.map((item, index) => {
//         linkData.forEach((j, jIndex) => {
//           if (j.model === item.model) {
//             // if (jIndex === index) {
//             item = { ...item, url: j.url }
//           }
//         })
//         return item
//       })
//       newProducts = newProducts.map((item, index) => {
//         item.imgUrl = item.imgUrl.map((j, indexJ) => {
//           j = { ...j, id: imgLength + indexJ + 1 }
//           return j
//         })
//         imgLength += item.imgUrl.length
//         return item
//       })
//       newProducts = newProducts.sort((a, b) => {
//         console.log('a.model', a.model)
//         const indexOfa = a.model.indexOf('-')
//         const indexOfb = b.model.indexOf('-')
//         const newA = a.model.substr(indexOfa + 1, 2)
//         const newB = b.model.substr(indexOfb + 1, 2)
//         // console.log('newA', newA)
//         console.log('b.modle', b.model)
//         // console.log(typeof newA)
//         console.log(newA, newB)
//         console.log(Number(newA), Number(newB))
//         if (Number(newA) < Number(newB)) {
//           return -1
//         }
//       })
//       console.log(newProducts)
//       res.render('zentai-suit', { products: newProducts, imgLength })
//     })
//     .catch((err) => console.error(err))
// })
