import * as router from 'koa-router'
import * as Koa from 'koa'
import * as _ from 'lodash'
import DB from '../../../db'


export default async function remove(
    ctx: Koa.ParameterizedContext<{}, router.IRouterContext> | any,
    next: () => Promise<any>
) {
    const db: DB = _.get(ctx, 'db')
    const auth: any = _.get(ctx, 'user')
    const result = await db.getDb()
        .collection('templates')
        .remove({ owner: auth.data.id, _id: DB.toObjectId(ctx.params.id) })
    
    ctx.body = {
        error: false,
        result: "Template has been removed"
    }
}