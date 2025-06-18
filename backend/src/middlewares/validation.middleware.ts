import { ObjectSchema } from "yup";
import { Request, Response, NextFunction, RequestHandler } from "express";

// A reusable higher order function that returns a middleware to validate any part of a request

/* Understanding complex higher order functions (without it we would need 4 separate functions for each input type
 *
 * This:
 * const createValidator = (...) => async (...) => { ... };
 *
 * Is equivalent to this:
 * const createValidator = (...) => {
 * return async (...) => {
 *   <function body>
 *   };
 * };
 */
const createValidator =
    (
        // schema: The yup schema that tells what the data should look like
        // source: tells which part of the request we want to validate ("body", "query", "params", or "headers")
        schema: ObjectSchema<any>,
        source: "body" | "query" | "params" | "headers",
    ): RequestHandler => // RequestHandler is a predefined type in Express that describes the shape of a middleware function (async function returned below)
    // RequestHandler is equivalent to (req: Request, res: Response, next: NextFunction) => void | Promise<void>
    // This function returns an async middleware function that Express will run during a request
    async (req: Request, res: Response, next: NextFunction) => {
        // Check if the provided schema has any schema/rules defined (fields)
        if (schema.fields && !Object.keys(schema.fields).length) {
            res.status(500).json({
                status: 422, // Unprocessable input
                errors: "Validator schema empty!",
            });
        }

        try {
            // aboutEarly: false lets us collect all errors, instead of stopping at the first one
            await schema.validate(req[source], { abortEarly: false });
            next();
        } catch (errors) {
            res.status(422).json({ status: 422, errors });
        }
    };

// With this object it is possible to use the createValidator function to choose what part of the request has to be validated
const ReqValidate = {
    body: (schema: ObjectSchema<any>) => createValidator(schema, "body"),
    query: (schema: ObjectSchema<any>) => createValidator(schema, "query"),
    params: (schema: ObjectSchema<any>) => createValidator(schema, "params"),
    headers: (schema: ObjectSchema<any>) => createValidator(schema, "headers"),
};

export default ReqValidate;
