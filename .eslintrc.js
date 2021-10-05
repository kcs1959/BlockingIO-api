module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
    parserOptions: {
        project: [
            './tsconfig.json',
            './tsconfig.eslint.json'
        ],
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2020
    },
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
<<<<<<< HEAD
=======
        'prettier/@typescript-eslint',
>>>>>>> introduce eslint and prettier
	],
	"env": {
		"es6": true,
		"node": true,
	},
};