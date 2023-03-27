import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

/**
 * @gets io - server, socket - Socket
 */
export = (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {

    /**
     * 
     * @param payload whats wassended in event
     */
    const echoHandler = (payload) => {
        console.log("echoHandler emit echo:echo_res ")
        socket.emit('echo:echo_res', payload)
    }

    //// add new handlers like this:
    // const readHandler = (payload) => {
    //     // ...
    // }

    console.log('register echo handlers')
    socket.on("echo:echo", echoHandler)
    // socket.on("echo:read", readHandler)
}
