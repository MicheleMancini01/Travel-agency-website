// const conexion = require('../Modules/sqlScript')

exports.save = (req, res) => {
    const location = req.body.location;
    const image = req.body.image;
    const description = req.body.description;
    console.log(location, image, description)
}


