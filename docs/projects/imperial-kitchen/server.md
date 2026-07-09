---
title: 服务器架构设计
date: 2024-07-11
icon: server
category:
  - Project
tag:
  - imperial-kitchen
  - 系统设计
---

::: warning

Deprecated. 已改用 nest.js 框架。

:::

## 分层架构

### route

分发路由，如：`/category`。匹配后的路由包含 `controller` 和 路由特定的 `middleware`。

```ts
interface Router: { [key: string]: Route }

export interface Route {
  controller: Controller;
  middlewares?: Middleware[]; // route-specific middleware
}
```

### middleware

中间件，处理请求中间逻辑，比如：`cors`、`auth` 等。

```ts
export type Middleware = (req: CustomIncomingMessage, res: ServerResponse, next: () => void) => void

/**
 * Manage the execution order of middleware functions.
 * It allows you to add multiple middleware functions to a queue
 * and execute them sequentially during a request.
 *
 * @export
 * @class MiddlewareManager
 */
export default class MiddlewareManager {
  private readonly middlewares: Middleware[]

  constructor() {
    this.middlewares = []
  }

  use(func: Middleware) {
    this.middlewares.push(func)
  }

  run(req: CustomIncomingMessage, res: ServerResponse) {
    const runner = async (index: number) => {
      const middleware = this.middlewares[index]
      if (middleware) {
        await middleware(req, res, () => {
          return runner(index + 1)
        })
      }
    }

    runner(0)
  }
}
```

以 `corsMiddleware` 为例：

```ts
const corsMiddleware = (options: { origin: string; methods: string; credentials?: boolean }): Middleware => {
  return (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', options.origin)
    res.setHeader('Access-Control-Allow-Methods', options.methods)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (options.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true')
    }
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
    } else {
      next()
    }
  }
}

export default corsMiddleware
```

### controller

控制层，处理请求参数和请求体数据，分发业务逻辑。一个抽象基类，提供 `sendResponse` 和 `sendError` 方法。

```ts
export type Controller = (req: CustomIncomingMessage, res: ServerResponse) => void

export abstract class BaseController {
  protected static sendResponse(statusCode: number, data: unknown, res: ServerResponse) {
    res.setHeader('content-type', 'application/json')
    res.writeHead(statusCode)

    // handle bigint
    let responseData: unknown
    if (typeof data === 'bigint') {
      if (data <= Number.MAX_SAFE_INTEGER && data >= Number.MIN_SAFE_INTEGER) {
        responseData = Number(data)
      } else {
        responseData = data.toString()
      }
    } else {
      responseData = data
    }

    const response: Response = {
      code: statusCode,
      message: 'OK',
      data: responseData
    }

    res.write(JSON.stringify(response))
    res.end()
  }

  protected sendError(statusCode: number, message: string, res: ServerResponse) {
    res.setHeader('content-type', 'application/json')
    res.writeHead(statusCode)
    const response: Response = {
      code: statusCode,
      message: JSON.stringify({ error: message })
    }
    res.write(response)
    res.end()
  }
}
```

以 `UserController` 为例：

```ts
export default class UserController extends BaseController {
  private userService: UserService

  constructor() {
    super()
    this.userService = new UserService()
  }

  async signIn(req: CustomIncomingMessage, res: ServerResponse) {
    try {
      const start = Date.now()
      const data = await getRequestBody<SignInParams>(req)

      // TODO: verify parameters.

      const response = await this.userService.signIn(data)

      console.log('All time: ', Date.now() - start)
      UserController.sendResponse(response.code, { message: response.message }, res)
    } catch (error) {
      UserController.sendResponse(500, { message: 'Internal Server Error' }, res)
      throw error
    }
  }
}
```

### service

服务层，处理业务逻辑。`BaseService` 为抽象基类，提供 `db` 属性。

```ts
export abstract class BaseService {
  protected db: DB

  constructor() {
    this.db = DB.createInstance()
  }
}
```

以 `UserService` 为例：

```ts
export default class UserService extends BaseService {
  constructor() {
    super()
  }

  // sign-in
  async signIn(data: SignInParams): Promise<Response<boolean | null>> {
    const sql = 'SELECT * FROM users WHERE name = ?'
    const res = await this.db.execute({ sql, args: [data.name] })
    const usersInfo: User[] = res.rows.map((row) => ({
      id: Number(row.ID),
      name: String(row.name),
      password: String(row.password)
    }))

    // Check if the user exists.
    if (usersInfo.length === 0) {
      return {
        code: 401,
        message: 'Access to the requested resource is unauthorized. Please authenticate.',
        data: null
      }
    }
    // Check if the password matches.
    if (usersInfo[0].password !== data.password) {
      return {
        code: 401,
        message: 'Access to the requested resource is unauthorized. Please authenticate.',
        data: null
      }
    }

    // All checks passed, return success message or token
    // TODO: generate token.
    return { code: 200, message: 'Login successful', data: true }
  }
}
```

### dao

数据访问层，处理数据查询。提供 `execute` 方法执行 `sql`。

```ts
export class DB {
  private static instance: DB

  private constructor() {}

  public static createInstance() {
    if (!DB.instance) {
      DB.instance = new DB()
    }
    return DB.instance
  }

  public async execute(stmt: InStatement) {
    try {
      const start = Date.now()
      const res = await client.execute(stmt)
      console.log('Query time: ', Date.now() - start)
      return res
    } catch (error) {
      if (error instanceof LibsqlError) {
        throw new Error(`Execution failed: ${error.message}`)
      } else {
        throw new Error(`An error occurred: ${error}`)
      }
    }
  }
}

export default DB
```

## 其他细节

### 请求体处理

目前允许 `POST` 和 `PUT` 请求携带请求体。

```ts
export const getRequestBody = <T>(req: CustomIncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    try {
      if (req.method !== 'POST' && req.method !== 'PUT') {
        resolve({} as T)
        return
      }
      if (req.headers['content-type'] !== 'application/json') {
        resolve({} as T)
        return
      }
      let postData = ''
      req.on('data', (chunk: Buffer) => {
        postData += chunk.toString()
      })
      req.on('end', () => {
        if (!postData) {
          resolve({} as T)
          return
        }
        resolve(JSON.parse(postData) as T)
      })
    } catch (error) {
      reject(error)
    }
  })
}
```

### 路径参数处理

路由规则：`method` + `path` + `query`，如 `GET/category/:id`。

其中 `path` 需要进行参数处理，如：`/category/:id`。处理完后参数类型应为 `params: Record<string, string>`，因为可能存在多个参数。

解析完成后，`controller` 中需要接收 `params`，需要将 `params` 转换为 `request.params`。

具体逻辑如下：

```ts{15}
/**
 * Execute route's middleware and controller.
 *
 * @param {CustomIncomingMessage} req
 * @param {ServerResponse} res
 * @param {Route} route
 */
async function execute(
  req: CustomIncomingMessage,
  res: ServerResponse,
  route: Route,
  params: Record<string, string>
) {
  const mwManager = new MiddlewareManager()
  req.params = params

  const cors = corsMiddleware({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false
  })
  mwManager.use(cors)

  route.middlewares?.forEach((func) => mwManager.use(func))
  mwManager.use(route.controller)
  await mwManager.run(req, res)
}

/**
 * Matches the provided method and pathname to a route in the Router.
 *
 * @param {string} method - The HTTP method to match.
 * @param {string} pathname - The URL pathname to match.
 * @return {Object} An object containing the matched route and parameters.
 */
const matchRoute = (method: string, pathname: string) => {
  for (const router in Router) {
    const [routeMethod, ...routeParts] = router.split('/')
    if (method === routeMethod) {
      const pathParts = pathname.slice(1).split('/')
      console.log(routeMethod, routeParts, pathParts, pathname)

      if (routeParts.length === pathParts.length) {
        const params: Record<string, string> = {}
        let match = true

        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(':')) {
            params[routeParts[i].slice(1)] = pathParts[i]
          } else if (routeParts[i] !== pathParts[i]) {
            match = false
            break
          }
        }

        if (match) {
          return { route: Router[router], params }
        }
      }
    }
  }

  return { route: notFound, params: {} }
}
```
