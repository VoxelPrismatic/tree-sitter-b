(_
  lhs: (linker) @comment
  target: (linker) @markup.strong @diff.plus
  rhs: (linker) @comment)

(linker
  target: (link_name) @markup.strong @diff.minus) @comment

((identifier) @variable
  (#set! priority 95))

((identifier) @constant
  (#set! priority 103)
  (#any-match? @constant "^[A-Z0-9_\\-]+$" "args"))

(comment) @comment

[
  "auto"
  "extrn"
] @keyword.type

"return" @keyword.return

"while" @keyword.repeat

(goto_statement
  token: "goto" @keyword
  name: (rvalue) @label)

(label_statement
  name: (_) @label)

[
  "if"
  "else"
  "case"
  "switch"
] @keyword.conditional

[
  (op_binary)
  (op_unary)
  (op_assign)
  (op_incdec)
] @keyword.operator

(rune_literal) @character

(string_literal) @string

(number_literal) @number

(define_function
  name: (identifier) @function.method)

(call
  name: (identifier) @function.method @function.method.call)

[
  ","
  ":"
  ";"
] @keyword.delimeter

((identifier) @function.builtin
  (#set! priority 105)
  (#any-of? @function.builtin
    "char" "chdir" "chmod" "chown" "close" "creat" "ctime" "execl" "execv" "exit" "fork" "fstat"
    "getchar" "getuid" "gtty" "lchar" "link" "mkdir" "open" "printf" "printn" "putchar" "read"
    "setuid" "stat" "stty" "unlink" "wait" "write" "main"))

((identifier) @function.builtin
  (#set! priority 105)
  (#any-of? @function.builtin "assert")
  (#has-ancestor? @function.builtin program_c_assert_h))

((identifier) @function.builtin
  (#set! priority 105)
  (#any-of? @function.builtin
    "isalnum" "isalpha" "isascii4" "isblank" "iscntrl" "isdigit" "isgraph" "islower" "isprint"
    "ispunct" "isspace" "isupper" "toascii" "tolower" "toupper")
  (#has-ancestor? @function.builtin program_c_ctype_h))

((identifier) @function.builtin
  (#set! priority 105)
  (#any-of? @function.builtin "nl_langinfo4")
  (#has-ancestor? @function.builtin program_c_langinfo_h))

((identifier) @function.builtin
  (#set! priority 105)
  (#any-of? @function.builtin
    "acos" "asin" "atan" "atan2" "ceil" "cos" "cosh" "erf" "erfc" "exp" "fabs" "floor" "fmod"
    "frexp" "gamma" "hypot" "j0" "j1" "jn" "ldexp" "log" "log10" "modf" "nextafter" "nextafterl"
    "nexttoward" "nexttowardl" "pow" "quantexpd32" "quantexpd64" "quantexpd128" "quantized32"
    "quantized64" "quantized128" "samequantumd32" "samequantumd64" "samequantumd128" "sin" "sinh"
    "sqrt" "tan" "tanh" "y0" "y1" "yn")
  (#has-ancestor? @function.builtin program_c_math_h))
