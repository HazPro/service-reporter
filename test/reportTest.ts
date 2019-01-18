import * as db from 'mongo-mock'
import * as DB from '../source/db'
import * as config from '../source/config'
import { expect } from 'chai'
import * as fs from 'fs'
import * as _ from 'lodash'
import * as report from '../source/http/middleware/report'
import { Certificate } from '@hazpro/auth/build/cert'
import * as addTemplate from '../source/http/middleware/template/routeAddTemplate'

const loggerMock = {
    log: (level, msg) => {
        console.log(level, msg)
    }
}


describe('report test', () => {
    let dbClass: DB.default = null
    let ca: Certificate = null
    let templateId: any = null
    before(async () => {
        ca = Certificate.fromFile('./assets')
        db.MongoClient.persist = "template-db-test.js"
        dbClass = new DB.default(config.default, loggerMock, db.MongoClient)
        await dbClass.connect()
        let ctx = {
            db: dbClass,
            request: {
                body: {
                    name: 'testReportTemplate',
                    content: 'PHRlc3Q+e2QubmFtZX08L3Rlc3Q+',
                    title: 'nals sandj ansj'
                }
            },
            ca,
            user: {
                data: {
                    id: "nafoiefnelrkam"
                }
            },
            throw: (code, msg) => {
                throw new Error(msg)
            }
        }
        await addTemplate.default(ctx, async () => { })
        templateId = _.get(ctx, 'body.templateId')
    })
    it('render report', async () => {
        let ctx = {
            db: dbClass,
            request: {
                body: {
                    name: 'testReportTemplate',
                    content: 'PHRlc3Q+e25hbWV9PC90ZXN0Pg==',
                    title: 'nals sandj ansj'
                }
            },
            ca,
            user: {
                data: {
                    id: "nafoiefnelrkam"
                }
            },
            params: {
                template: templateId,
                format: 'xml'
            },
            throw: (code, msg) => {
                throw new Error(msg)
            }
        }
        await report.default(ctx, async () => { })
        const body = _.get(ctx, 'body')
        console.log(body)
    })
    it('renedr not exist report', () => {

    })
})