# tree-sitter-b

A tree-sitter parser for [🅱️](https://github.com/tsoding/b)

> [!NOTE]
> The provided queries only work for Neovim, thanks to the `#has-ancestor?` directive

# linking

since B has very little standard library, and the B compiler automatically links with stdlib when possible,
i have added the `// -*- link: stdlib -*-` comment. after this comment, lots of standard functions will
be highlighted as a builtin. this is especially handy for smaller platforms, like `uxn`, which has various 
functions in its stdlib that other languages don't have.

if a link is found, it'll show up in the `@diff.plus` highlight group. otherwise, it remains `@diff.minus`

| link with stdlib.h | link with stdio.h |
|-|-|
| ![image](https://github.com/user-attachments/assets/2aa53dd4-5168-46bd-982d-17886838bf19) | ![image](https://github.com/user-attachments/assets/0bf9bae6-f392-4f07-aa69-aa13161c80f2) |

(look at `malloc` and `fprintf`)

### implemented links:

(eg `// -*- link: assert.h -*-`)

- c: `assert.h`
- c: `ctype.h`
- c: `langinfo.h`
- c: `locale.h`
- c: `math.h`
- c: `nl_types.h`
- c: `regex.h`
- c: `setjmp.h`
- c: `signal.h`
- c: `stdarg.h`
- c: `stdio.h`
- c: `stdlib.h`
- c: `string.h`
- c: `strings.h`
- c: `time.h`
- c: `wchar.h`
- c: `wctype.h`
