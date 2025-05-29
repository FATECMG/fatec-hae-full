import { Request, RequestHandler, Response } from 'express'
import { EventContext } from 'firebase-functions'
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore'
import { Message } from 'firebase-functions/lib/providers/pubsub'

export interface Body {
  [key: string]: any
}

export interface ResponseReturn {
  statusCode?: number
  body?: Body
}
export type Handle = (req: Request, res?: Response) => Promise<ResponseReturn>
export type IPubSubHandle = (message: Message, context: EventContext) => any

export interface Handler {
  handle: Handle
}

export interface IFirestoreTrigger {
  handle: (change: QueryDocumentSnapshot, context: EventContext) => any
}
export interface IPubSubTrigger {
  handle: IPubSubHandle
}

export type Main = (handler: Handler | IPubSubTrigger) => RequestHandler
