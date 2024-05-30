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

describe("/api/articles", () => {
    test("GET:200 sends a list of article objects in correct format", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            const articlesList = response.body.articles
            const numberOfArticles = articlesList.length
            expect(numberOfArticles).toBe(13)


            articlesList.forEach((article) => {
                expect(article.hasOwnProperty('body')).toBe(false)

                expect(article.hasOwnProperty('author')).toBe(true)
                expect(article.hasOwnProperty('title')).toBe(true)
                expect(article.hasOwnProperty('topic')).toBe(true)
                expect(article.hasOwnProperty('created_at')).toBe(true)
                expect(article.hasOwnProperty('votes')).toBe(true)
                expect(article.hasOwnProperty('article_img_url')).toBe(true)
                expect(article.hasOwnProperty('comment_count')).toBe(true)
            });

            
            for (let i = 1; i < articlesList.length; i++){
                const firstArticleCreatedAt = new Date(articlesList[i -1].created_at)
                const secondArticleCreatedAt = new Date(articlesList[i].created_at)
                let isDescending = false
                
                if (firstArticleCreatedAt >= secondArticleCreatedAt){
                    isDescending = true

                }

                expect(isDescending).toBe(true)
            } 

            
        });
    });

});


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
            expect(article).toMatchObject(control)
        });
    });
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Not Found");
        });
    });
    test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
        return request(app)
        .get("/api/articles/not-a-team")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });


    test("PATCH:200 returns udated article with correct properties ", () => {
        const newVote = 12
        const inputVote = { inc_votes: newVote }
        const control = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 112,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }
        
        return request(app)
        .patch("/api/articles/1")
        .send(inputVote)
        .expect(200)
        .then((response ) => {
            const updatedArticle = response.body.updatedArticle
            expect(updatedArticle).toMatchObject(control)
        });
    });

    test("PATCH:404 sends an appropriate status and error message when given an invalid article_id ", () => {
        const inputVote = { inc_votes: 12 }        
        return request(app)
        .patch("/api/articles/999")
        .send(inputVote)
        .expect(404)
        .then((response ) => {
            
            expect(response.body.msg).toBe("Not Found");
        });
    });

});

describe("/api/articles/:article_id/comments", () => {
    test("GET:200 returns list of comments based on article_id ", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
            const article = response.body.article
            const control = {
                comment_id: 9,
                votes: 0,
                created_at: '2020-01-01T03:08:00.000Z',
                author: 'icellusedkars',
                body: 'Superficially charming',
                article_id: 1
            }
            expect(article[0]).toEqual(control)
            expect(article[0]).not.toBe(control)
        });
    });
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
        return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Not Found");
        });
    });
    test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
        return request(app)
        .get("/api/articles/not-a-team")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });

    test("POST:200 returns postedComment object, checks for properties ", () => {
        const controlComment = {
            username: "icellusedkars",
            body: 'This is a great aritcle name'
            }

        return request(app)
        .post("/api/articles/1/comments")
        .send(controlComment)
        .expect(200)
        .then((response ) => {
            const comment = response.body.postedComment

            expect(comment.body).toBe(controlComment.body)
            expect(comment.author).toBe(controlComment.username)

            expect(comment.hasOwnProperty('comment_id')).toBe(true)
            expect(comment.hasOwnProperty('article_id')).toBe(true)
            expect(comment.hasOwnProperty('votes')).toBe(true)
            expect(comment.hasOwnProperty('created_at')).toBe(true)

        });
    });

    test("POST:422 sends an appropriate status and error message when given a valid but non-existent id", () => {
        const controlComment = {
            username: "francisco",
            body: 'This is a great aritcle name'
            }

        return request(app)
        .post("/api/articles/1/comments")
        .send(controlComment)
        .expect(422)
        .then((response ) => {
            expect(response.body.msg).toBe('Invalid Username')
        });
    });

    
    
});

