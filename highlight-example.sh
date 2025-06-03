#!/bin/bash
cp ../nvim-treesitter/runtime/queries/b/highlights.scm ./queries/highlights.scm
make -B && nvim "$(find . -name "*.b" | xargs shuf -n1 -e)"
