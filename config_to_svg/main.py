from drawer import Drawer
import argparse
import json

if __name__ == '__main__':
    print('--------------------------------------------')
    print('Welcome to the cool picture drawing program.')
    print('Created by L. Chasserat and T. Petitfils')
    print('--------------------------------------------')
    print('Parsing configuration file...')
    parser = argparse.ArgumentParser()
    parser.add_argument('f', help='Configuration file path.')
    args = parser.parse_args()
    config_file = args.f
    with open(config_file) as file:
        data = json.load(file)
    print(data)
    print('Done!')
    d = Drawer()
    d.draw_picture(width=int(data['width']), height=int(data['height']),
                   r=float(data['r']), depth=int(data['depth']),
                   parsed_polygons=data['polygons'],
                   alternate_colors=bool(data['alternateColors']))
    print('Program finished. Bye!')
