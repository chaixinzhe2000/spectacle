import { NodeType, isNodeType } from "../index"

describe('NodeTpe', () => {

  test("creates filepath", async done => {
    expect(isNodeType('node')).toBeTruthy()
    expect(isNodeType('immutable-text')).toBeTruthy()
    expect(isNodeType('none')).toBeFalsy()

    done()
  })
})