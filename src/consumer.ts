import Container from "./index";

const container = new Container();

type Foo = {
  foo: string;
};
type Bar = {
  bar: string;
};

const fooKey = container.register([], () => {
  return { foo: "foo" };
});

const fooConsumerKey = container.register([fooKey], (f: Foo) => (): Bar => {
  return { bar: f.foo };
});

const fooConsumerConsumerKey = container.register(
  [fooConsumerKey],
  (l: () => Bar) => () => {
    console.log(l().bar);
  }
);

const logger = container.resolve(fooConsumerConsumerKey);

logger();
