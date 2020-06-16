const issuesService = require('../services/issues-service')

const processIssues = async (req, res, next) => {
  console.log('Received POST')
  const issues = req.body
  try {
    await issuesService.processIssues(issues)
    res
      .status(201)
      .send('Ok')
    next()
  } catch(error) {
    res
      .status(500)
      .send(error)
    next(error)
  }
  
}

module.exports = {
  processIssues
}