#!/usr/bin/env python
import sys, os, subprocess
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../'))
ENV_DIR = 'env'

if sys.platform != 'win32':
    VENV = "".join([BASE_DIR, '/bin/virtualenv.py'])

    #create virtual env
    print 'Creating virtual environment in folder %s/%s' % (BASE_DIR, ENV_DIR)
    subprocess.call([VENV, '%s/%s' % (BASE_DIR, ENV_DIR)])
    print ''

    #call pip and install base requirements
    print 'Installing base requirements'
    subprocess.call(['%s/%s/bin/pip' % (BASE_DIR, ENV_DIR),
                     'install', '-r', '%s/requirements.txt' % (BASE_DIR)])
    print ''



else:
    VENV = "".join([BASE_DIR, '\\bin\\virtualenv.py'])

    #create virtual env
    print 'Creating virtual environment in folder %s\\%s' % (BASE_DIR, ENV_DIR)
    p = subprocess.Popen([sys.executable, VENV, '%s\\%s' % (BASE_DIR, ENV_DIR)])
    p.communicate()
    print ''

    #call pip and install base requirements
    print 'Installing base requirements'
    p = subprocess.Popen(['%s\\%s\\Scripts\\pip.exe' % (BASE_DIR, ENV_DIR),
                          'install', '-r', '%s\\requirements.txt' % (BASE_DIR)])
    p.communicate()
    print ''


print 'Base environments are created.'
print 'If you are checking into svn, make sure you don''t check in the env directory.  You can run `svn propset svn:ignore -F .svnignore .`'
if sys.platform == 'win32':
    print 'Remember to source your environment via %s/Scripts/activate.bat before doing anything' % (ENV_DIR)
else:
    print 'Remember to source your environment via %s/bin/activate before doing anything' % (ENV_DIR)
