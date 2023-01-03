# Cloud Formation Template Creator

## Prerequisite

| Command    | Install by brew         |
| ---------- | ----------------------- |
| `deno`     | `brew install deno`     |
| `cfn-flip` | `brew install cfn-flip` |

## Usage

```bash
# Generate JSON cloud formation template
deno run templates/first-sample-template.ts

# Generate YAML cloud formation template
deno run templates/first-sample-template.ts | cfn-flip -y
```
