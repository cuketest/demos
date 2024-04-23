import utils
child = None
def pytest_sessionstart():
    appPath = '/usr/lib/cuketest/bin/standarddialogs';
    global child 
    child = utils.run(appPath)
    print(child)
def pytest_sessionfinish():
    global child 
    print("Killing AUT with pid %s " % (child.pid))
    child.kill()
    child.wait()