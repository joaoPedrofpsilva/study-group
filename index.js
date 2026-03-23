const http = require('http');

const server = http.createServer((req,res) => {

    if(req.url === '/thiago' && req.method === 'GET'){
        res.end('Olá, rota do thiago')
    }
})
server.listen(3000, () => {
    console.log('Funcionando porta 3000')
})