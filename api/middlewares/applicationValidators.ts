import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateApplicationFields = (isOptional: boolean) => [
  body('firstName')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('First name must be a string'),
  body('lastName')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Last name must be a string'),
  validateDateOfBirth(''),
  body('street')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Street must be a string'),
  body('city')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('City must be a string'),
  body('state')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('State must be a string'),
  body('zipCode')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage('Zip code must be a number'),
  body('vehicles')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isArray({ min: 1, max: 3 })
    .withMessage('Vehicles must be an array with a maximum of 3 items'),
  body('vehicles.*.vin')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Vehicle VIN must be a string'),
  body('vehicles.*.year')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage('Vehicle year must be a valid number')
    .bail()
    .isInt({ min: 1985, max: new Date().getFullYear() + 1 })
    .withMessage('Vehicle year must be between 1985 and the next year'),
  body('vehicles.*.make')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Vehicle make must be a string'),
  body('vehicles.*.model')
    .if(() => isOptional)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Vehicle model must be a string'),
  body('additionalPeople')
    .optional({ nullable: true, checkFalsy: true })
    .isArray()
    .withMessage('additionalPeople must be an array'),
  body('additionalPeople.*.firstName')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('First name is required for additional people'),
  body('additionalPeople.*.lastName')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Last name is required for additional people'),
  validateDateOfBirth('additionalPeople.*'),
  validateRelationship('additionalPeople.*'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn('Validation errors in application fields:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateDateOfBirth = (path: string) => {
  return body(`${path}.dateOfBirth`)
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (value === '') {
        return true;
      }
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format. Expected ISO 8601 format.');
      }
      const age = new Date().getFullYear() - date.getFullYear();
      if (age < 16) {
        throw new Error('Applicant must be at least 16 years old.');
      }
      return true;
    });
};

const validateRelationship = (path: string) => {
  return body(`${path}.relationship`)
    .optional()
    .isIn(['Spouse', 'Sibling', 'Parent', 'Friend', 'Other'])
    .withMessage('Relationship must be one of the following: Spouse, Sibling, Parent, Friend, Other');
};

export const validateIdParam = [
  param('id')
    .isNumeric()
    .withMessage('ID must be a numeric value'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn(`Validation errors in ID parameter: ${req.params.id}`, errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
