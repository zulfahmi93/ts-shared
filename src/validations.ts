import { isDate, isNumber, isString } from 'lodash';


type ValidatableType = string | number | Date;

class ValidationResult {
  private readonly _originalValue: ValidatableType;
  private readonly _errorMessages: string[];
  private _isValid: boolean;

  /** @param originalValue {ValidatableType} */
  public constructor(originalValue: ValidatableType) {
    this._originalValue = originalValue;
    this._errorMessages = [];
    this._isValid       = true;
  }

  public get originalValue(): ValidatableType {
    return this._originalValue;
  }

  public get errorMessages(): string[] {
    return this._errorMessages;
  }

  public get isValid(): boolean {
    return this._isValid;
  }

  invalidate(errorMessage: string): void {
    this._errorMessages.push(errorMessage);
    this._isValid = false;
  }
}

class Validator {
  private _result: ValidationResult;

  constructor(value: ValidatableType) {
    this._result = new ValidationResult(value);
  }

  public get originalValue(): ValidatableType {
    return this._result.originalValue;
  }

  public get errorMessages(): string[] {
    return this._result.errorMessages;
  }

  public get isValid(): boolean {
    return this._result.isValid;
  }

  public notNull(errorMessage: string): this {
    const value = this._result.originalValue;
    if (isNumber(value)) {
      return this;
    }

    if (value == null) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public notEmpty(errorMessage: string): this {
    const value = this._result.originalValue;
    if (isNumber(value)) {
      return this;
    }

    if (value == null) {
      this._result.invalidate(errorMessage);
    }

    if (isString(value) && (value as string).length === 0) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public eMail(errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isString(value)) {
      return this;
    }

    const match = (value as string).match(/(\w+)@(\w+)\.[a-zA-Z]/);
    if (match == null) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public regex(pattern: string, errorMessage: string): this {
    const value = this._result.originalValue;
    let str     = value.toString();

    const match = str.match(pattern);
    if (match == null) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public equals(other: ValidatableType, errorMessage: string): this {
    const value = this._result.originalValue;
    if (value === other) {
      return this;
    }

    this._result.invalidate(errorMessage);
    return this;
  }

  public notEquals(other: ValidatableType, errorMessage: string): this {
    const value = this._result.originalValue;
    if (value === other) {
      this._result.invalidate(errorMessage);
      return this;
    }

    return this;
  }

  public minLength(length: number, errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isString(value)) {
      return this;
    }

    if ((value as string).length < length) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public minUppercase(count: number, errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isString(value)) {
      return this;
    }

    const matches = (value as string).match(/[A-Z]/g);
    if (matches == null || matches.length < count) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public minLowercase(count: number, errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isString(value)) {
      return this;
    }

    const matches = (value as string).match(/[a-z]/g);
    if (matches == null || matches.length < count) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public minDigit(count: number, errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isString(value)) {
      return this;
    }

    const matches = (value as string).match(/[0-9]/g);
    if (matches == null || matches.length < count) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public minSymbol(count: number, errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isString(value)) {
      return this;
    }

    const matches = (value as string).match(/[^\w\s]/g);
    if (matches == null || matches.length < count) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public range(min: number | Date, max: number | Date, errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isNumber(value) && !isDate(value)) {
      return this;
    }

    if (value < min || value > max) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public lessThan(comparison: number | Date, errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isNumber(value) && !isDate(value)) {
      return this;
    }

    if (value >= comparison) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public lessThanOrEqualsTo(comparison: number | Date, errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isNumber(value) && !isDate(value)) {
      return this;
    }

    if (value > comparison) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public greaterThan(comparison: number | Date, errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isNumber(value) && !isDate(value)) {
      return this;
    }

    if (value <= comparison) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public greaterThanOrEqualsTo(comparison: number | Date, errorMessage: string): this {
    const value = this._result.originalValue;
    if (!isNumber(value) && !isDate(value)) {
      return this;
    }

    if (value < comparison) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }

  public mustExistIn(items: ValidatableType[], errorMessage: string): this {
    const value = this._result.originalValue;
    if (items.indexOf(value) < 0) {
      this._result.invalidate(errorMessage);
    }

    return this;
  }
}

function validate(value: ValidatableType): Validator {
  return new Validator(value);
}

export default validate;
