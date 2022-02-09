module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es2021": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": "latest"
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		],
    "array-bracket-spacing": [
      "error",
      "always"
    ],
    "computed-property-spacing": [
      "error",
      "always"
    ],
    "import/no-unresolved": 0,
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "object-curly-newline": [
      "error",
      {
        "consistent": true
      }
    ],
    "object-property-newline": [
      "error",
      {
        "allowAllPropertiesOnSameLine": true
      }
    ],
    "react/jsx-filename-extension": 0,
    "react/sort-comp": 0,
    "react/jsx-props-no-spreading": 0,
    "react/prefer-stateless-function": 1,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "space-in-parens": [
      "error",
      "always",
      {
        "exceptions": [
          "empty"
        ]
      }
    ],
	}
}
