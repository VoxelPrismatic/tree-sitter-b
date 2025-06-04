# tree-sitter-b

B grammar for tree-sitter

[Tsoding 🅱️](https://github.com/tsoding/b) grammar for tree-sitter

> [!NOTE]
> The provided queries only work for Neovim, thanks to the `#has-ancestor?` directive

# linking

since B has very little standard library, and the B compiler automatically links with stdlib when possible,
i have added the `// -*- link: stdlib -*-` comment. after this comment, lots of standard functions will
be highlighted as a builtin. this is especially handy for smaller platforms, like `uxn`, which has various
functions in its stdlib that other languages don't have.

if a link is found, it'll show up in the `@diff.plus` highlight group. otherwise, it remains `@diff.minus`

| link with stdlib.h                                                                        | link with stdio.h                                                                         |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2aa53dd4-5168-46bd-982d-17886838bf19) | ![image](https://github.com/user-attachments/assets/0bf9bae6-f392-4f07-aa69-aa13161c80f2) |

(look at `malloc` and `fprintf`)

### implemented links:

(eg `// -*- link: assert.h -*-`)

- c libraries
  - `assert.h`
  - `ctype.h`
  - `langinfo.h`
  - `locale.h`
  - `math.h`
  - `nl_types.h`
  - `regex.h`
  - `setjmp.h`
  - `signal.h`
  - `stdarg.h`
  - `stdio.h`
  - `stdlib.h`
  - `string.h`
  - `strings.h`
  - `time.h`
  - `wchar.h`
  - `wctype.h`
- uxn: `uxn`

### implemented features

- `__asm__(...)` highlighting
  - fasm/gas assembly by default
  - use the `// -*- link: uxn -*-` directive to highlight asm in uxntal
