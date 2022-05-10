const uuid = require('uuid')
const path = require('path')
const User = require('../models/User')

const PDFDocument = require('pdfkit')
const fs = require('fs')

class UserContraoller {
  async getAll(req, res) {
    try {
      const users = await User.find()
      return res.json(users)
    } catch (e) {
      res.status(500).json({ message: 'get all error' })
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const user = await User.findOne(id)
      if (!user) {
        return res.status(400).json({ message: 'user not found' })
      }
      return res.json(user)
    } catch (e) {
      res.status(500).json({ message: 'get one error' })
    }
  }

  async update(req, res) {
    try {
      const user = req.body
      const { id } = req.user
      let image

      if (!id) {
        res.status(400).json({ message: 'id not found' })
      }
      if (req.files) {
        image = req.files.image
        let fileName = uuid.v4() + '.jpg'
        image.mv(path.resolve(__dirname, '..', 'static', fileName))
        user.image = fileName
      }
      const updatedUser = await User.findByIdAndUpdate(id, user, {
        new: true,
      })
      return res.json(updatedUser)
    } catch (e) {
      res.status(500).json({ message: 'update error' })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.user
      const user = await User.findByIdAndDelete(id)
      if (!user) {
        return res.status(500).json({ message: 'user not found' })
      }
      return res.json(user)
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: 'delete error' })
    }
  }

  async makePdf(req, res) {
    try {
      const doc = new PDFDocument()
      let fileName = uuid.v4() + '.pdf'
      const { email } = req.body
      const user = await User.findOne({ email })
      const pdfPath = path.resolve(__dirname, '..', 'static', 'pdf', fileName)
      if (!user) {
        return res.status(400).json({ message: 'user not found' })
      }

      doc.pipe(fs.createWriteStream(pdfPath))

      doc.fontSize(27).text(`${user.firstName} ${user.lastName}`, 100, 100)
      doc.image(path.resolve(__dirname, '..', 'static', user.image), {
        fit: [300, 300],
        align: 'center',
        valign: 'center',
      })

      doc.end()

      user.pdf = doc
      await user.save()
      return res.json({ message: true })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: false })
    }
  }
}

module.exports = new UserContraoller()
