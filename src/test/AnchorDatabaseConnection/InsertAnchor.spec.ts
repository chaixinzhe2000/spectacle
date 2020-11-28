import { IAnchor } from 'hypertext-interfaces';
import DatabaseConnection from '../../dbConfig';

const testAnchor: IAnchor = {
    anchorId: "test.anchor",
    nodeId: "test.node",
    label: 'label'
}

describe('Insert Anchor', () => {

    test("inserts anchor, doesn't insert duplicate anchor id", async done => {
    const dResponse = await DatabaseConnection.clearAnchorCollection()
    expect(dResponse.success).toBeTruthy()

    const createResponse = await DatabaseConnection.insertAnchor(testAnchor)
    expect(createResponse.success).toBeTruthy()
    expect(createResponse.payload).toStrictEqual(testAnchor)

    const createResponse2 = await DatabaseConnection.insertAnchor(testAnchor)
    expect(createResponse2.success).toBeFalsy()
    done()
  })

    test("fails to insert an invalid anchor", async done => {
    let invalid: any = {
        anchorId: "anchor",
        randomField: "random"
    }
    const response = await DatabaseConnection.insertAnchor(invalid)
    expect(response.success).toBeFalsy()

    let invalid2: IAnchor = {
        anchorId: "",
        nodeId: "",
        label: 'label'
    }
    const response2 = await DatabaseConnection.insertAnchor(invalid2)
    expect(response2.success).toBeFalsy()

    let invalid3: IAnchor = {
        anchorId: null,
        nodeId: "",
        label: 'label'
    }
    const response3 = await DatabaseConnection.insertAnchor(invalid3)
    expect(response3.success).toBeFalsy()

    let invalid4: IAnchor = {
        anchorId: "anchor",
        nodeId: null,
        label: 'fdasf' 
    }
    const response4 = await DatabaseConnection.insertAnchor(invalid4)
    expect(response4.success).toBeFalsy()
    done()
    })

    test("fails on null", async (done) => {
        const response = await DatabaseConnection.insertAnchor(null);
        expect(response.success).toBeFalsy();
        done();
      });
})