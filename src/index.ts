type DIKey<T> = {
  l: () => T;
  uniqueKey: Symbol;
};

export default class Container {
  private registrations: Map<Symbol, [DIKey<any>[], Function]>;

  constructor() {
    this.registrations = new Map();
    this.resolve = this.resolve.bind(this);
  }

  private makeDiKey<T>(l: () => T): DIKey<T> {
    return {
      l,
      uniqueKey: Symbol(l.toString() + new Date().getTime())
    };
  }

  register<T extends any[], U>(
    keys: { [k in keyof T]: DIKey<T[k]> },
    lambda: (...t: T) => U
  ): DIKey<U> {
    const key = this.makeDiKey(lambda);

    this.registrations.set(key.uniqueKey, [keys, lambda]);

    return key;
  }

  resolve<T>(k: DIKey<T>): T {
    if (!this.registrations.has(k.uniqueKey)) {
      throw "key is not registered with this container";
    }
    const [deps, resolver] = this.registrations.get(k.uniqueKey)!;
    return resolver(...deps.map(this.resolve));
  }
}
