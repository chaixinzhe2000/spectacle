import DatabaseConnection from "../../dbConfig";

describe("Delete Anchor Links", () => {
	const linkDbConnection = DatabaseConnection;

	beforeEach(async (done) => {
		const response = await linkDbConnection.clearLinkCollection();
		expect(response.success).toBeTruthy();
		done();

		const createResponse = await linkDbConnection.initLinks([
			{
				linkId: "l1",
				destAnchorId: "a1",
				srcAnchorId: "n1",
			},
			{
				linkId: "l2",
				srcAnchorId: "a1",
				destNodeId: "n3",
			},
			{
				linkId: "l30",
				srcAnchorId: "a20",
				srcNodeId: "n20",
			}
		]);
		expect(createResponse.success).toBeTruthy();
		done();
	});

	afterAll(async (done) => {
		const response = await linkDbConnection.clearLinkCollection();
		expect(response.success).toBeTruthy();
		done();
	});

	test("deletes non-existent links", async (done) => {
		const response = await linkDbConnection.deleteAnchorLinks("a524324");
		expect(response.success).toBeTruthy();
		done();
	});

	test("checks and deletes 1 existing anchor link", async (done) => {
		const checkResponse = await linkDbConnection.findLinksByNode("n20")
		expect(checkResponse.success).toBeTruthy()
		const response = await linkDbConnection.deleteAnchorLinks("a20");
		expect(response.success).toBeTruthy();
		// const checkResponse2 = await linkDbConnection.findLinksByNode("n20")
		// expect(checkResponse2.success).toBeFalsy()
		done();
	});

	test("deletes 2 existing anchor links", async (done) => {
		const checkResponse1 = await linkDbConnection.findLinksByNode("n3")
		expect(checkResponse1.success).toBeTruthy()
		const checkResponse2 = await linkDbConnection.findLinksByAnchor("a1")
		expect(checkResponse2.success).toBeTruthy()
		const response = await linkDbConnection.deleteAnchorLinks("a1");
		expect(response.success).toBeTruthy();
		const response1 = await linkDbConnection.findLinksByAnchor("a3");
		expect(response1.success).toBeFalsy();
		const response2 = await linkDbConnection.findLinks(['l1', 'l2'])
		expect(response2.success).toBeFalsy();
		done();
	});
});
