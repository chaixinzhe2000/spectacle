export default interface IFilePath {
  filePath: string[]
  parent: string[]
  nodeId: string
  root: string[]
}

export function newFilePath(filePath: string[]): IFilePath {
  return {
      filePath: filePath,
      parent: filePath.slice(0, filePath.length - 1),
      root: filePath.slice(0, 1),
      nodeId: filePath[filePath.length - 1]
  }
}

/**
 * Determines if a object is a valid FilePath.
 * 
 * @param fp any type
 */
export function isFilePath(fp: IFilePath | any): fp is IFilePath {
  const propsDefinied = (fp as IFilePath).filePath !== undefined && (fp as IFilePath).root !== undefined && (fp as IFilePath).parent !== undefined
  const nodeId = (fp as IFilePath).nodeId !== undefined || (propsDefinied && (fp as IFilePath).filePath.length === 0)

  if (propsDefinied && nodeId) {
    return isStringArray((fp as IFilePath).filePath) && isStringArray((fp as IFilePath).parent) && isStringArray((fp as IFilePath).root)
    && (
      ((fp as IFilePath).filePath[(fp as IFilePath).filePath.length - 1] === (fp as IFilePath).nodeId && typeof (fp as IFilePath).nodeId === 'string')
      || ((fp as IFilePath).filePath.length === 0 && (fp as IFilePath).parent.length === 0 && (fp as IFilePath).root.length === 0)
    )
  }

  return false
}

/**
 * Determines if object is valid array of strings.
 * 
 * @param x: any type
 */
export function isStringArray(x: any): x is string[] {
  if (x instanceof Array) {
      let somethingIsNotString = false;
      x.forEach(function(item){
         if(typeof item !== 'string'){
            somethingIsNotString = true;
         }
      })

      if(!somethingIsNotString){
         return true
      }
  }
  
  return false
}