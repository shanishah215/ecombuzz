import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    const errors: Record<string, string> = {}
    err.issues.forEach((e) => {
      errors[e.path.join('.')] = e.message
    })
    res.status(422).json({ success: false, message: 'Validation failed', errors })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message })
    return
  }

  console.error(err)
  res.status(500).json({ success: false, message: 'Internal server error' })
}
