export function contentApiPlugin(): {
  name: string
  configureServer: (server: {
    middlewares: {
      use: (fn: (...args: unknown[]) => unknown) => void
    }
  }) => void
}
