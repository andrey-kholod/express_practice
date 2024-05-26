import request from 'supertest'
import { app } from '../../src/app'
import { CourseCreateModel } from '../../src/models/CourseCreateModel'
import { HTTP_STATUSES } from '../../src/routes/courses'
import { CourseViewModel } from '../../src/models/CourseViewModel'

describe('/course', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/__test__/data')
    })

    it('Should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(200, [])

    })

    it('Should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/1')
            .expect(404)
    })

    it('Should not create course with incorrect input data', async () => {
        await request(app)
            .post('/courses')
            .send({ title: '' })
            .expect(HTTP_STATUSES.BAD_REQUEST)
    })

    it('Should not create course with incorrect input data', async () => {
        const data: CourseCreateModel = { title: '' }
        await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST)

        await request(app)
            .get('/courses')
            .expect(200, [])
    })

    let createdCourse1: CourseViewModel;

    it('Should create course with correct input data', async () => {

        const data: CourseCreateModel = { title: 'it-incubator' }

        const response = await request(app)
            .post('/courses/')
            .send(data)
            .expect(HTTP_STATUSES.CREATED)

        createdCourse1 = response.body

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: 'it-incubator'
        })

        await request(app)
            .get('/courses')
            .expect(200, [createdCourse1])

    })

    let createdCourse2: CourseViewModel;

    it('Should create one more course with correct input data', async () => {
        const data: CourseCreateModel = { title: 'COURSE_2' }
        const createdCourse = await request(app)
            .post('/courses/')
            .send(data)
            .expect(HTTP_STATUSES.CREATED)

        createdCourse2 = createdCourse.body //response.body

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(200, createdCourse2)

    })

    it('Should not update course with incorrect input data', async () => {

        const data: CourseCreateModel = { title: '' }

        await request(app)
            .put('/courses/' + createdCourse1.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST)


        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(200, createdCourse1)

    })

    it('Should not update course that not exist', async () => {
        
        await request(app)
            .put('/courses/' + 1)
            .send({ title: 'good title' })
            .expect(HTTP_STATUSES.NOT_FOUND)

    })

    it('Should update course with correct input data', async () => {
        const { body: updatedCourse } = await request(app)
            .put('/courses/' + createdCourse1.id)
            .send({ title: 'good title' })
            .expect(HTTP_STATUSES.OK)

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(200, {
                ...updatedCourse,
                title: 'good title'
            })

    })

    it('Should update course with correct input data', async () => {
        await request(app)
            .delete('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NO_CONTENT)

        await request(app)
            .get('/courses' + createdCourse1.id)
            .expect(HTTP_STATUSES.NOT_FOUND)
    })

})
