/**
 * The function gets handler relative path from the file system root. It formats the path to be used in the serverless.ts file.
 * @param context - string
 * @returns Returns the relative path of the handler.
 */
export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`
}
