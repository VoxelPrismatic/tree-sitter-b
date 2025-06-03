/**
 * @file B grammar for treesitter
 * @author VoxelPrismatic <voxelprismatic@pm.me>
 * @license AGPLv2
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const op_IncDec = [
	"++", "--",
];

const op_Unary = [
	"!", "-",
];

const op_Binary = [
	"|", "&", "==", "!=", "/",
	"<", "<=", ">", ">=", "*",
	"<<", ">>", "-", "+", "%",
];

const op_Assign = op_Binary.map((_, v) => "=" + v);
op_Assign.push("=");

const newline = /\n/;
const terminator = choice(newline, ";", "\0");

const digit = {
	hex: /[0-9a-fA-F]/,
	oct: /[0-7]/,
	dec: /[0-9]/,
	bin: /[01]/,
};

const digits = {
	hex: seq(digit.hex, repeat(seq(optional("_"), digit.hex))),
	oct: seq(digit.oct, repeat(seq(optional("_"), digit.oct))),
	dec: seq(digit.dec, repeat(seq(optional("_"), digit.dec))),
	bin: seq(digit.bin, repeat(seq(optional("_"), digit.bin))),
};

const literals = {
	hex: seq("0", choice("x", "X"), optional("_"), digits.hex),
	oct: seq("0", optional("_"), digits.oct),
	dec: prec(1, choice("0", seq(/[1-9]/, optional(seq(optional("_"), digits.dec))))),
	bin: seq("0", choice("b", "B"), optional("_"), digits.bin),
};

const numLiteral = choice(
	literals.hex, literals.oct, literals.dec, literals.bin,
);

const intLiteral = seq(
	choice("+", "-", blank()), numLiteral,
);

const floatLiteral = seq(
	choice("+", "-", blank()), literals.dec, ".", digits.dec,
)

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
 * @param pri {number} priority
 * @param $ {GrammarSymbols.<any>}
 * @param char {string}
 * @returns {PrecRule}
 */
function stdlib(pri, $, char) {
	return prec(pri, seq(
		optional(repeat($.comment)),
		alias(seq(
			field("lhs", "// -*- link:"),
			field("target", char),
			field("rhs", "-*-")
		), $.linker),
		$.file
	));
}

module.exports = grammar({
	name: "b",

	word: $ => $.identifier,

	extras: _ => [
		/\s/,
	],

	inline: $ => [
		$.targets,
		$._name,
	],


	rules: {
		file: $ => choice(
			alias(stdlib(2, $, "assert.h"), $.program_c_assert_h),
			alias(stdlib(2, $, "ctype.h"), $.program_c_ctype_h),
			alias(stdlib(2, $, "langinfo.h"), $.program_c_langinfo_h),
			alias(stdlib(2, $, "locale.h"), $.program_c_locale_h),
			alias(stdlib(2, $, "math.h"), $.program_c_math_h),
			alias(stdlib(2, $, "nl_types.h"), $.program_c_nl_types_h),
			alias(stdlib(2, $, "nl_types.h"), $.program_c_nl_types_h),
			$.program,
		),

		program: $ => prec(1, seq(optional($.linker), repeat1($.definition))),

		link_name: _ => /[a-zA-Z0-9_\\-\\.]+/,
		linker: $ => seq(
			field("lhs", "// -*- link:"),
			field("target", $.link_name),
			field("rhs", "-*-")
		),

		definition: $ => prec(10, choice(
			$.define_array,
			$.define_function,
			$.auto_statement,
			$.comment,
		)),

		define_array: $ => seq(
			$._name,
			optional(seq(
				"[", optional(field("size", $.constant)), "]",
			)),
			optional(named_join("value", $.ival, field("comma", ","))),
			";"
		),

		define_function: $ => prec(5, seq(
			$._name,
			"(",
			optional(named_join("parameter", $._name, field("comma", ","))),
			")",
			$.statement,
		)),

		statement: $ => choice(
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
			seq($.rvalue, ";"),
		),

		_if: _ => prec(15, "if"),
		_while: _ => prec(15, "while"),
		_switch: _ => prec(15, "switch"),
		_case: _ => prec(15, "case"),
		_auto: _ => prec(15, "auto"),
		_extrn: _ => prec(15, "extrn"),
		_goto: _ => prec(15, "goto"),
		_return: _ => prec(15, "return"),

		auto_statement: $ => seq(
			field("token", $._auto),
			field("variables", join(seq(
				field("variable", $._name),
				optional(field("value", $.constant),
				)), field("comma", ","))),
			";"
		),


		extrn_statement: $ => seq(
			field("token", $._extrn),
			named_join("variable", $._name, field("comma", ",")),
		),

		label_statement: $ => prec.left(0, seq(
			$._name, ":", choice($.statement, blank())
		)),

		case_statement: $ => seq(
			field("token", $._case),
			field("value", $.constant),
			":",
			$.statement,
		),

		block_statement: $ => seq(
			"{", repeat($.statement), "}"
		),

		if_statement: $ => prec.right(0, seq(
			field("token", $._if),
			"(", field("condition", $.rvalue), ")",
			$.statement,
			optional(seq(
				field("token", "else"), $.statement,
			)),
		)),

		while_statement: $ => seq(
			field("token", $._while),
			"(", field("condition", $.rvalue), ")",
			$.statement,
		),

		switch_statement: $ => seq(
			field("token", $._switch),
			$.rvalue,
			$.statement,
		),

		goto_statement: $ => seq(
			field("token", $._goto),
			field("name", $.rvalue),
			";",
		),

		return_statement: $ => seq(
			field("token", $._return),
			optional(field("value", $.rvalue)),
			";",
		),

		rvalue: $ => prec(3, choice(
			seq("(", $.rvalue, ")"),
			$.lvalue,
			$.constant,
			$.assignment,
			$.increment,
			$.reference,
			$.logic,
			$.math,
			$.ternary,
			$.call,
		)),

		assignment: $ => prec.left(0, seq(
			$.lvalue, $.op_assign, $.rvalue,
		)),

		pre_increment: $ => prec.left(4, seq($.op_incdec, $.lvalue)),
		post_increment: $ => seq($.lvalue, $.op_incdec),

		increment: $ => choice($.pre_increment, $.post_increment),

		reference: $ => prec(1, seq(
			field("token", "&"), $.lvalue,
		)),

		logic: $ => prec(6, seq(
			$.op_unary, $.rvalue
		)),

		math: $ => prec.left(2, seq(
			$.rvalue, $.op_binary, $.rvalue,
		)),

		ternary: $ => prec.right(0, seq(
			$.rvalue, field("token", "?"), $.rvalue, field("token", ":"), $.rvalue,
		)),

		number_literal: _ => prec(5, choice(
			numLiteral, intLiteral, floatLiteral,
		)),

		rune_literal: $ => seq(
			"'", choice(/[^\\]/, /[\*\%]./, $.escape_sequence), "'",
		),

		string_literal: $ => seq(
			"\"",
			choice(
				alias(token.immediate(prec(1, /[^\\"\n]+/)), $.string_content),
				$.escape_sequence,
			),
			'"',
		),

		call: $ => prec(10, seq(
			$._name,
			"(",
			optional(named_join("parameter", $.rvalue, field("comma", ","))),
			")",
		)),

		lvalue: $ => prec(1, choice(
			$._name,
			alias(seq("*", $.rvalue), $.dereference),
			$.array_index,
		)),

		array_index: $ => prec(3, seq(
			field("name", $.rvalue),
			"[", field("value", $.rvalue), "]",
		)),

		constant: $ => choice(
			$.number_literal, $.rune_literal, $.string_literal,
		),

		escape_sequence: _ => token(prec(1, seq(
			'\\',
			choice(
				/[^xuU]/,
				/\d{2,3}/,
				/x[0-9a-fA-F]{1,4}/,
				/u[0-9a-fA-F]{4}/,
				/U[0-9a-fA-F]{8}/,
			),
		))),

		op_binary: _ => prec(7, choice(...op_Binary)),
		op_unary: _ => choice(...op_Unary),
		op_assign: $ => prec.right(1, seq("=", optional($.op_binary))),
		op_incdec: _ => choice(...op_IncDec),

		ival: $ => choice(
			$._name, $.constant,
		),

		identifier: _ => /[\p{XID_Start}][\p{XID_Continue}]*/u,

		// http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
		comment: _ => choice(
			seq('//', /.*/),
			seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
		),

		_name: $ => field("name", $.identifier),
	},
});
