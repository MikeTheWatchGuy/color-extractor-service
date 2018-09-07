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
    if 'file' not in request.files:
        return jsonify(errors="File missing", colors=None)
    file = request.files['file']
    colors = utils.extract_colors_from_file(file)
    return jsonify(errors=None, colors=colors)


if __name__ == '__main__':
    app.debug = True

    app.run()
