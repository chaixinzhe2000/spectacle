import { IAnchorGateway } from 'spectacle-interfaces';
import DatabaseConnection from '../../dbConfig';
import AnchorGateway from '../../gateway/AnchorGateway';

describe('Unit Test: addNewAnnotation', () => {
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
                contentList: ["content B"],
                authorList: ["author B"],
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
	test("successfully adds new annotation", async done => {
        const findResponse = await anchorGateway.getAnchor('a')
        expect(findResponse.success).toBeTruthy()
        const getResponse = await anchorGateway.getAnchor('a')
        expect(getResponse.payload.contentList).toEqual(['content A'])
        expect(getResponse.payload.authorList).toEqual(['author A'])

		const originalTime: Date = await (await anchorGateway.getAnchor('a')).payload.createdAt
		const addResponse = await anchorGateway.addNewAnnotation('a', 'new content', 'new author')
		expect(addResponse.success).toBeTruthy()
		expect(addResponse.payload.anchorId).toBe('a')
		expect(addResponse.payload.nodeId).toBe('node.a')
        expect(addResponse.payload.contentList).toEqual(['content A', 'new content'])
        expect(addResponse.payload.authorList).toEqual(['author A', 'new author'])
		expect(addResponse.payload.createdAt.getTime() > originalTime.getTime())
		done()
    })
    
    // TODO: check that author is "Anonymous" when author is "" and then also check when author is null
    test("makes author Anonymous if author is null", async done => {
        const findResponse = await anchorGateway.getAnchor('b')
        expect(findResponse.success).toBeTruthy()
        const getResponse = await anchorGateway.getAnchor('b')
        expect(getResponse.payload.contentList).toEqual(['content B'])
        expect(getResponse.payload.authorList).toEqual(['author B'])

		const originalTime: Date = await (await anchorGateway.getAnchor('b')).payload.createdAt
        const addResponse = await anchorGateway.addNewAnnotation('b', 'new content', null)
		expect(addResponse.success).toBeTruthy()
		expect(addResponse.payload.anchorId).toBe('b')
		expect(addResponse.payload.nodeId).toBe('node.b')
        expect(addResponse.payload.contentList).toEqual(['content B', 'new content'])
        expect(addResponse.payload.authorList).toEqual(['author B', 'Anonymous'])
        expect(addResponse.payload.createdAt.getTime() > originalTime.getTime())
        
        const findResponse2 = await anchorGateway.getAnchor('c')
        expect(findResponse2.success).toBeTruthy()
        const getResponse2 = await anchorGateway.getAnchor('c')
        expect(getResponse2.payload.contentList).toEqual(['content C'])
        expect(getResponse2.payload.authorList).toEqual(['author C'])

		const originalTime2: Date = await (await anchorGateway.getAnchor('c')).payload.createdAt
        const addResponse2 = await anchorGateway.addNewAnnotation('c', 'new content', "")
		expect(addResponse2.success).toBeTruthy()
		expect(addResponse2.payload.anchorId).toBe('c')
		expect(addResponse2.payload.nodeId).toBe('node.b')
        expect(addResponse2.payload.contentList).toEqual(['content C', 'new content'])
        expect(addResponse2.payload.authorList).toEqual(['author C', 'Anonymous'])
        expect(addResponse2.payload.createdAt.getTime() > originalTime2.getTime())
		done()
    })
    
    // TODO: fails if anchorId is not found or invalid
    test("fails to add new annotation if author is null", async done => {
        const getResponse = await anchorGateway.addNewAnnotation('x', 'new content', null)
		expect(getResponse.success).toBeFalsy()
		done()
    })

    // TODO: fails if content is "" or null
    test("Fails if content is '' or null", async done => {
        const findResponse = await anchorGateway.getAnchor('d')
        expect(findResponse.success).toBeTruthy()
        const getResponse = await anchorGateway.getAnchor('d')
        expect(getResponse.payload.contentList).toEqual(['content D'])
        expect(getResponse.payload.authorList).toEqual(['author D'])

		const originalTime: Date = await (await anchorGateway.getAnchor('d')).payload.createdAt
		const addResponse = await anchorGateway.addNewAnnotation('d', '', 'new author')
        expect(addResponse.success).toBeFalsy()
        const getResponse2 = await anchorGateway.getAnchor('d')
		expect(getResponse2.payload.anchorId).toBe('d')
		expect(getResponse2.payload.nodeId).toBe('node.b')
        expect(getResponse2.payload.contentList).toEqual(['content D'])
        expect(getResponse2.payload.authorList).toEqual(['author D'])
		expect(getResponse2.payload.createdAt.getTime() === originalTime.getTime())
        
        const findResponse2 = await anchorGateway.getAnchor('e')
        expect(findResponse2.success).toBeTruthy()
        const getResponse3 = await anchorGateway.getAnchor('e')
        expect(getResponse3.payload.contentList).toEqual(['content E'])
        expect(getResponse3.payload.authorList).toEqual(['author E'])

		const originalTime2: Date = await (await anchorGateway.getAnchor('e')).payload.createdAt
		const addResponse2 = await anchorGateway.addNewAnnotation('e', null, 'new author')
		expect(addResponse2.success).toBeFalsy()
		const getResponse4 = await anchorGateway.getAnchor('e')
		expect(getResponse4.payload.anchorId).toBe('e')
		expect(getResponse4.payload.nodeId).toBe('node.b')
        expect(getResponse4.payload.contentList).toEqual(['content E'])
        expect(getResponse4.payload.authorList).toEqual(['author E'])
		expect(getResponse4.payload.createdAt.getTime() === originalTime2.getTime())
        done()
    })

    // // TODO: failed if content is not of type string
    // test("Fails if content is not of type string", async done => {
    //     const findResponse = await anchorGateway.getAnchor('f')
    //     expect(findResponse.success).toBeTruthy()
    //     const getResponse = await anchorGateway.getAnchor('f')
    //     expect(getResponse.payload.contentList).toEqual(['content F'])
    //     expect(getResponse.payload.authorList).toEqual(['author F'])

	// 	const originalTime: Date = await (await anchorGateway.getAnchor('f')).payload.createdAt
	// 	const addResponse = await anchorGateway.addNewAnnotation('f', 1, 'new author')
	// 	expect(addResponse.success).toBeFalsy()
	// 	expect(addResponse.payload.anchorId).toBe('f')
	// 	expect(addResponse.payload.nodeId).toBe('node.b')
    //     expect(addResponse.payload.contentList).toEqual(['content F'])
    //     expect(addResponse.payload.authorList).toEqual(['author F'])
	// 	expect(addResponse.payload.createdAt.getTime() > originalTime.getTime())
	// 	done()
    // })

    // // TODO: failed if author is not of type string
    // test("Fails if content is not of type string", async done => {
    //     const findResponse = await anchorGateway.getAnchor('g')
    //     expect(findResponse.success).toBeTruthy()
    //     const getResponse = await anchorGateway.getAnchor('g')
    //     expect(getResponse.payload.contentList).toEqual(['content G'])
    //     expect(getResponse.payload.authorList).toEqual(['author G'])

	// 	const originalTime: Date = await (await anchorGateway.getAnchor('g')).payload.createdAt
	// 	const addResponse = await anchorGateway.addNewAnnotation('g', 'new content', 1)
	// 	expect(addResponse.success).toBeFalsy()
	// 	expect(addResponse.payload.anchorId).toBe('g')
	// 	expect(addResponse.payload.nodeId).toBe('node.b')
    //     expect(addResponse.payload.contentList).toEqual(['content G'])
    //     expect(addResponse.payload.authorList).toEqual(['author G'])
	// 	expect(addResponse.payload.createdAt.getTime() > originalTime.getTime())
	// 	done()
    // })
})