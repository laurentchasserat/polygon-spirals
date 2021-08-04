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

    def draw_polygon(self, context, points, fill=None):
        context.move_to(points[0][0], points[0][1])
        for x, y in points[1:]:
            context.line_to(x, y)

        context.close_path()
        if fill is not None:
            context.set_source_rgb(fill[0], fill[1], fill[2])
            context.fill_preserve()

        context.set_source_rgb(0, 0, 0)
        context.stroke()
        return

    def draw_polygon_spiral(self, context, ratio, depth, polygon_coordinates):
        if depth > 0:
            self.draw_polygon(context, polygon_coordinates)
            self.draw_polygon_spiral(context, ratio, depth - 1,
                                     self.compute_inner_polygon(ratio, polygon_coordinates))
        return

    def draw_polygon_spiral_alt_fill(self, context, ratio, depth,
                                     polygon_coordinates, fill):
        if depth > 0:
            self.draw_polygon(context, polygon_coordinates, fill=fill)
            self.draw_polygon_spiral_alt_fill(context, ratio, depth - 1,
                                     self.compute_inner_polygon(ratio, polygon_coordinates),
                                     (0.8, 0.8, 0.8) if fill == (1, 1, 1) else (1, 1, 1))
        return

    def draw_picture(self, width, height, r, depth, parsed_polygons, alternate_colors):
        print('Now drawing a cool picture.')
        polygons = []
        for poly in parsed_polygons:
            a_polygon = []
            for point in poly:
                a_polygon.append((float(point['x']), float(point['y'])))
            polygons.append(a_polygon)

        with cairo.SVGSurface("cool_drawing.svg", width, height) as surface:
            context = cairo.Context(surface)

            context.scale(width, height)
            context.set_line_width(0.002)

            # Fill background
            # context.set_source_rgb(1, 1, 1)
            # context.paint()

            # Draw polygon
            context.set_source_rgb(0, 0, 0)

            for p in polygons:
                print('Now drawing', p)
                if alternate_colors:
                    self.draw_polygon_spiral_alt_fill(context, r, depth, p, (1, 1, 1))
                else:
                    self.draw_polygon_spiral(context, r, depth, p)

            # Save as a SVG and PNG
            surface.write_to_png('cool_drawing.png')
            surface.finish()
