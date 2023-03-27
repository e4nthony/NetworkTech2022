
/**
 * REST API - 
 * 
 * Getting server.ts ,
 * There creating http server.
 * 
 * (called 'app' before: [import app from './server'] )
 */
import http_server from './server' 

http_server.listen(process.env.PORT,()=>{
    console.log('Server started')    
})

export = http_server