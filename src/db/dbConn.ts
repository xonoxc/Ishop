import mongoose from "mongoose"

interface Connection {
    isConnected?: number
}

const connection: Connection = {}

export async function connectToDatabase(): Promise<void> {
    if (connection.isConnected) {
        console.log("Database connection already exsists!")
        return
    }

    console.log(process.env.MONGODB_URI)

    try {
        const db = await mongoose.connect(
            `${process.env.MONGODB_URI!}/estore`,
            {
                bufferCommands: true,
                maxPoolSize: 10,
            }
        )

        connection.isConnected = db.connections[0].readyState

        console.log(
            "Database connection successfull! Host:",
            db.connection.host
        )
    } catch (error) {
        console.error(
            `Error occured wile connecting to the database : ${error}`
        )
        process.exit(1)
    }
}
