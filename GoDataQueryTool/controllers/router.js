const Router = require("koa-router");
const QueryController = require("./queryController");

const router = new Router();
const query = new QueryController();

router.post("/queries", (ctx, next) => query.execute(ctx, next));

module.exports = router;
