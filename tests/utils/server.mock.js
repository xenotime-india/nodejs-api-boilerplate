import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/server';

chai.use(chaiHttp);
export default chai.request(server);
