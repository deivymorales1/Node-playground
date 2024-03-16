const http = require('node:http');
const fs = require('fs')

const desirePort = process.env.PORT ?? 1234

const processRequest = (req, res) => {
    
    if(req.url === '/'){
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html, charset=utf-8')
        res.end('Bienvenido a mi pagina de inicio')
    } else if(req.url === '/imagen'){

        fs.readFile('./3.jpeg', (err,data) => {
            if(err){
                res.statusCode= 500
                res.end('<h1>500 internal server error </h1>')
            } else{
                res.setHeader('Content-type', 'image/jpeg')
                res.end(data)
            }
        })
    }

}

const server = http.createServer(processRequest);

server.listen(desirePort, () => {
    console.log(`Server listening on port http://localhost:${desirePort}`);
})

