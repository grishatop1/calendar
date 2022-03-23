from flask import Flask, render_template, url_for, request, redirect
from flask import send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calendar/<year>', methods=['POST'])
def calendar(year):
    return send_from_directory("calendars", "calendar" + year + ".json")

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")