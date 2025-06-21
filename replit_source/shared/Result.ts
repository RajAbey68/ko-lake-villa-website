export class Result<T, E> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly error?: E
  ) {}

  static success<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  static fail<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isSuccess && this.value !== undefined) {
      return Result.success(fn(this.value));
    }
    return Result.fail(this.error!);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this.isSuccess && this.value !== undefined) {
      return fn(this.value);
    }
    return Result.fail(this.error!);
  }
}