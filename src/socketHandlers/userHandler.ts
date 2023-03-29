
import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import userController from "../controllers/user"

export = (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {

    //callbacks list:
    const getAllUsers = async (payload) => {
        // console.log("getAllUsers handler")

        const res = await userController.getAllUsersEvent(payload.req, payload.res);

        socket.emit('post:get_all', res)
    }

    const getUserById = (payload) => {
        socket.emit('echo:echo', payload)
    }

    socket.on("user:get_all", getAllUsers)
    socket.on("user:get_by_id", getUserById)
}
