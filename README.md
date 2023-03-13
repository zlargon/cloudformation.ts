# CloudFormation.ts

Leverage the power of [TypeScript](https://www.typescriptlang.org/) and [Deno](https://deno.land/) to write a robust CloudFormation template with ease.

## Prerequisite

| Command                                              | Description                                                 |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| [`deno`](https://deno.land/)                         | Modern runtime for TypeScript and JavaScript                |
| [`rain`](https://github.com/aws-cloudformation/rain) | CLI tool working with AWS CloudFormation template and stack |

If you're a mac user, use `brew` to install `deno` and `rain`.

```bash
brew install deno rain
```

## Example

```ts
// example.ts
import { createStack } from './src/Stack.ts';

const stack = createStack({
  Description: 'This is my first s3 bucket.',
});

const myBucket = stack.addResource('MyBucket', {
  Type: 'AWS::S3::Bucket',
});

stack.addOutput('MyBucketDomainName', {
  Description: 'My bucket domain name',
  Value: myBucket.Attr('DomainName'),
});

// show cloud formation template (JSON)
console.log(stack.json());

// deploy template by rain
await stack.deploy({
  awsProfile: 'default',
  stackName: 'my-first-stack',
});
```

```bash
# Run typescript code using deno
deno run example.ts
```

## Screenshot

![](https://user-images.githubusercontent.com/2791834/224875277-3d5c532b-8fb3-42e4-8e71-a655fef2d860.png)
