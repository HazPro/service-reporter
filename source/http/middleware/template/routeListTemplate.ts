import * as router from 'koa-router'
import * as Koa from 'koa'
import * as _ from 'lodash'
import DB from '../../../db'


export default async function list(
    ctx: Koa.ParameterizedContext<{}, router.IRouterContext> | any,
    next: () => Promise<any>
) {
    const db: DB = _.get(ctx, 'db')
    const auth: any = _.get(ctx, 'user')
    const tmpReport = await db.getDb()
        .collection('templates')
        .find({ owner: auth.data.id })
        .toArray()
    ctx.body = {
        error: false,
        result: tmpReport
    }
}