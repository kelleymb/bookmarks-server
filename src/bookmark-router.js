const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('./store')
const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
    .route('/bookmarks')
    .get((req, res) => {
        res
            .json(bookmarks);
    })
    .post(bodyParser, (req, res) => {
        const { header, id } = req.body;

        if (!header) {
            logger.error(`Header is required`);
            return res
              .status(400)
              .send('Invalid data.');
        }

        //validate bookmark id
        if(id.length > 0) {
            let valid = true;
            id.forEach(bid => {
                const bookmark = bookmarks.find(b => b.id == bid);
                if(!bookmark) {
                    logger.error(`Bookmark with id ${id} not found.`);
                    valid = false;
                }
            });

            if(!valid) {
                return res
                    .status(400)
                    .send('Invalid data.')
            }
        }

        // generate an id/get an id
        const id = uuid();

        const newBookmark = {
            id,
            title,
            url,
            rating,
            desc
        }

        bookmarks.push(newBookmark);

        logger.info(`A bookmark with ${id} was created`);

        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json({id})
    })

bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;
        
        const bookmark = bookmarks.find(bm => bm.id == id);

        //make sure we find a bookmark
        if(!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`)
            return res
                .status(404)
                .send('Bookmark Not Found.')
        }

        res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;

        const bookmarkIndex = bookmarks.findIndex(li => li.id == id);
  
        if (bookmarkIndex === -1) {
        logger.error(`Bookmark with id ${id} not found.`);
        return res
            .status(404)
            .send('Not Found');
        }
    
        bookmarks.splice(bookmarkIndex, 1);
    
        logger.info(`List with id ${id} deleted.`);
            res
                .status(204)
                .end();
    })

module.exports = bookmarkRouter