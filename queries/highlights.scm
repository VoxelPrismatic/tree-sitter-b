(program_c
  lhs: "// -*- link:" @comment
  target: "c" @markup.strong @diff.minus
  rhs: "-*-" @comment)

((identifier) @variable
  (#set! priority 95))

((identifier) @function.builtin @constant
  (#set! priority 105)
  (#any-of? @function.builtin
    "char" "chdir" "chmod" "chown" "close" "creat" "ctime" "execl" "execv" "exit" "fork" "fstat"
    "getchar" "getuid" "gtty" "lchar" "link" "mkdir" "open" "printf" "printn" "putchar" "read"
    "setuid" "stat" "stty" "unlink" "wait" "write" "main")
  (#any-match? @constant "^[A-Z0-9_\\-]" "args"))

((identifier) @function.builtin
  (#set! priority 105)
  (#any-of? @function.builtin
    "malloc" "calloc" "ioctl" "usleep" "memset" "memmove" "memcpy" "tcgetattr" "tcsetattr" "rand"
    "srand" "time")
  (#has-ancestor? @function.builtin program_c))

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
