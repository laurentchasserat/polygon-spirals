import cairo

class Drawer():
    """
    A class to draw cool pictures.
    """
    def __init__(self):
        pass

    def compute_inner_polygon(self, ratio, polygon_coordinates):
        result = []
        for i, (x1, y1) in enumerate(polygon_coordinates):
            if i != len(polygon_coordinates) - 1:
                x2, y2 = polygon_coordinates[i+1]
            else:
                x2, y2 = polygon_coordinates[0]
            result.append((x1 + (ratio * (x2-x1)), (y1 + (ratio * (y2-y1)))))
        return result

    def draw_polygon(self, context, points):
        context.move_to(points[0][0], points[0][1])
        for x, y in points[1:]:
            context.line_to(x, y)

        context.close_path()
        context.stroke()

    def draw_polygon_spiral(self, context, ratio, depth, polygon_coordinates):
        print(polygon_coordinates)
        if depth > 0:
            self.draw_polygon(context, polygon_coordinates)
            self.draw_polygon_spiral(context, ratio, depth - 1,
                                     self.compute_inner_polygon(ratio, polygon_coordinates))
        return

    def draw_picture(self):
        print('Now drawing a cool picture.')
        width = 600
        height = 600
        polygon1 = [(0.1, 0.4), (0.7, 0.25), (0.6, 0.9), (0.2, 0.65)]
        polygon2 = [(0.7, 0.25), (0.6, 0.9), (0.9, 0.95), (0.9, 0.05)]
        polygon3 = [(0.1, 0.4), (0.7, 0.25), (0.9, 0.05), (0.1, 0.1)]
        polygon4 = [(0.6, 0.9), (0.2, 0.65), (0.0, 0.7), (0.0, 1.0), (0.4, 1.0)]

        big_polygon = [(0.1, 0.5), (0.15, 0.4), (0.25, 0.1), (0.4, 0.2), (0.7, 0.4), (0.75, 0.8), (0.6, 0.9), (0.4, 0.7)]
        square = [(0.4, 0.4), (0.4, 0.6), (0.6, 0.6), (0.6, 0.4)]
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
            # self.draw_polygon(context, polygon1)
            # self.draw_polygon_spiral(context, 0.15, 50, polygon1)
            # self.draw_polygon_spiral(context, 0.15, 50, polygon2)
            # self.draw_polygon_spiral(context, 0.15, 50, polygon3)
            # self.draw_polygon_spiral(context, 0.15, 50, polygon4)

            self.draw_polygon_spiral(context, 0.8, 50, big_polygon)

            # print(polygon1)
            # print(self.compute_inner_polygon(polygon1))

            # Save as a SVG and PNG
            surface.write_to_png('example.png')
            surface.finish()
