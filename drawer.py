import cairo

class Drawer:
    """
    A class to draw cool pictures.
    """
    def __init__(self, *args, **kwargs):
        pass

    def draw_polygon(self, context, points):
        context.move_to(points[0][0], points[0][1])
        for x, y in points[1:]:
            context.line_to(x, y)

        context.close_path()
        context.stroke()

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
            context.set_line_width(0.005)

            # Fill background
            context.set_source_rgb(1, 1, 1)
            # context.rectangle(180, 20, 80, 80)
            # context.fill()
            context.paint()

            # Draw polygon
            context.set_source_rgb(0, 0, 0)
            print(x1)
            self.draw_polygon(context, [(x1, y1), (x2, y2), (x3, y3), (x4, y4)])
            self.draw_polygon(context, [(0.4, 0.4), (0.4, 0.6), (0.6, 0.6), (0.6, 0.4)])

            # Save as a SVG and PNG
            surface.write_to_png('example.png')
            surface.finish()
