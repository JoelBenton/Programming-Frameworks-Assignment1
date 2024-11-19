import env from '#start/env'
import { defineConfig } from '@adonisjs/redis'
import { InferConnections } from '@adonisjs/redis/types'

const redisConfig = defineConfig({
    connection: process.env.NODE_ENV === 'test' ? 'testing' : 'main',
    connections: {
        /*
    |--------------------------------------------------------------------------
    | The default connection
    |--------------------------------------------------------------------------
    |
    | The main connection you want to use to execute redis commands. The same
    | connection will be used by the session provider, if you rely on the
    | redis driver.
    |
    */
        main: {
            host: env.get('REDIS_HOST'),
            port: env.get('REDIS_PORT'),
            password: env.get('REDIS_PASSWORD', ''),
            db: 0,
            keyPrefix: '',
            retryStrategy(times) {
                return times > 10 ? null : times * 50
            },
        },
        testing: {
            host: env.get('REDIS_HOST'),
            port: env.get('REDIS_PORT'),
            password: env.get('REDIS_PASSWORD', ''),
            db: 1,
            keyPrefix: 'test:',
            retryStrategy(times) {
                return times > 10 ? null : times * 50
            },
        },
    },
})

export default redisConfig

declare module '@adonisjs/redis/types' {
    export interface RedisConnections extends InferConnections<typeof redisConfig> {}
}
