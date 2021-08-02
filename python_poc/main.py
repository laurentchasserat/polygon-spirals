from drawer import Drawer

class Launcher:
    """
    A class to launch the program with the desired parameters.
    """
    def __init__(self, *args, **kwargs):
        pass

    def launch_drawing(self):
        d = Drawer()
        d.draw_picture()
        return 0

if __name__ == '__main__':
    print('--------------------------------------------')
    print('Welcome to the cool picture drawing program.')
    print('Created by L. Chasserat and T. Petitfils')
    print('--------------------------------------------')
    l = Launcher()
    l.launch_drawing()
    print('Program finished. Bye!')
