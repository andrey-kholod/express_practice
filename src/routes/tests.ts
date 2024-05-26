import { App } from "../app";
import { CourseType, DBType } from "../db/db";
import { HTTP_STATUSES } from "./courses";

export const addTestRoutes = (app: App, db: DBType) => {
    app.delete('/__test__/data', (req, res) => {
        db.courses = [];
        res.send(HTTP_STATUSES.NO_CONTENT)
    })
}