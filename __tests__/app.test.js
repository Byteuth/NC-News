const app = require("../app");
const jestSorted = require('jest-sorted')
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require('../endpoints.json')

const {
    selectArticles,
    selectCommentsByArticleId,
    insertComment,
    updateVotesValue
} = require("../models/article.models")



beforeEach(() => seed(data));
afterAll(() => db.end());


describe("ENDPOINTS", () => {
    describe("PATH: API", () => {
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
    })
    describe("PATH: API/TOPICS", () => {
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
    })
    describe("PATH: API/ARTICLES", () => {
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
        
                        expect(articlesList).toBeSortedBy('created_at', { descending: true });
                    
        
                    
                });
            });
        
        });
        describe("/api/articles?topic=mitch", () => {
            test("GET:200 sends list of articles based on topic: mitch", () => {
                return request(app)
                .get("/api/articles?topic=mitch")
                .expect(200)
                .then((response) => {
                    const articlesList = response.body.articles

                    const control = {
                        author: 'icellusedkars',
                        title: 'Eight pug gifs that remind me of mitch',
                        article_id: 3,
                        topic: 'mitch',
                        created_at: '2020-11-03T09:12:00.000Z',
                        votes: 0,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                        comment_count: '2'
                    }

                    expect(articlesList.length).toBe(12)
                    expect(articlesList[0]).toMatchObject(control)

                    articlesList.forEach((article) =>{
                        expect(article.topic).toBe('mitch')
                    })
                })
            })
        }) 
        describe("/api/articles?topic=cats", () => {
            test("GET:200 sends list of articles based on topic: cats", () => {
                return request(app)
                .get("/api/articles?topic=cats")
                .expect(200)
                .then((response) => {
                    const articlesList = response.body.articles
                        expect(articlesList.length).toBe(1)
                });
            })
        })

        describe("/api/articles?topic=paper]", () => {
            test.only("GET:200 sends an empty array when queried data's result is empty", () => {
                return request(app)
                .get("/api/articles?topic=paper")
                .expect(200)
                .then((response) => {
                    const article = response.body
                    expect(article).toEqual({articles: []})
                });
            })
        })






        describe("/api/articles?topic=", () => {
            test("GET:200 sends list of ALL articles if no topic passed", () => {
                return request(app)
                .get("/api/articles?topic=")
                .expect(200)
                .then((response) => {
                    const articlesList = response.body.articles
                    expect(articlesList.length).toBe(13)
                });            
            })
        })
        describe("/api/articles?topic=not-a-real-topic", () => {
            test("GET:400 sends an appropriate status and error message when given an query value", () => {
                return request(app)
                .get("/api/articles?topic=not-a-real-topic")
                .expect(404)
                .then((response) => {
                    const error = response.body
                    expect(error.msg).toBe("Invalid Query")
                });
            })
        })
        describe("/api/articles/:article_id", () => {
            test("GET:200 sends a single article filered by article_id. Includes comment_count", () => {
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
                    expect(article.comment_count).toBe(11)
                    expect(article).toMatchObject(control)
                });
            });
            test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
                return request(app)
                .get("/api/articles/999")
                .expect(404)
                .then((response) => {
                    expect(response.body.msg).toBe("Bad Request");
                });
            });
            test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
                return request(app)
                .get("/api/articles/not-a-team")
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("Invalid Request");
                });
            });
            test("PATCH:202 returns udated article with correct properties as well as newVote as Number", () => {
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
                .expect(202)
                .then((response ) => {
                    const updatedArticle = response.body.updatedArticle
                    expect(updatedArticle).toMatchObject(control)
                });
            });
            test("PATCH:202 returns udated article with correct properties as well as newVote as String", () => {
                const inputVote = { inc_votes: '12' }   
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
                .expect(202)
                .then((response ) => {
                    const updatedArticle = response.body.updatedArticle
                    expect(updatedArticle).toMatchObject(control)
                });
            });
            test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent id ", () => {
                const inputVote = { inc_votes: 12 }        
                return request(app)
                .patch("/api/articles/999")
                .send(inputVote)
                .expect(404)
                .then((response ) => {
                    
                    expect(response.body.msg).toBe("Bad Request");
                });
            });
            test("PATCH:404 sends an appropriate status and error message when given an article_id", () => {
                const inputVote = { inc_votes: 'twelve' }        
                return request(app)
                .patch("/api/articles/1")
                .send(inputVote)
                .expect(400)
                .then((response ) => {
                    expect(response.body.msg).toBe("Invalid Request");
                });
            });
            test("PATCH:400 sends an appropriate status and error message when given an article_id", () => {
                const inputVote = { inc_votes: 12 }        
                return request(app)
                .patch("/api/articles/banana")
                .send(inputVote)
                .expect(400)
                .then((response ) => {
                    
                    expect(response.body.msg).toBe("Invalid Request");
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
                    expect(response.body.msg).toBe("Bad Request");
                });
            });
            test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
                return request(app)
                .get("/api/articles/not-a-team")
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("Invalid Request");
                });
            });
            test("POST:201 returns postedComment object, checks for properties ", () => {
                const controlComment = {
                    username: "icellusedkars",
                    body: 'This is a great aritcle name'
                    }
        
                return request(app)
                .post("/api/articles/1/comments")
                .send(controlComment)
                .expect(201)
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
            test("POST:400 sends an appropriate status and error message when given a valid id but incorrect username", () => {
                const controlComment = {
                    username: "francisco",
                    body: 'This is a great aritcle name'
                    }
        
                return request(app)
                .post("/api/articles/1/comments")
                .send(controlComment)
                .expect(400)
                .then((response ) => {
                    expect(response.body.msg).toBe('Bad Request')
                });
            });
        });
    })
    describe("PATH: API/COMMENTS", () => {
        describe("/api/comments/:comment_id", () => {
            test("POST:200 returns postedComment object, checks for properties ", () => {
                const controlComment = {
                    username: "icellusedkars",
                    body: 'This is a great aritcle name'
                }
                
                return request(app)
                .post("/api/articles/1/comments")
                .send(controlComment)
                .expect(201)
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
            test("POST:400 sends an appropriate status and error message when given a valid but non-existent id", () => {
                const controlComment = {
                    username: "francisco",
                    body: 'This is a great aritcle name'
                    }
        
                return request(app)
                .post("/api/articles/1/comments")
                .send(controlComment)
                .expect(400)
                .then((response ) => {
                    expect(response.body.msg).toBe('Bad Request')
                });
            });
            test("DELETE:200 returns deleted comment", () => {
                return request(app)
                .delete("/api/comments/2")
                .expect(204)
            });
    
    
            test("DELETE:204 returns deleted comment", () => {
                return request(app)
                .delete("/api/comments/999")
                .expect(404)
                .then((response) => {
                    const deletedComment = response.body.msg
                    expect(deletedComment).toBe('Bad Comment Id')
        
                });
            });
    
            test("DELETE:404 sends an appropriate status and error message when given an invalid comment_id", () => {
                return request(app)
                .delete("/api/comments/999")
                .expect(404)
                .then((response) => {
                    const errorResponse = response.body.msg
        
                    expect(errorResponse).toEqual('Bad Comment Id');
                });
            });
        });
    })
    describe("PATH: API/USERS", () => {
        describe("/api/users", () => {
            test("GET:200 - sends an array of user objects to the client", () => {
                return request(app)
                .get("/api/users")
                .expect(200)
                .then((result) => {
                const usersList = result.body.users
                expect(usersList.length).toBe(4); 
                usersList.forEach((user) => {  
                    expect(user.hasOwnProperty('username')).toBe(true);
                    expect(user.hasOwnProperty('name')).toBe(true);
                    expect(user.hasOwnProperty('avatar_url')).toBe(true);
                    expect(user.hasOwnProperty('not_valid_property')).toBe(false);
                });
                });
            });
            test("GET:200 - sends an array of user objects to the client", () => {
                return request(app)
                .get("/api/not-a-users")
                .expect(404)
            });
        })

    })
})



describe("ARTICLES_UTIL_TESTS", () => {
    describe("selectArticles", () => {
        test("tests selectArticles articles and articles.comment_count is of correct value", async() => {
            const articles = await selectArticles()

            expect(articles[0]).toBeObject();
            expect(articles[0].hasOwnProperty('author')).toBe(true)
            expect(articles[0].hasOwnProperty('title')).toBe(true)
            expect(articles[0].hasOwnProperty('article_id')).toBe(true)
            expect(articles[0].hasOwnProperty('topic')).toBe(true)
            expect(articles[0].hasOwnProperty('created_at')).toBe(true)
            expect(articles[0].hasOwnProperty('votes')).toBe(true)
            expect(articles[0].hasOwnProperty('article_img_url')).toBe(true)
            expect(articles[0].hasOwnProperty('comment_count')).toBe(true)
            expect(articles[0].comment_count).toBe("2")
        });
    })
    describe("selectCommentsByArticleId", () => {
        test('tests selectCommentsByArticleId length and properties ', async () => {
            const articalId = 1
            await selectCommentsByArticleId(articalId)
            .then((result) => {
                const commentsList = result
                const controlCommentsQuant = 11
                
                commentsList.forEach((comment) => {
                    expect(comment).toBeObject();
                    expect(comment.hasOwnProperty('comment_id')).toBe(true)
                    expect(comment.hasOwnProperty('votes')).toBe(true)
                    expect(comment.hasOwnProperty('created_at')).toBe(true)
                    expect(comment.hasOwnProperty('author')).toBe(true)
                    expect(comment.hasOwnProperty('body')).toBe(true)
                    expect(comment.hasOwnProperty('article_id')).toBe(true)
                })
                expect(commentsList.length).toBe(controlCommentsQuant)
            });
        })

    })
    describe("insertComment", () => {
        test('tests selectCommentsById for correct properties, tests to see if comments db increase with each post ', async () => {
            const articleId = 1
            const comment = 
            {
                username: "icellusedkars",
                body: 'This is a great aritcle name'
            }
            
            await insertComment(articleId, comment)
            .then((result) => {
                expect(result).toBeObject()

                expect(result.comment_id).toBe(19)
                expect(result.hasOwnProperty('comment_id')).toBe(true)
                expect(result.hasOwnProperty('votes')).toBe(true)
                expect(result.hasOwnProperty('created_at')).toBe(true)
                expect(result.hasOwnProperty('author')).toBe(true)
                expect(result.hasOwnProperty('body')).toBe(true)
                expect(result.hasOwnProperty('created_at')).toBe(true)
            })

            await insertComment(articleId, comment)
            .then((result) => {
                expect(result.comment_id).toBe(20);
            })
        })

    })
    describe("updateVotesValue", () => {
        test('tests updateVotesValue votes property to see if votes property changes correctly with every patch - add/remove', async () => {
            const articleId = 1
            await updateVotesValue(articleId, 12)
            .then((result) => {
                expect(result).toBeObject()
                expect(result.votes).toBe(112)
            })

            await updateVotesValue(articleId, 12)
            .then((result) => {
                expect(result).toBeObject()
                expect(result.votes).toBe(124)
            })

            await updateVotesValue(articleId, -100)
            .then((result) => {
                expect(result).toBeObject()
                expect(result.votes).toBe(24)
            })

        })

    })
    describe("addCommentCountToArticles", () => {
        test('tests updateVotesValue votes property to see if votes property changes correctly with every patch - add/remove', async () => {

        })

    }) 
})