import BaseController from './base.controller';
import config from 'config';

class MetaController extends BaseController {
  index(req, res) {
		res.json({
			version: Constants.version,
		});
	}
}

export default new MetaController();
