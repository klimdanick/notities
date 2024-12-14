export type Note = {
    id: string
    title: string
    content: string
    users: [string]
    created_at: string
    updated_at?: string
}

export type Token = {
    token: string,
    expiration: Date,
    username: string
}

export type Timer = {
    duration: number,
    running: boolean,
    startTime: Date
}

declare global {
    namespace Express {
        interface Request {
            token: Token
        }
    }
}
