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
	"!",
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
	dec: seq(/[1-9]/, optional("_"), digits.dec),
	bin: seq("0", choice("b", "B"), optional("_"), digits.bin),
};

const numLiteral = choice(
	literals.hex, literals.oct, literals.dec, literals.bin,
);

const intLiteral = seq(
	optional(choice("+", "-")), numLiteral,
);

/**
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


module.exports = grammar({
	name: "b",

	word: $ => $.identifier,

	extras: $ => [
		// $.statement,
		$.comment,
		/\s/,
	],

	inline: $ => [
		$.statement,
		$._operator,
	],

	supertypes: $ => [
		$.statement,
		$._operator,
	],

	rules: {
		identifier: _ => /[a-zA-Z_][a-zA-Z0-9]*/,

		// http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
		comment: _ => token(choice(
			seq("//", /.*/),
			seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
		)),

		auto_statement: $ => seq(
			field("tok", token("auto")),
			named_join("name", $.identifier, ","),
			";",
		),

		extrn_statement: $ => seq(
			field("tok", token("extrn")),
			named_join("name", $.identifier, ","),
			";",
		),

		goto_statement: $ => seq(
			field("tok", token("goto")),
			field("name", $.identifier),
			";"
		),

		label_statement: $ => seq(
			field("name", $.identifier),
			":",
			$.statement,
		),

		block_statement: $ => seq(
			"{", $.statement, "}",
		),

		statement: $ => choice(
			$.goto_statement,
			$.auto_statement,
			$.extrn_statement,
			$.label_statement,
			$.block_statement,
		),


		op_binary: _ => choice(...op_Binary),
		op_unary: _ => choice(...op_Unary),
		op_assign: _ => choice(...op_Assign),
		op_incdec: _ => choice(...op_IncDec),
		_operator: $ => alias(choice(
			$.op_binary,
			$.op_unary,
			$.op_assign,
			$.op_incdec,
		), "operator"),

		number_literal: _ => choice(
			intLiteral, numLiteral,
		),

		rune_literal: _ => seq(
			"'", /./, "'",
		),

		string_literal: $ => seq(
			"\"",
			choice(
				alias(token.immediate(prec(1, /[^\\"\n]+/)), $.string_content),
				$.escape_sequence,
			),
			'"',
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

		const_literal: $ => choice(
			$.number_literal, $.rune_literal, $.string_literal,
		),

		program: $ => repeat($.definition),

		ival: $ => choice(
			$.const_literal, $.identifier,
		),

		define_array: $ => seq(
			field("name", $.identifier),
			optional(seq(
				"[", field("count", optional($.const_literal)), "]",
			)),
			named_join("value", $.ival, ",")
		),

		definition: $ => choice(
			$.define_array,
		),

		source_file: $ => repeat($.definition),
	},
});
