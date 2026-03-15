from flask import Flask, jsonify
from scraper import fetch_top_10_movies
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

app = Flask(__name__)

top_movies = []

def update_movies():
    global top_movies
    try:
        top_movies = fetch_top_10_movies()
        print(f"Movies list updated successfully. Fetched {len(top_movies)} movies.")
    except Exception as e:
        print(f"Error updating movies: {e}")

# Initial scrape
update_movies()

# Scheduler to update every 6 hours (optional for demo)
scheduler = BackgroundScheduler()
scheduler.add_job(func=update_movies, trigger="interval", hours=6)
scheduler.start()
atexit.register(lambda: scheduler.shutdown())

@app.route('/api/movies')
def get_movies():
    return jsonify(top_movies)

@app.route('/health')
def health():
    return "Backend is healthy!", 200

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Routes:", app.url_map)
    app.run(debug=True)
