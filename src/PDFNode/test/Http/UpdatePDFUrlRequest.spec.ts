import {
	IServiceResponse,
	isServiceResponse,
	IPDFNode,
} from "spectacle-interfaces";
import request from "supertest";
import app from "../../../app";
import DatabaseConnection from "../../dbConfig";

const service = "/pdf";

describe("Unit Test: Update PDF URL", () => {
	beforeAll(async done => {
		const clearResponse = await DatabaseConnection.clearNodeCollection();
		expect(clearResponse.success).toBeTruthy();
		const testNode: IPDFNode = {
			nodeId: 'a',
			pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
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
			.send({pdfUrl: "https://www.111michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"})
			.expect(200)
			.expect("Content-Type", /json/);
		expect(isServiceResponse(updateResponse.body)).toBeTruthy();
		const sr: IServiceResponse<IPDFNode> = updateResponse.body;
		expect(sr.success).toBeTruthy();
		expect(sr.payload.pdfUrl).toEqual("https://www.111michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf")
		const getResponse2 = await DatabaseConnection.findNode("a");
		expect(getResponse2.success).toBeTruthy();
		expect(getResponse2.payload.pdfUrl).toBe("https://www.111michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf")
		done();
	});

	test("successfully updates invalid url", async (done) => {
		const updateResponse = await request(app)
			.put(`${service}/a`)
			.send({pdfUrl: "https://www.111michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pd"})
			.expect(200)
			.expect("Content-Type", /json/);
		expect(isServiceResponse(updateResponse.body)).toBeTruthy();
		const sr: IServiceResponse<IPDFNode> = updateResponse.body;
		console.log(sr)
		expect(sr.success).toBeFalsy();
		const getResponse2 = await DatabaseConnection.findNode("a");
		expect(getResponse2.success).toBeTruthy();
		expect(getResponse2.payload.pdfUrl).toBe("https://www.111michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf")
		done();
	});

	
});
