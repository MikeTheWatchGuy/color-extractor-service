import config
import exceptions

import numpy as np

from PIL import Image
from collections import Counter
from sklearn.cluster import KMeans



def rgb2hex(rgb):
    hex = "#{:02x}{:02x}{:02x}".format(int(rgb[0]), int(rgb[1]), int(rgb[2]))
    return hex


def calculate_new_size(image, max_width=None, max_height=None):
    WIDTH = max_width or config.WIDTH
    HEIGHT = max_height or config.HEIGHT

    if image.width >= image.height:
        wpercent = (WIDTH / float(image.width))
        hsize = int((float(image.height) * float(wpercent)))
        new_width, new_height = WIDTH, hsize
    else:
        hpercent = (HEIGHT / float(image.height))
        wsize = int((float(image.width) * float(hpercent)))
        new_width, new_height = wsize, HEIGHT
    return new_width, new_height


def extract_colors_from_file(file, clusters=None):
    clusters = clusters or config.CLUSTERS

    if file.mimetype not in {'image/jpeg', 'image/png'}:
        raise exceptions.ValidationError('Invalid File Type')

    image = Image.open(file.stream)

    # Resize
    new_width, new_height = calculate_new_size(image)
    image = image.resize((new_width, new_height), Image.ANTIALIAS)

    img_array = np.array(image)
    img_vector = img_array.reshape((img_array.shape[0] * img_array.shape[1], 3))

    # Create model
    model = KMeans(n_clusters=clusters)
    labels = model.fit_predict(img_vector)
    label_counts = Counter(labels)

    total_count = sum(label_counts.values())
    hex_colors = [
        rgb2hex(center) for center in model.cluster_centers_
    ]

    return dict(zip(hex_colors, list(label_counts.values())))


if __name__ == '__main__':
    class DummyFile:
        def __init__(self, fp, mimetype='image/jpeg'):
            self.stream = fp
            self.mimetype = mimetype

    with open('demo/sample-image-1.jpg', 'rb') as fp:
        file = DummyFile(fp)
        print(extract_colors_from_file(file))
