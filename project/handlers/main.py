from project.handlers import WebHandler


class Landing(WebHandler):

    ''' Simple render... '''

    def get(self):
        self.render('main/landing.html')
