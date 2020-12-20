import {
	IServiceResponse,
	isServiceResponse,
	IMediaNode,
} from "spectacle-interfaces";
import request from "supertest";
import app from "../../../app";
import DatabaseConnection from "../../dbConfig";

const service = "/media";

describe("Unit Test: Update Media URL", () => {
	beforeAll(async done => {
		const clearResponse = await DatabaseConnection.clearNodeCollection();
		expect(clearResponse.success).toBeTruthy();
		const testNode: IMediaNode = {
			nodeId: 'a',
			mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
		}
		const initResponse = await DatabaseConnection.initNodes([
			testNode
		]);
		expect(initResponse.success).toBeTruthy();
		done()
	})

	afterAll (async done => {
		const clearResponse2 = await DatabaseConnection.clearNodeCollection();
		expect(clearResponse2.success).toBeTruthy();
		done()
	})

	test("successfully updates valid url", async (done) => {
		const updateResponse = await request(app)
			.put(`${service}/a`)
			.send({mediaUrl: "https://www.youtube.com/watch?v=newvideo"})
			.expect(200)
			.expect("Content-Type", /json/);
		expect(isServiceResponse(updateResponse.body)).toBeTruthy();
		const sr: IServiceResponse<IMediaNode> = updateResponse.body;
		expect(sr.success).toBeTruthy();
		expect(sr.payload.mediaUrl).toEqual("https://www.youtube.com/watch?v=newvideo")
		const getResponse2 = await DatabaseConnection.findNode("a");
		expect(getResponse2.success).toBeTruthy();
		expect(getResponse2.payload.mediaUrl).toBe("https://www.youtube.com/watch?v=newvideo")
		done();
	});

	test("failed updates valid url", async (done) => {
		const updateResponse = await request(app)
			.put(`${service}/a`)
			.send({mediaUrl: "huh"})
			.expect(200)
			.expect("Content-Type", /json/);
		expect(isServiceResponse(updateResponse.body)).toBeTruthy();
		const sr: IServiceResponse<IMediaNode> = updateResponse.body;
		expect(sr.success).toBeFalsy();
		const getResponse2 = await DatabaseConnection.findNode("a");
		expect(getResponse2.success).toBeTruthy();
		expect(getResponse2.payload.mediaUrl).toBe("https://www.youtube.com/watch?v=newvideo")
		done()
	});
});
