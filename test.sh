#!/bin/bash
set -e
cd "${0%/*}"

# test cases
templates=(
  first-sample-template
  section1-activity-template
  first-template
  section2-activity-template
  database-stack-template
  security-groups-template
  section3-activity-template
  metadata-mappings-template
)

function test_template {
  local test_file="$1"
  deno run "templates/$test_file.ts" > "output/${test_file}.json"
  cfn-flip "templates/$test_file.yaml" > "output/${test_file}-from-yaml.json"
  echo "" >> "output/${test_file}-from-yaml.json" # add new line

  cmp "output/${test_file}.json" "output/${test_file}-from-yaml.json" || { echo "❌ Test '${test_file}' failed"; return; }
  echo "✅ Test '${test_file}' pass"
}

# create new output folder
rm -rf output
mkdir -p output

# test templates
for template in "${templates[@]}"; do
  test_template "$template"
done
