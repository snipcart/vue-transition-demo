/* config ———————————————————————————————————————————————————————————————————*/
const config = {
  browsersync: {
    localhost: undefined,
    port: 8080,
		notify: true,
    sync: true
  },

  sass: {
		src: ['./sass/index.scss'],
		dest: './assets/css',
		options: { indentedSyntax: false },
		autoprefixer: {
			browsers: ['last 2 versions', 'not ie <= 9']
		}
	},

	js: {
		src: './scripts/*.js',
		dest: './assets/js',
		eslint: { fix: true },
		babel: {
		  presets: ['es2015-rollup']
		}
	},

	watch: {
		sass: 'sass/**/*.scss',
		js: 'scripts/**/*.js',
		markup: '**/*.html'
	}
}

/* helpers ——————————————————————————————————————————————————————————————————*/
const notifier = require('node-notifier')
const symbols = require('log-symbols')
const chalk = require('chalk')

module.exports = {
	get config() {
		config.sass.dest = config.sass.dest.replace(/\/$/, '')
	  config.js.dest = config.js.dest.replace(/\/$/, '')
		return config
	},

	get bsConfig() {
		let conf = {
			port: config.browsersync.port,
			ui: { port: config.browsersync.port + 1 },
			notify: config.browsersync.notify,
			proxy: config.browsersync.localhost,
			server: (!config.browsersync.localhost) ? './' : false
		}

		if (!config.browsersync.sync) conf.ghostMode = false
		return conf
	},

	sassReporter(e) {
		let title = `${e.relativePath}:${e.line}`
		let message = e.messageOriginal.replace(/\s{4}/,'')
		let count = chalk.bold(chalk.red(`${symbols.error} 1 problem (1 error, 0 warnings)`))
		console.log(chalk.underline(title), '\n ', message, `\n\n${count}`, '\n')
		notifier.notify({ title, message })
		this.emit('end')
	}
}
