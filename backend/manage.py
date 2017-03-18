from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from app import app, db
from werkzeug.serving import run_with_reloader
import logging

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)


@manager.command
def runserver():
	from gevent import pywsgi, monkey
	from geventwebsocket.handler import WebSocketHandler
	server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)

	if app.debug:
		logging.basicConfig(format='%(asctime)s %(message)s')
		logger = logging.getLogger()
		logger.setLevel(logging.DEBUG)
		monkey.patch_all()
		run_with_reloader(server.serve_forever)
	else:
		server.serve_forever()

# class Server(_Server):
# 	help = description = 'Runs the Socket.IO web server'

# 	def get_options(self):
# 		options = (
# 			Option('-h', '--host',
# 				dest='host',
# 				default=self.host),

# 			Option('-p', '--port',
# 				dest='port',
# 				type=int,
# 				default=self.port),

# 			Option('-d', '--debug',
# 				action='store_true',
# 				dest='use_debugger',
# 				help=('enable the Werkzeug debugger (DO NOT use in '
# 						'production code)'),
# 				default=self.use_debugger),
# 			Option('-D', '--no-debug',
# 				action='store_false',
# 				dest='use_debugger',
# 				help='disable the Werkzeug debugger',
# 				default=self.use_debugger),

# 			Option('-r', '--reload',
# 				action='store_true',
# 				dest='use_reloader',
# 				help=('monitor Python files for changes (not 100%% safe '
# 						'for production use)'),
# 				default=self.use_reloader),
# 			Option('-R', '--no-reload',
# 				action='store_false',
# 				dest='use_reloader',
# 				help='do not monitor Python files for changes',
# 				default=self.use_reloader),
# 		)
# 		return options

# 	def __call__(self, app, host, port, use_debugger, use_reloader):
# 		use_reloader = app.config['DEBUG']
# 		use_debugger = app.config['DEBUG']

# 		socketio.run(app,
# 			host=host,
# 			port=port,
# 			debug=use_debugger,
# 			use_reloader=use_reloader,
# 			**self.server_options)


# manager.add_command('runserver', Server(host='0.0.0.0'))

if __name__ == '__main__':
	manager.run()
