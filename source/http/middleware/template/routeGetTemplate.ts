import * as router from 'koa-router'
import * as Koa from 'koa'
import * as _ from 'lodash'
import DB from '../../../db'
import * as fs from 'fs'
import { ITemplateUpdate, ITemplate } from '../report'
import * as crypto from 'crypto'
import * as config from '../../../config'
import * as path from 'path'

export default async function get(
    ctx: Koa.ParameterizedContext<{}, router.IRouterContext> | any,
    next: () => Promise<any>
) {
    const db: DB = _.get(ctx, 'db')
    const auth: any = _.get(ctx, 'user')
    const body: ITemplateUpdate = _.get(ctx, 'body')
    const tmpReport = await db.getDb()
        .collection('templates')
        .findOne({ _id: DB.toObjectId(ctx.params.id) })
    if (!tmpReport) {
        ctx.throw(500, `Template with name ${body.name}`)
    }
    const fullPathFile = path.resolve(config.default.report.templatePath, tmpReport.path)

    tmpReport.conent = fs.readFileSync(fullPathFile, 'base64')
    ctx.body = tmpReport
}