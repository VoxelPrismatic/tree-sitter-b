#!/bin/bash
make -B
nvim "$(find . -name "*.b" | xargs shuf -n1 -e)"
