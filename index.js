const path = require('path')

const app = require(path.join(__dirname, 'app'))

app.listen(3000, () => {
  console.log('App listening on port 3000')
})
