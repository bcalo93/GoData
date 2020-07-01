const issuesService = require('../services/issues-service')
const log = require('../log');
const location = { location: 'issues-controller' };

const processIssues = async (req, res, next) => {
  log.info('Received POST',location)
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