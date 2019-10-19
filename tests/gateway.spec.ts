import {expect} from "chai";
import * as chai from 'chai';
import * as express from "express";
import * as bodyParser from  "body-parser";
import {getConnection, createConnection} from "typeorm";
import {database} from "../src/common/db_config";
import {routes} from "../src/gateway/routes/gatewayRoutes";
import {GatewayControllers} from "../src/gateway/controllers/gatewayControllers";
import chaiHttp = require('chai-http');
import {createServiceConnections, lorem} from "./utils";

chai.use(chaiHttp);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

createServiceConnections();

describe('routes', () => {
    before((done) => {
        createConnection(database).then(() => {
            const controller = new GatewayControllers();
            routes(app, controller);
            app.listen(process.env.TEST_PORT);
            done();
        });
    });

    after(async () => {
        await getConnection(process.env.NODE_ENV).synchronize(true);
    });

    describe("Запрос должен проходить удачно, ", () => {
        let user_id;
        let story_id;
        describe("если post /user/auth", () => {
            it("и возвращать статус 200", (done) => {
                chai.request(app)
                    .post('/user/auth')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({"name": "test", "password": "23jjUSjdsew814"})
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }

                        expect(response).to.have.status(200);
                        user_id = response.body.user.id;
                        done();
                    });
            });
        });

        describe("если patch /user/id", () => {
            it("и возвращать статус 200", (done) => {
                chai.request(app)
                    .patch('/user/' + user_id)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({"email":"shfbsj@djkfg.ru"})
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }
                        expect(response).to.have.status(200);
                        done();
                    });
            });
        });

        describe("если post /user/id/stories/", () => {
            it("и возвращать статус 201", (done) => {
                chai.request(app)
                    .post('/user/' + user_id + '/stories')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({"theme":"test", "article":lorem.generateSentences(4)})
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }
                        expect(response).to.have.status(201);
                        story_id = response.body.id;
                        done();
                    });
            });
        });

        describe("если get /stories", () => {
           it("и возвращать статус 200", (done) => {
               chai.request(app)
                   .get('/stories/')
                   .set('content-type', 'application/x-www-form-urlencoded')
                   .end((error: any, response: any) => {
                       if (error) {
                           done(error);
                       }
                       expect(response).to.have.status(200);
                       done();
                   });
           })
        });

        describe("если get /stories/stories_id", () => {
            it("и возвращать статус 200", (done) => {
                chai.request(app)
                    .get('/stories/' + story_id)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }
                        expect(response).to.have.status(200);
                        done();
                    });
            })
        });


        describe("если patch /user/id/stories/story_id", () => {
            it("и возвращать статус 200", (done) => {
                chai.request(app)
                    .patch('/user/' + user_id + '/stories/' + story_id)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({"article":lorem.generateSentences(5)})
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }
                        expect(response).to.have.status(200);
                        done();
                    });
            });
        });

        describe('если post /user/id/stories/story_id/favourites', () => {
            it("и возвращать статус 201", (done) => {
                chai.request(app)
                    .post('/user/' + user_id + '/stories/' + story_id + '/favourites')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }
                        expect(response).to.have.status(201);
                        done();
                    });
            });
        });

        describe('если get /user/id/favourites', () => {
            it("и возвращать статус 200", (done) => {
                chai.request(app)
                    .get('/user/' + user_id + '/favourites')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }
                        expect(response).to.have.status(200);
                        done();
                    });
            });
        });

        describe('если delete /user/id/stories/story_id/favourites', () => {
            it("и возвращать статус 200", (done) => {
                chai.request(app)
                    .delete('/user/' + user_id + '/stories/' + story_id + '/favourites')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }
                        expect(response).to.have.status(200);
                        done();
                    });
            });
        });

        describe("если delete /user/id/stories/story_id", () => {
            it("и возвращать статус 200", (done) => {
                chai.request(app)
                    .delete('/user/' + user_id + '/stories/' + story_id)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }
                        expect(response).to.have.status(200);
                        done();
                    });
            });
        });

        describe("если get /user/id/notifications", () => {
            it("и возвращать статус 200", (done) => {
                chai.request(app)
                    .get('/user/' + user_id + '/notifications')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }
                        expect(response).to.have.status(200);
                        done();
                    });
            });
        });

        describe("если patch /user/id/notifications", () => {
            it("и возвращать статус 200", (done) => {
                chai.request(app)
                    .patch('/user/' + user_id + '/notifications')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({'email':'true'})
                    .end((error: any, response: any) => {
                        if (error) {
                            done(error);
                        }
                        expect(response).to.have.status(200);
                        done();
                    });
            });
        });
    });
});







