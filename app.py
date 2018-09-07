import utils
import exceptions

from flask import Flask, request, render_template, jsonify

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 4 * 1024 * 1024  # 4MB max size


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/extract', methods=['POST'])
def extract():
    colors = {'#084359': 2327, '#d3cfc8': 1779, '#0a242d': 651, '#a40e13': 2857, '#b1b8b8': 2983, '#3f7382': 283}
    return jsonify(errors=None, colors=colors)
    # request.form['url']

    if 'file' not in request.files:
        return jsonify(errors="File missing", colors=None)
    file = request.files['file']
    colors = utils.extract_colors_from_file(file)
    print(colors)
    return jsonify(errors=None, colors=colors)


if __name__ == '__main__':
    app.debug = True

    app.run()
