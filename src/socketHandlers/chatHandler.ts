import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

export = (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {

    type MsgPackage = {
        receiver: string,
        sender: string,
        message: string
    };

    const sendMessage = (payload) => {
        console.log('chat:send_message[event], info:' + payload)

        const receiver = payload.receiver

        const msgPackage: MsgPackage = {
            'receiver': receiver,
            'sender': socket.data.user,
            'message': payload.message
        }

        //send msgPackage directly to receiver (and event "chat:got_message")
        io.to(receiver).emit("chat:got_message", msgPackage)
    }

    console.log('register chat handlers')

    socket.on("chat:send_message", sendMessage)
    // socket.on("chat:receive_message", receiveMessage)
}
