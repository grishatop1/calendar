from flask import Flask, render_template, url_for, request, redirect
from flask import send_from_directory

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        return send_from_directory("static", "calendar.json")
    else:
        return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")