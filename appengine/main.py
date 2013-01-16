import os
import webapp2

from google.appengine.api import users
from google.appengine.ext.webapp import template

class MainPage(webapp2.RequestHandler):
  """The main UI page, renders the 'index.html' template."""

  def get(self):
    """Renders the main page. When this page is shown, we create a new
    channel to push asynchronous updates to the client."""
    debug = self.request.get('debug')
    template_values = {
		# 'token': token,
		# 'me': user,
		# 'room_key': room_key,
		# 'room_link': room_link,
		# 'initiator': initiator
	}
    path = os.path.join(os.path.dirname(__file__), 'index.html')
    self.response.out.write(template.render(path, template_values))
    
app = webapp2.WSGIApplication([
	('/', MainPage)
  ], debug=True)