import { IAnchorGateway } from 'spectacle-interfaces';
import DatabaseConnection from '../../dbConfig';
import AnchorGateway from '../../gateway/AnchorGateway';

describe('Unit Test: updateLastAnnotation', () => {
	const anchorGateway: IAnchorGateway = new AnchorGateway(DatabaseConnection)

	beforeAll(async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()

		const createResponse = await DatabaseConnection.initAnchors([
			{
                anchorId: 'a',
                nodeId: 'node.a',
                contentList: ["content A"],
                authorList: ["author A"],
                type: "media",
                createdAt: new Date()
            },
            {
                anchorId: 'b',
                nodeId: 'node.b',
                contentList: ['content B'],
                authorList: ['author B'],
                type: "media",
                createdAt: new Date()
            },
            {
                anchorId: 'c',
                nodeId: 'node.b',
                contentList: ["content C"],
                authorList: ["author C"],
                type: "media",
                createdAt: new Date()
            },
            {
                anchorId: 'd',
                nodeId: 'node.b',
                contentList: ["content D"],
                authorList: ["author D"],
                type: "media",
                createdAt: new Date()
            },
            {
                anchorId: 'e',
                nodeId: 'node.b',
                contentList: ["content E"],
                authorList: ["author E"],
                type: "media",
                createdAt: new Date()
            },
            {
                anchorId: 'f',
                nodeId: 'node.b',
                contentList: ["content F"],
                authorList: ["author F"],
                type: "media",
                createdAt: new Date()
            },
            {
                anchorId: 'g',
                nodeId: 'node.b',
                contentList: ["content G"],
                authorList: ["author G"],
                type: "media",
                createdAt: new Date()
            }
		])
		expect(createResponse.success).toBeTruthy()
		done()
	})

	afterAll(async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()
		done()
	})

    // TODO: check that it works when anchorId, content and author are valid
    test("successfully updates last annotation", async done => {
        const findResponse = await anchorGateway.getAnchor('a')
        expect(findResponse.success).toBeTruthy()

		const originalTime: Date = await (await anchorGateway.getAnchor('a')).payload.createdAt
		const getResponse = await anchorGateway.updateLastAnnotation('a', 'updated content', 'updated author')
		expect(getResponse.success).toBeTruthy()
		expect(getResponse.payload.anchorId).toBe('a')
		expect(getResponse.payload.nodeId).toBe('node.a')
        expect(getResponse.payload.contentList).toEqual(['updated content'])
        expect(getResponse.payload.authorList).toEqual(['updated author'])
		expect(getResponse.payload.createdAt.getTime() > originalTime.getTime())
		done()
    })

    // TODO: check that author is "Anonymous" when author is "" and then also check when author is null
    test("when author is '' author is Anonymous", async done => {
        const findResponse = await anchorGateway.getAnchor('b')
        expect(findResponse.success).toBeTruthy()

		const originalTime: Date = await (await anchorGateway.getAnchor('b')).payload.createdAt
		const getResponse = await anchorGateway.updateLastAnnotation('b', 'updated content', '')
		expect(getResponse.success).toBeTruthy()
		expect(getResponse.payload.anchorId).toBe('b')
        expect(getResponse.payload.nodeId).toBe('node.b')
        expect(getResponse.payload.contentList).toEqual(['updated content'])
        expect(getResponse.payload.authorList).toEqual(['Anonymous'])
		expect(getResponse.payload.createdAt.getTime() > originalTime.getTime())
		done()
    })

    test("when author is null author is Anonymous", async done => {
        const findResponse = await anchorGateway.getAnchor('b')
        expect(findResponse.success).toBeTruthy()

		const originalTime: Date = await (await anchorGateway.getAnchor('b')).payload.createdAt
		const getResponse = await anchorGateway.updateLastAnnotation('b', 'updated content', null)
		expect(getResponse.success).toBeTruthy()
		expect(getResponse.payload.anchorId).toBe('b')
        expect(getResponse.payload.nodeId).toBe('node.b')
        expect(getResponse.payload.contentList).toEqual(['updated content'])
        expect(getResponse.payload.authorList).toEqual(['Anonymous'])
		expect(getResponse.payload.createdAt.getTime() > originalTime.getTime())
		done()
    })

    // TODO: doesn't update annotation if anchorId is not found or invalid
    test("doesn't update annotation if anchorId is not found or invalid", async done => {
		const getResponse = await anchorGateway.updateLastAnnotation('x', 'updated content', null)
		expect(getResponse.success).toBeFalsy()
		done()
    })

    // TODO: fail to update last annotation if content is null and author is "valid author"
    test("fail to update last annotation if content is null and author is 'valid author'", async done => {
        const findResponse = await anchorGateway.getAnchor('c')
        expect(findResponse.success).toBeTruthy()

		const getResponse = await anchorGateway.updateLastAnnotation('c', null, 'updated author')
        expect(getResponse.success).toBeFalsy()
        const findResponse2 = await anchorGateway.getAnchor("c")
		expect(findResponse2.payload.anchorId).toBe('c')
		expect(findResponse2.payload.nodeId).toBe('node.b')
        expect(findResponse2.payload.contentList).toEqual(['content C'])
        expect(findResponse2.payload.authorList).toEqual(['author C'])
		done()
    })

    // TODO: fail to update last annotation if content is "" and author is "valid author"
    test("fail to update last annotation if content is '' and author is 'valid author'", async done => {
        const findResponse = await anchorGateway.getAnchor('d')
        expect(findResponse.success).toBeTruthy()

		const originalTime: Date = await (await anchorGateway.getAnchor('d')).payload.createdAt
		const getResponse = await anchorGateway.updateLastAnnotation('d', '', 'updated author')
        expect(getResponse.success).toBeFalsy()
        
		const findResponse2 = await anchorGateway.getAnchor("d")
		expect(findResponse2.payload.anchorId).toBe('d')
		expect(findResponse2.payload.nodeId).toBe('node.b')
        expect(findResponse2.payload.contentList).toEqual(['content D'])
        expect(findResponse2.payload.authorList).toEqual(['author D'])
		done()
    })

})