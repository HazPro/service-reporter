import * as router from 'koa-router'
import * as Koa from 'koa'
import * as _ from 'lodash'
import DB from '../../../db'
import * as fs from 'fs'
import { ITemplateUpdate, ITemplate } from '../report'
import * as crypto from 'crypto'
import * as config from '../../../config'
import * as path from 'path'

export default async function update(
    ctx: Koa.ParameterizedContext<{}, router.IRouterContext> | any,
    next: () => Promise<any>
) {
    const db: DB = _.get(ctx, 'db')
    const auth: any = _.get(ctx, 'user')
    const body: ITemplateUpdate = _.get(ctx, 'request.body')
    const tmpReport = db.getDb()
        .collection('templates')
        .findOne({ id: ctx.params.id })
    if (!tmpReport) {
        ctx.throw(500, `Template with name ${body.name}`)
    }
    let filename: string = undefined
    if (body.content) {
        const content = Buffer.from(body.content, 'base64')
        const hash = crypto.createHash('sha256')
        hash.update(content)
        filename = `${body.name}_${hash.digest('hex')}`
        const fullPathFile = path.resolve(config.default.report.templatePath, filename)
        fs.writeFileSync(fullPathFile, content)
    }
    let template: ITemplate = {
        name: body.name,
        title: body.title,
        params: body.params,
        path: filename,
        levelPermission: body.levelPermission,
        owner: auth.data.id
    }
    const result = await db.getDb()
        .collection('templates')
        .updateOne(
            { _id: DB.toObjectId(ctx.params.id) },
            Object.assign(tmpReport, template)
        )
    if (result.result.ok) {
        ctx.body = {
            error: false,
            result: 'Template has updated'
        }
    } else {
        ctx.throw(400, 'Error template update')
    }
}