const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");


beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("GET:200 - sends an array of topic objects to the client", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(( {body} ) => {
        const topics = body;
        
        expect(topics.length).toBe(3); 
        topics.forEach((topic) => {  
            expect(topic.hasOwnProperty('slug')).toBe(true);
            expect(topic.hasOwnProperty('description')).toBe(true);
        });
        });
    });
});

