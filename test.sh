#!/bin/bash
set -e
cd "${0%/*}"

# test cases
templates=(
  first-sample-template
  section1-activity-template
)

function test_template {
  local test_file="$1"
  deno run "templates/$test_file.ts" > "tmp/${test_file}.json"
  cfn-flip "templates/$test_file.yaml" > "tmp/${test_file}-from-yaml.json"
  echo "" >> "tmp/${test_file}-from-yaml.json" # add new line

  cmp "tmp/${test_file}.json" "tmp/${test_file}-from-yaml.json" || { echo "❌ Test '${test_file}' failed"; return; }
  echo "✅ Test '${test_file}' pass"
}

# create new tmp folder
rm -rf tmp
mkdir -p tmp

# test templates
for template in "${templates[@]}"; do
  test_template "$template"
done
