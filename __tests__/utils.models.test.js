const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");


beforeEach(() => seed(data));
afterAll(() => db.end());



const {
    convertDateTotimestamp,
} = require("../models/utils.models");

const {
    selectArticles,
    selectCommentsById
} = require("../models/article.models")


describe("convertDateTotimestamp", () => {
    test("returns a new object with valid properties -EXCLUDES created_at check", () => {
        const input = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }

        const validResponse = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: NaN,
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        
        }
        const result = convertDateTotimestamp(input);
        expect(result).toEqual(validResponse)
        expect(result).not.toBe(input);
        expect(result).toBeObject();


        expect(result.hasOwnProperty('article_id')).toBe(true)
        expect(result.hasOwnProperty('title')).toBe(true)
        expect(result.hasOwnProperty('topic')).toBe(true)
        expect(result.hasOwnProperty('author')).toBe(true)
        expect(result.hasOwnProperty('body')).toBe(true)
    
        expect(result.hasOwnProperty('votes')).toBe(true)
        expect(result.hasOwnProperty('article_img_url')).toBe(true)

    });
    test("does not mutate the input", () => {
        const input = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }

        const control = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }


        convertDateTotimestamp(input);
        expect(input).toEqual(control);
    });
})

describe("selectArticles", () => {
    test("tests selectArticles articles and articles.comment_count property after mapping", async() => {
        
        await selectArticles()
        .then((result) => {
            const articlesWithCommentsCount = result
            const articleCommentsCountList = [] 

            articlesWithCommentsCount.forEach((article) => {
                articleCommentsCountList.push(article.comment_count)
                expect(article.hasOwnProperty('comment_count')).toBe(true)
                expect((typeof article.comment_count)).toBe('number')
            })

            const controlResponseArticle = {
                author: 'icellusedkars',
                title: 'Eight pug gifs that remind me of mitch',
                article_id: 3,
                topic: 'mitch',

                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 2
            }
            const controlCommentCountlist = 
            [
                2, 1, 0, 0, 0, 2,
                11, 2, 0, 0, 0, 0,
                0
            ]

            expect(articlesWithCommentsCount[0]).toMatchObject(controlResponseArticle)
            expect(articleCommentsCountList).toEqual(controlCommentCountlist)
            })
        });
    });


describe("selectCommentsById", () => {
    test('tests selectCommentsById length and properties ', async () => {
        const articalId = 1
        await selectCommentsById(articalId)
        .then((result) => {
            const commentsList = result
            const controlCommentsQuant = 2
            
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
    test.only('tests comments list to see if its ASC', async () => {
        const articalId = 1
        await selectCommentsById(articalId)
        .then((result) => {
            const commentsList = result
            const controlCommentsQuant = 2

            for (let i = 1; i < commentsList.length; i++){
                const firstPosCreatedAt = new Date(commentsList[i -1].created_at)
                const secondPosCreatedAt = new Date(commentsList[i].created_at)
                let isAsceding = false
                
                if (firstPosCreatedAt < secondPosCreatedAt){
                    isAsceding = true
                }

                expect(isAsceding).toBe(true)
            }

        });
    })
})


