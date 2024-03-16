const http = require('node:http');

// commonJS -> modulos clasicos de node
const dittoJSON = require('./pokemon/ditto.json')

const processRequest = (req,res) => {
    const {method, url} = req;

    switch (method) {
        case 'GET':
            switch (url){
                case '/pokemon/ditto':
                    res.setHeader('Content-type', 'text/html; charset-utf=8')
                    return res.end(JSON.stringify(dittoJSON))
                default:
                    res.statusCode = 404
                    res.setHeader('Content-type', 'text/html; charset=utf-8')
                    return res.end('<h1> 404 </h1>')
            }
        case 'POST':   
            switch (url){
                case '/pokemon': {
                    const body = ''
                }
                    // ???
            }
    }

}

const server = http.createServer(processRequest);


server.listen(1234, () => {
    console.log(`Server listening on port http://localhost:1234`)
})