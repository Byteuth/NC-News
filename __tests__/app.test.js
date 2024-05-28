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

        const returnEndointObject = body
        const validEndpointObject = {endpoints}
        expect(returnEndointObject).toEqual(validEndpointObject); 
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

})

describe("/api/articles/:article_id", () => {
    test("GET:200 sends a single team to the client", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
            const article = response.body.article
            const control = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: 1594329060000,
                votes: 100,
                article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
            //console.log(article)
            expect(article.article_id).toBe(1);
            expect(article.title).toBe("Living in the shadow of a great man");
            expect(article.topic).toBe("mitch");
            expect(article.author).toBe("butter_bridge");
            expect(article.body).toBe("I find this existence challenging");
            expect(article.created_at).toBe(1594329060000);
            expect(article.votes).toBe(100);
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
            expect(article).toEqual(control)
        });
    });
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("team does not exist");
        });
    });
    test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
        return request(app)
        .get("/api/articles/not-a-team")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad request");
        });
    });
    
});

