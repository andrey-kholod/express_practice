import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../types'
import { CourseCreateModel } from '../models/CourseCreateModel'
import { CourseUpdateModel } from '../models/CourseUpdateModel'
import { GetCourseQueryModel } from '../models/GetCourseQueryModel'
import { URIParamsCourseIDModel } from '../models/URIParamsCourseIDModel'
import { Response } from 'express'
import { CourseViewModel } from '../models/CourseViewModel'
import { CourseType, db } from '../db/db'
import { App } from '../app'
// import { CourseType, HTTP_STATUSES, db, getCourseViewModel } from '../app'

export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title 
    }
}

export const HTTP_STATUSES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    NOT_FOUND: 404

}

export const addCoursesRoutes = (app: App) => {

    app.get('/courses', (req: RequestWithQuery<GetCourseQueryModel>,
        res: Response<CourseViewModel[]>) => { //Response<что возвращаем>
        let foundCoursesQuery = db.courses

        if (req.query.title) {
            foundCoursesQuery = foundCoursesQuery.filter(c => c.title.indexOf(req.query.title as string) > -1)
        }

        res.json(foundCoursesQuery.map(getCourseViewModel))
    })

    //URI параметр // Request<типизация URI, req.res, req.body, req.query>
    app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIDModel>, res: Response<CourseViewModel>) => {
        let found = db.courses.find(c => c.id === +req.params.id)

        if (!found) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            return
        }

        res.json(getCourseViewModel(found))
    })

    app.post('/courses', (req: RequestWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
            return //перрывание
        }
        console.log(req.body)
        const createdCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        }

        db.courses.push(createdCourse)

        res.status(HTTP_STATUSES.CREATED).json(getCourseViewModel(createdCourse))  //сначала задаем статус, а потом отправляем джсон
    })

    app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIDModel>, res: Response<CourseViewModel>) => { //no response
        const foundToDelete = db.courses.find(c => c.id === +req.params.id)
        if (!foundToDelete) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            return
        }
        db.courses = db.courses.filter(c => c.id !== +req.params.id)

        res.status(HTTP_STATUSES.NO_CONTENT).json(getCourseViewModel(foundToDelete))
    })

    app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIDModel, CourseUpdateModel>, res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
            return
        }

        let found = db.courses.find(c => c.id === +req.params.id)

        if (!found) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            return
        }

        found.title = req.body.title

        res.json(getCourseViewModel(found))
    })

}