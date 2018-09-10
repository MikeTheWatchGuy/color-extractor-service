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
    if not any(['url' in request.form, 'file' in request.files]):
        return jsonify(errors="File or URL missing", colors=None)

    if 'url' in request.form:
        method = utils.extract_colors_from_url
        argument = request.form['url']
    else:
        method = utils.extract_colors_from_file
        argument = request.files['file']

    try:
        colors = method(argument)
    except exceptions.BaseColorExtractorException as exc:
        return jsonify(errors=str(exc), colors=None)

    return jsonify(errors=None, colors=colors)


if __name__ == '__main__':
    app.debug = True

    app.run()
