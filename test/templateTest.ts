import * as db from 'mongo-mock'
import * as DB from '../source/db'
import * as config from '../source/config'
import { expect } from 'chai'
import { Certificate } from '@hazpro/auth/build/cert'
import * as fs from 'fs'
//
import * as addTemplate from '../source/http/middleware/template/routeAddTemplate'
import * as listTemplate from '../source/http/middleware/template/routeListTemplate'
import * as getTemplate from '../source/http/middleware/template/routeGetTemplate'
import * as updateTemplate from '../source/http/middleware/template/routeUpdateTemplate'
import * as removeTemplate from '../source/http/middleware/template/routeRemoveTemplate'
import * as _ from 'lodash'

const loggerMock = {
    log: (level, msg) => {
        console.log(level, msg)
    }
}

async function next() { }

describe('template test', () => {

    let dbClass: DB.default = null
    let ca: Certificate = null
    let templateId: any = null

    before(async () => {
        ca = Certificate.fromFile('./assets')
        db.MongoClient.persist = "template-db-test.js"
        dbClass = new DB.default(config.default, loggerMock, db.MongoClient)
        await dbClass.connect()
    })
    it('add new template', async () => {
        let ctx = {
            db: dbClass,
            request: {
                body: {
                    name: 'testService',
                    content: 'YWtzZGphbHNrZGphc2pkYXNk',
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
        await addTemplate.default(ctx, next)
        templateId = _.get(ctx, 'body.templateId')
    })
    it('update exists template', async () => {
        let ctx = {
            db: dbClass,
            request: {
                body: {
                    name: 'testService',
                    content: 'YWtzZGphbHNrZGphc2pkYXNkIGthcyBhc2xrZA==',
                    title: 'nals sandj ansj'
                }
            },
            params: {
                id: templateId
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
        await updateTemplate.default(ctx, next)
    })
    it('get template', async () => {
        let ctx = {
            db: dbClass,
            request: {
                body: {
                    name: 'testService',
                    content: 'YWtzZGphbHNrZGphc2pkYXNkIGthcyBhc2xrZA==',
                    title: 'nals sandj ansj'
                }
            },
            params: {
                id: templateId
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
        await getTemplate.default(ctx, next)
    })
    it('list of template', async () => {
        let ctx = {
            db: dbClass,
            request: {
                body: {
                    name: 'testService',
                    content: 'YWtzZGphbHNrZGphc2pkYXNkIGthcyBhc2xrZA==',
                    title: 'nals sandj ansj'
                }
            },
            params: {
                id: templateId
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

        await listTemplate.default(ctx, next)
    })
    it('remove template', async () => {
        let ctx = {
            db: dbClass,
            request: {
                body: {
                    name: 'testService',
                    content: 'YWtzZGphbHNrZGphc2pkYXNkIGthcyBhc2xrZA==',
                    title: 'nals sandj ansj'
                }
            },
            params: {
                id: templateId
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

        await removeTemplate.default(ctx, next)
    })
})