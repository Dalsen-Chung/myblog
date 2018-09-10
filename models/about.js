const About = require('../lib/mongo').About

module.exports = {
  getAbout: () => {
    return About.find().exce()
  }
}
