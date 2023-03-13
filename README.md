# Cloud Formation Template Creator

## Prerequisite

| Command    | Install by brew         |
| ---------- | ----------------------- |
| `deno`     | `brew install deno`     |
| `rain`     | `brew install rain`     |
| `cfn-flip` | `brew install cfn-flip` |

## Usage

```bash
# Generate JSON cloud formation template
deno run templates/first-sample-template.ts

# Generate YAML cloud formation template
deno run templates/first-sample-template.ts | cfn-flip -y
```

## Example

```ts
// example.ts
import { createStack } from './src/Stack.ts';

const stack = createStack({
  Description: 'This is my first s3 bucket.',
});

stack.addResource('s3', {
  Type: 'AWS::S3::Bucket',
});

// show cloud formation template
console.log(stack.json());

// deploy template by aws cli
await stack.deploy({
  stackName: 'my-first-stack',
  awsProfile: 'default',
});
```

```bash
deno run --allow-all example.ts
```

## Screenshot

![](https://user-images.githubusercontent.com/2791834/224597819-71a7356f-6a8f-4494-95ed-7f53768b04cf.png)
