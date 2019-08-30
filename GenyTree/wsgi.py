"""
WSGI config for GenyTree project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os, sys

from django.core.wsgi import get_wsgi_application

sys.path.append('/var/www/ProjectEnv/GenyTree')
# adjust the Python version in the line below as needed
sys.path.append('/var/www/ProjectEnv/lib/python3.6/site-packages')

os.environ['DJANGO_SETTINGS_MODULE'] = 'GenyTree.settings'
#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GenyTree.settings')

application = get_wsgi_application()
