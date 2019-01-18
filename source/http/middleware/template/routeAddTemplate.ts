import * as router from 'koa-router'
import * as Koa from 'koa'
import * as _ from 'lodash'
import DB from '../../../db'
import * as fs from 'fs'
import { ITemplateAdd, ITemplate } from '../report'
import * as crypto from 'crypto'
import * as config from '../../../config'
import * as path from 'path'

export default async function add(
    ctx: Koa.ParameterizedContext<{}, router.IRouterContext> | any,
    next: () => Promise<any>
) {
    const db: DB = _.get(ctx, 'db')
    const auth: any = _.get(ctx, 'user')
    const body: ITemplateAdd = _.get(ctx.request, 'body')
    const tmpReport = await db.getDb()
        .collection('templates')
        .findOne({ name: body.name, owner: auth.data.id })
    if (tmpReport) {
        ctx.throw(500, `Template with name ${body.name}`)
    }
    if (!body.content) {
        ctx.throw(500, 'Template body is null')
    }
    const content = Buffer.from(body.content, 'base64')
    const hash = crypto.createHash('sha256')
    hash.update(content)
    const filename = `${body.name}_${hash.digest('hex')}`
    const fullPathFile = path.resolve(config.default.report.templatePath, filename)
    fs.writeFileSync(fullPathFile, content)
    let template: ITemplate = {
        name: body.name,
        title: body.title,
        params: body.params,
        path: filename,
        levelPermission: body.levelPermission || 'any',
        owner: auth.data.id
    }
    const result = await db.getDb()
        .collection('templates')
        .insertOne(template)
    if (result.result.ok) {
        ctx.body = {
            error: false,
            result: 'Template has add',
            templateId: result.insertedId.toHexString()
        }
    } else {
        ctx.throw(400, 'Error template add')
    }
}