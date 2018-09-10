import utils
import exceptions

from flask import Flask, request, render_template, jsonify

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 4 * 1024 * 1024  # 4MB max size


@app.route('/')
def index():
    return render_template('index.html')


def _extract(url=None, file=None, clusters=None):
    if not any([url, file]):
        return jsonify(errors="File or URL missing", colors=None)

    if clusters:
        try:
            clusters = int(clusters)
        except ValueError:
            return jsonify(errors="Invalid clusters arg, must be int", colors=None)

    if url:
        method = utils.extract_colors_from_url
        argument = url
    else:
        method = utils.extract_colors_from_file
        argument = file

    colors = method(argument, clusters=clusters)
    return jsonify(errors=None, colors=colors)


@app.route('/api/extract', methods=['POST'])
def api():
    if 'multipart/form-data' in request.content_type:
        return _extract(
            file=request.files.get('file'),
            clusters=request.form.get('clusters'))

    if request.content_type != 'application/json':
        return jsonify(errors='Invalid content type (use json)', colors=None)

    data = request.json

    return _extract(
        url=data.get('url'), clusters=data.get('clusters'))


@app.route('/extract', methods=['POST'])
def extract():
    return _extract(
        url=request.form.get('url'),
        file=request.files.get('file'))


if __name__ == '__main__':
    app.debug = True
    app.run()
