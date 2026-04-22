// Express 5 types req.params values as string | string[] — always string at runtime.
export const p = (v: string | string[]): string => (Array.isArray(v) ? v[0] : v)
