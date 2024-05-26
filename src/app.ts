import express from 'express'
import { addCoursesRoutes } from './routes/courses'
import { db } from './db/db'
import { addTestRoutes } from './routes/tests'

export const app = express()

export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

addCoursesRoutes(app)
addTestRoutes(app, db)

export type App = typeof app
