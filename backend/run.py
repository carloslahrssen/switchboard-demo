# Borrowing this startup script as it seems that it'll be very useful when delivering to other developers for demo
import subprocess
import sys

def install_dependencies():
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])

if __name__ == '__main__':
    activate_cmd = '.venv\\Scripts\\activate' if sys.platform == 'win32' else 'source .venv/bin/activate'
    subprocess.check_call(activate_cmd, shell=True)

    install_dependencies()