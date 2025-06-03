#!/bin/bash
nvim "$(find . -name "*.b" | xargs shuf -n1 -e)"
