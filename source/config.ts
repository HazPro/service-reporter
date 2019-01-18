export interface IConfig {
    db: {
        url: string,
        name: string
        opt?: object
    }
    ca: string
    http: {
        port: number
    }
    report: {
        templatePath: string
    }
}
export default {
    db: {
        url: process.env.DB_URL || 'mongodb://localhost:27017/myproject`',
        name: process.env.DB_NAME || 'ksu'
    },
    ca: process.env.CA_PATH || './assets/ca.pem',
    http: {
        port: process.env.PORT || 3000
    },
    report: {
        templatePath: process.env.REPORT_TEMPLATE_PATH || './assets/templates'
    }
} as IConfig