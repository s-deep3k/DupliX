import {Router} from 'express'

const notificationRouter = Router()

notificationRouter.get('/notification',getNotification)
notificationRouter.delete('/:id',deleteNotification)