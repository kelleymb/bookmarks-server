//require dotenv so that we can access 
//the TEST_DB_URL from within our tests
require('dotenv').config()
const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest