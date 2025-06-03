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
