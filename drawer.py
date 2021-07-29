import cairo

class Drawer:
    """
    A class to draw cool pictures.
    """
    def __init__(self, *args, **kwargs):
        pass

    def draw_picture(self):
        print('Now drawing a cool picture.')
        width = 600
        height = 600
        x1, y1 = 0.2, 0.4
        x2, y2 = 0.8, 0.15
        x3, y3 = 0.7, 0.9
        x4, y4 = 0.3, 0.65
        with cairo.SVGSurface("example.svg", width, height) as surface:
            context = cairo.Context(surface)

            context.scale(width, height)
            context.set_line_width(0.01)

            # Fill background
            context.set_source_rgb(1, 1, 1)
            # context.rectangle(180, 20, 80, 80)
            # context.fill()
            context.paint()

            # Draw polygon
            context.set_source_rgb(0, 0, 0)
            context.move_to(x1, y1)
            context.line_to(x2, y2)
            context.line_to(x3, y3)
            context.line_to(x4, y3)
            context.line_to(x1, y1)
            context.stroke()

            # Save as a SVG and PNG
            surface.write_to_png('example.png')
            surface.finish()
