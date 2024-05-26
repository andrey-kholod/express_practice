export type CourseType = {
    id: number
    title: string
    studentsCount: number
}

export type DBType = { courses: CourseType[] } 

export const db: DBType = {
    courses: [
        { id: 1, title: 'front-end', studentsCount: 0 },
        { id: 2, title: 'front-end', studentsCount: 0 },
        { id: 3, title: 'automation', studentsCount: 0 },
        { id: 4, title: 'devops', studentsCount: 0 },
    ]
}