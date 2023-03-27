
/**
 * REST API - main server
 * 
 * Getting server.ts ,
 * There creating http server.
 * 
 * (called 'app' before: [import app from './server'] )
 */
import http_server from './server'

/**
 * Socket.io - additional server for android app requests
 * 
 * Getting socket_server.ts ,
 * From there Getting io() function.
 * 
 * ( io() creates socket.io )
 */
import io from './socket_server'

/**
 * Constructor of socket.io from socket_server.ts 
 * with 'http_server' from server.ts
 */
io(http_server);

http_server.listen(process.env.PORT, () => {
    console.log('Server started')
})

export = http_server