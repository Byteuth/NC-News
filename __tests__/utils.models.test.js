const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

const {
    selectArticles,
    selectCommentsById,
    insertComment,
    updateVotesValue
} = require("../models/article.models")


beforeEach(() => seed(data));
afterAll(() => db.end());


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


    })
});


describe("selectCommentsById", () => {
    test('tests selectCommentsById length and properties ', async () => {
        const articalId = 1
        await selectCommentsById(articalId)
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



