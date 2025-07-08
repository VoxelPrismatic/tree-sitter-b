/**
 * @file B grammar for treesitter
 * @author VoxelPrismatic <voxelprismatic@pm.me>
 * @license AGPLv2
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const op_IncDec = [
	"++",
	"--",
];

const op_Unary = [
	"!",
	"-",
];

const op_Binary = [
	"|",
	"&",
	"==",
	"!=",
	"/",
	"<",
	"<=",
	">",
	">=",
	"*",
	"<<",
	">>",
	"-",
	"+",
	"%",
];

const op_Assign = op_Binary.map((_, v) => "=" + v);
op_Assign.push("=");

const digits = {
	hex: /([0-9a-fA-F]_?)+/,
	oct: /([0-7]_?)+/,
	dec: /([0-9]_?)+/,
	bin: /([01]_?)+/,
};

const literals = {
	hex: /0[xX]([a-fA-F0-9]+_?)+/,
	oct: /0([0-7]+_?)+/,
	dec: prec(1, /(0|[1-9]([0-9]+_?)*)/),
	bin: /0[bB]([01]+_?)+/,
};

const numLiteral = choice(
	literals.hex,
	literals.oct,
	literals.dec,
	literals.bin,
);

const intLiteral = seq(
	choice("+", "-", blank()),
	numLiteral,
);

const floatLiteral = seq(
	choice("+", "-", blank()),
	literals.dec,
	".",
	digits.dec,
);

/**
 * rule {char rule}*
 * @param rule {RuleOrLiteral}
 * @param char {RuleOrLiteral}
 * @returns {SeqRule}
 */
function join(rule, char) {
	return seq(rule, repeat(seq(char, rule)));
}

/**
 * @param name {String}
 * @param rule {RuleOrLiteral}
 * @param char {RuleOrLiteral}
 * @returns {FieldRule}
 */
function named_join(name, rule, char) {
	return field(name + "s", join(field(name, rule), char));
}

/**
 * @param $ { GrammarSymbols.<any> }
 * @param key { string | RegExp }
 * @param obj { SymbolRule.<any> }
 * @returns { PrecRule }
 */
function stdlib($, key, obj) {
	return prec(
		2,
		alias(
			seq(
				field("lhs", "// -*- link:"),
				field(
					(typeof key) != "string" ? "nil_target" : "target",
					key,
				),
				field("rhs", "-*-"),
				prec.left(1000, repeat1($.program)),
			),
			obj,
		),
	);
}

/**
 * @param $ {GrammarSymbols.<any>}
 * @param obj {Object.<string, SymbolRule.<any>>}
 * @returns {Array.<RuleOrLiteral>}
 */
function stdlibs($, obj) {
	/** @type {Array.<RuleOrLiteral>} */
	let ret = [
		stdlib($, /[a-zA-Z0-9_\\-\\.]+/, $.program_nil),
	];

	for (var key of Object.keys(obj)) {
		ret.push(prec.left(ret.length, stdlib($, key, obj[key])));
	}
	return ret;
}

module.exports = grammar({
	name: "b",

	word: ($) => $.identifier,

	extras: (_) => [
		/\s/,
	],

	conflicts: ($) => [
		[$._stdlibs],
		[$.program],
	],

	inline: ($) => [
		$._name,
	],

	rules: {
		program: ($) => repeat1($.definition),

		_stdlibs: ($) =>
			choice(...stdlibs($, {
				"assert.h": $.program_c_assert_h,
				"ctype.h": $.program_c_ctype_h,
				"langinfo.h": $.program_c_langinfo_h,
				"locale.h": $.program_c_locale_h,
				"math.h": $.program_c_math_h,
				"nl_types.h": $.program_c_nl_types_h,
				"regex.h": $.program_c_regex_h,
				"setjmp.h": $.program_c_setjmp_h,
				"signal.h": $.program_c_signal_h,
				"stdarg.h": $.program_c_stdarg_h,
				"stdio.h": $.program_c_stdio_h,
				"stdlib.h": $.program_c_stdlib_h,
				"string.h": $.program_c_string_h,
				"strings.h": $.program_c_strings_h,
				"time.h": $.program_c_time_h,
				"wchar.h": $.program_c_wchar_h,
				"wctype.h": $.program_c_wctype_h,
				"uxn": $.program_uxn,
			})),

		definition: ($) =>
			prec(
				25,
				choice(
					$._stdlibs,
					$.define_array,
					$.define_function,
					$.auto_statement,
					$.comment,
				),
			),

		define_array: ($) =>
			seq(
				$._name,
				optional(seq(
					token("["),
					field("size", optional($.constant)),
					token("]"),
				)),
				optional(
					named_join("value", $.ival, field("comma", token(","))),
				),
				token(";"),
			),

		define_function: ($) =>
			prec(
				5,
				seq(
					$._name,
					token("("),
					optional(
						named_join(
							"parameter",
							$._name,
							field("comma", token(",")),
						),
					),
					token(")"),
					$.statement,
				),
			),

		statement: ($) =>
			choice(
				$.auto_statement,
				$.extrn_statement,
				$.label_statement,
				$.case_statement,
				$.block_statement,
				$.if_statement,
				$.while_statement,
				$.switch_statement,
				$.goto_statement,
				$.return_statement,
				$.assembly,
				seq($.rvalue, token(";")),
			),

		_if: (_) => prec(15, "if"),
		_else: (_) => prec(15, "else"),
		_while: (_) => prec(15, "while"),
		_switch: (_) => prec(15, "switch"),
		_case: (_) => prec(15, "case"),
		_auto: (_) => prec(15, "auto"),
		_extrn: (_) => prec(15, "extrn"),
		_goto: (_) => prec(15, "goto"),
		_return: (_) => prec(15, "return"),

		auto_statement: ($) =>
			seq(
				field("token", $._auto),
				field(
					"variables",
					join(
						seq(
							field("variable", $._name),
							optional(field("value", $.constant)),
						),
						field("comma", token(",")),
					),
				),
				token(";"),
			),

		extrn_statement: ($) =>
			seq(
				field("token", $._extrn),
				named_join("variable", $._name, field("comma", token(","))),
				token(";"),
			),

		label_statement: ($) =>
			prec.left(
				0,
				seq(
					$._name,
					token(":"),
					choice($.statement, blank()),
				),
			),

		case_statement: ($) =>
			seq(
				field("token", $._case),
				field("value", $.constant),
				token(":"),
				$.statement,
			),

		block_statement: ($) =>
			seq(
				token("{"),
				repeat(choice($.statement, $.comment)),
				token("}"),
			),

		if_statement: ($) =>
			prec.right(
				0,
				seq(
					field("token", $._if),
					token("("),
					field("condition", $.rvalue),
					token(")"),
					$.statement,
					optional(seq(
						field("token", $._else),
						$.statement,
					)),
				),
			),

		while_statement: ($) =>
			seq(
				field("token", $._while),
				token("("),
				field("condition", $.rvalue),
				token(")"),
				$.statement,
			),

		switch_statement: ($) =>
			seq(
				field("token", $._switch),
				$.rvalue,
				$.statement,
			),

		goto_statement: ($) =>
			seq(
				field("token", $._goto),
				field("name", $.rvalue),
				token(";"),
			),

		return_statement: ($) =>
			seq(
				field("token", $._return),
				optional(field("value", $.rvalue)),
				token(";"),
			),

		rvalue: ($) =>
			prec(
				3,
				choice(
					seq(token("("), $.rvalue, token(")")),
					$.lvalue,
					$.constant,
					$.assignment,
					$.increment,
					$.reference,
					$.logic,
					$.math,
					$.ternary,
					$.call,
				),
			),

		assignment: ($) =>
			prec.left(
				0,
				seq(
					$.lvalue,
					$.op_assign,
					$.rvalue,
				),
			),

		pre_increment: ($) => prec.left(4, seq($.op_incdec, $.lvalue)),
		post_increment: ($) => seq($.lvalue, $.op_incdec),

		increment: ($) => choice($.pre_increment, $.post_increment),

		reference: ($) =>
			prec(
				1,
				seq(
					field("token", token("&")),
					$.lvalue,
				),
			),

		logic: ($) =>
			prec(
				6,
				seq(
					$.op_unary,
					$.rvalue,
				),
			),

		math: ($) =>
			prec.left(
				2,
				seq(
					$.rvalue,
					$.op_binary,
					$.rvalue,
				),
			),

		ternary: ($) =>
			prec.right(
				0,
				seq(
					$.rvalue,
					field("token", token("?")),
					$.rvalue,
					field("token", token(":")),
					$.rvalue,
				),
			),

		number_literal: (_) =>
			prec(
				5,
				choice(
					numLiteral,
					intLiteral,
					floatLiteral,
				),
			),

		rune_literal: ($) =>
			seq(
				"'",
				repeat(
					choice(
						$.escape_sequence,
						/[^\\']+/,
					),
				),
				"'",
			),

		string_literal: ($) =>
			seq(
				field("quote", $.quote),
				field(
					"content",
					repeat(choice(
						$.escape_sequence,
						$.format_sequence,
						alias(
							token.immediate(prec(1, /[^\\"\n%]+/)),
							$.string_content,
						),
					)),
				),
				field("quote", $.quote),
			),

		quote: (_) => '"',

		call: ($) =>
			prec(
				10,
				seq(
					$._name,
					token("("),
					optional(
						named_join("parameter", $.rvalue, field("comma", ",")),
					),
					token(")"),
				),
			),

		lvalue: ($) =>
			prec(
				1,
				choice(
					$._name,
					alias(seq(token("*"), $.rvalue), $.dereference),
					$.array_index,
				),
			),

		array_index: ($) =>
			prec(
				3,
				seq(
					field("name", $.rvalue),
					token("["),
					field("value", $.rvalue),
					token("]"),
				),
			),

		constant: ($) =>
			choice(
				$.number_literal,
				$.rune_literal,
				$.string_literal,
			),

		escape_sequence: (_) =>
			token(prec(
				2,
				seq(
					"\\",
					choice(
						/[^xuU]/,
						/\d{2,3}/,
						/x[0-9a-fA-F]{1,2}/,
						/u[0-9a-fA-F]{4}/,
						/U[0-9a-fA-F]{8}/,
					),
				),
			)),

		format_sequence: (_) =>
			token(prec(
				2,
				seq(
					"%",
					choice(
						"c",
						/(.?\d+)?d/,
						"e",
						"E",
						/(.?\d+(\.\d+))?f/,
						"g",
						"G",
						"i",
						"ld",
						"li",
						"lf",
						"Lf",
						"lu",
						"lli",
						"lld",
						"llu",
						"o",
						"p",
						"s",
						"u",
						/(.?\d+)?[xX]/,
						"n",
						"%",
						blank(),
					),
				),
			)),

		op_binary: (_) => token(prec(7, choice(...op_Binary))),
		op_unary: (_) => token(choice(...op_Unary)),
		op_assign: (_) =>
			token(prec.right(1, seq("=", optional(choice(...op_Binary))))),
		op_incdec: (_) => token(prec(8, choice(...op_IncDec))),

		ival: ($) =>
			choice(
				$._name,
				$.constant,
			),

		identifier: (_) => /[\p{XID_Start}][\p{XID_Continue}]*/u,

		// http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
		comment: ($) =>
			choice(
				seq("//", /.*/),
				seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
			),

		_name: ($) => field("name", $.identifier),

		assembly: ($) =>
			seq(
				field("token", token("__asm__")),
				token("("),
				named_join("instruction", $.string_literal, token(",")),
				token(")"),
				token(";"),
			),
	},
});
