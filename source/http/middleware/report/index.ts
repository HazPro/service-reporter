import * as router from 'koa-router'
import * as Koa from 'koa'
import * as _ from 'lodash'
import DB from '../../../db'
import * as carbone from 'carbone'
import * as config from '../../../config'
import * as path from 'path'

export interface ITemplate {
    name: string,
    title: string,
    path: string,
    params: any,
    levelPermission: string,
    owner: string
}
export interface ITemplateAdd {
    name: string,
    title: string,
    content: string,
    params?: any
    levelPermission?: string
}
export interface ITemplateUpdate {
    name?: string,
    title?: string,
    content?: string,
    params?: any
    levelPermission?: string
}


export default async function report(
    ctx: Koa.ParameterizedContext<{}, router.IRouterContext> | any,
    next: () => Promise<any>
) {
    const db: DB = _.get(ctx, 'db')
    const body = _.get(ctx, 'request.body')

    const tmpReport = await db.getDb()
        .collection('templates')
        .findOne({ _id: DB.toObjectId(ctx.params.template) })
    const fullPathFile = path.resolve(config.default.report.templatePath, tmpReport.path)
    const cabone = new Promise((resolve, reject) => {
        carbone.render(
            fullPathFile,
            body,
            { convertTo: ctx.params.format == 'xml' ? undefined : ctx.params.format },
            (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
    })
    const data = await Promise.resolve(cabone)
    switch (ctx.params.format) {
        case 'pdf':
            ctx.set('Content-Type', 'application/pdf')
            break
        case 'xlsx':
            ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            break
        case 'xls':
            ctx.set('Content-Type', 'application/vnd.ms-excel')
            break
    }
    ctx.body = data
}