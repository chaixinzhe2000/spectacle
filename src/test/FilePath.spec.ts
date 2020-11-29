import { IFilePath, isFilePath, newFilePath } from "../index"

describe('IFilePath', () => {

  test("creates filepath", async done => {
    const filePath: IFilePath = newFilePath([])
    expect(filePath.filePath.length).toBe(0)
    expect(isFilePath(filePath)).toBeTruthy()
    done()
  })

  test("empty array is not filepath", async done => {
    expect(isFilePath([])).toBeFalsy()
    done()
  })
})