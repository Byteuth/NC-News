const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require('../endpoints.json')


beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/", () => {
    test("GET:200 - returns object describing all the avaiable endpoints", () => {
        
        return request(app)
        .get("/api")
        .expect(200)
        .then(( {body} ) => {
        // const test_object = {endpoints :
        //     {
        // "GET /api": {
        //     "description": "serves up a json representation of all the available endpoints of the api"
        // },
        // "GET /api/topics": {
        //     "description": "serves an array of all topics",
        //     "queries": [],
        //     "exampleResponse": {
        //     "topics": [{ "slug": "football", "description": "Footie!" }]
        //     }
        // },
        // "GET /api/articles": {
        //     "description": "serves an array of all articles",
        //     "queries": ["author", "topic", "sort_by", "order"],
        //     "exampleResponse": {
        //     "articles": [
        //         {
        //         "title": "Seafood substitutions are increasing",
        //         "topic": "cooking",
        //         "author": "weegembump",
        //         "body": "Text from the article..",
        //         "created_at": "2018-05-30T15:59:13.341Z",
        //         "votes": 0,
        //         "comment_count": 6
        //         }
        //     ]
        //     }
        // }
        // }
        // }
        const return_endpoint_object = body
        const valid_endpoint_object = {endpoints}

        expect(return_endpoint_object).toEqual(valid_endpoint_object); //serializes to the same string is not relevant here,
        });
    });
});

describe("/api/topics", () => {
    test("GET:200 - sends an array of topic objects to the client", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(( {body} ) => {
        const topics = body.topics;
    
        expect(topics.length).toBe(3); 
        topics.forEach((topic) => {  
            expect(topic.hasOwnProperty('slug')).toBe(true);
            expect(topic.hasOwnProperty('description')).toBe(true);
        });
        });
    });


});


