import { getError } from "../utils/tools.js";
export const validateBody = (joiSchemas) => (req, res, next) => {
    if (req.body) {
        const endpoint = req.method + req.path;
        const schema = joiSchemas[endpoint];
        if (!schema)
            throw new Error(getError(500, "validation schema not found"));
        const { error } = schema.validate(req.body);
        if (error)
            throw new Error(getError(400, error.message));
    }
    next();
};
