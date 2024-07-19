import {Router} from 'express'

const notificationRouter = Router()

notificationRouter.get('/notification',protectRoute,getNotification)
notificationRouter.delete('/:id',protectRoute,deleteNotification)