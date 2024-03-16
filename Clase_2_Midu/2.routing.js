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
                    let body = ''
                    
                    
                    // Escuchar el evento data
                    req.on('data', chunk => {
                        body += chunk.toString()
                    })

                    req.on('end', () => {
                        const data = JSON.parse(body);
                        // Llamar a una base de datos para guardar la info
                        res.writeHead(201, {'Contnt-Type': 'application/json; charset=utf-8'})

                        data.timestamp = Date.now()
                        res.end(JSON.stringify(data))

                    })

                    break
                }

                default:
                    res.statusCode = 404
                    res.setHeader('Content-type', 'text/plain; charset=utf-8')
                    return res.end('404 Not Found')


            }
    }

}

const server = http.createServer(processRequest);


server.listen(1234, () => {
    console.log(`Server listening on port http://localhost:1234`)
})