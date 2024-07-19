import {Router} from 'express'
import {protectRoute} from '../middlewares/protectRoute.js'
import { deleteNotifications, getNotification } from '../controllers/notification.controller.js'

const notificationRouter = Router()

notificationRouter.get('/',protectRoute,getNotification)
notificationRouter.delete('/',protectRoute,deleteNotifications)

export default notificationRouter