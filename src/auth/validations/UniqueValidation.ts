import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getManager } from 'typeorm';

@ValidatorConstraint()
export class UniqueOnDatabaseExistConstraint
  implements ValidatorConstraintInterface
{
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const entity =
      validationArguments.object[
        `class_entity_${validationArguments.property}`
      ];
    return getManager()
      .count(entity, { [validationArguments.property]: value })
      .then((count) => count < 1);
  }
}

export function UniqueOnDatabase(
  entity: any,
  validationOptions?: ValidationOptions,
) {
  validationOptions = {
    ...{ message: '$' },
    ...validationOptions,
  };
  return function (object: any, propertyName: string) {
    object[`class_entity_${propertyName}`] = entity;
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueOnDatabaseExistConstraint,
    });
  };
}
