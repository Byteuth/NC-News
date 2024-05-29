
const {
    selectArticles,
    selectCommentsById
} = require("../models/article.models")




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


