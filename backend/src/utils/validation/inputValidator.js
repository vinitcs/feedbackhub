import Joi from "joi";

// Sign Up validation
const userCreateSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\-]).{8,}$"
      )
    )
    .required(),
});

// Login Validation
const userLoginSchema = Joi.object({
  name: Joi.string().min(3).required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\-]).{8,}$"
      )
    )
    .required(),
});

// Login Validation
const adminLoginSchema = Joi.object({
  adminName: Joi.string().min(3).required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\-]).{8,}$"
      )
    )
    .required(),
});


export { userCreateSchema, userLoginSchema, adminLoginSchema };

// Signup func
// const validateUserCreate = (data) => {
//   const { error, value } = userCreateSchema.validate(data);

//   if (error) {
//     // throw new Error(error.details[0].message);
//     // const validationError = new Error(error.details[0].message);
//     // validationError.statusCode = 400;
//     // throw validationError;
//     return responseHandling(res, 400, error.details[0].message);
//   }
//   return value;
// };

// Login func
// const validateUserLogin = (data) => {
//   const { error, value } = userLoginSchema.validate(data);

//   if (error) {
//     // throw new Error(error.details[0].message);
//     // const validationError = new Error(error.details[0].message);
//     // validationError.statusCode = 400;
//     // throw validationError;
//     return responseHandling(res, 400, error.details[0].message);
//   }
//   return value;
// };
