# backend/routes.py

from flask import Blueprint, render_template, request, url_for, redirect, jsonify, session
from flask_dance.contrib.google import google
from .database import get_db_connection
from .auth import is_allowed_email
import os
import uuid
from werkzeug.utils import secure_filename

routes = Blueprint('routes', __name__)

@routes.route('/')
def index():
    logged_in = False
    user_email = None
    if google.authorized:
        resp = google.get("/oauth2/v1/userinfo")
        if resp.ok:
            user_email = resp.json()["email"]
            if not is_allowed_email(user_email):
                return "Unauthorized: Only @klh.edu.in emails allowed", 403
            logged_in = True
    return render_template('../frontend/index.html', logged_in=logged_in, user_email=user_email)

@routes.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('routes.index'))

@routes.route('/post-item', methods=['POST'])
def post_item():
    if not google.authorized:
        return redirect(url_for('routes.index'))
    resp = google.get("/oauth2/v1/userinfo")
    user_email = resp.json().get("email")

    if not is_allowed_email(user_email):
        return "Unauthorized", 403

    title = request.form.get('title')
    description = request.form.get('description')
    contact_info = request.form.get('contact_info')
    image = request.files.get('image')

    image_url = None

    if image:
        filename = secure_filename(str(uuid.uuid4()) + "_" + image.filename)
        filepath = os.path.join('frontend', 'uploads', filename)
        image.save(filepath)
        image_url = url_for('static', filename='uploads/' + filename)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO posts (title, description, contact_info, image_url, posted_by) VALUES (%s, %s, %s, %s, %s)", 
                   (title, description, contact_info, image_url, user_email))
    conn.commit()
    cursor.close()
    conn.close()

    return redirect(url_for('routes.index'))

@routes.route('/api/items')
def get_items():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM posts ORDER BY id DESC")
    posts = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(posts)

@routes.route('/api/claim/<int:item_id>', methods=['POST'])
def claim_item(item_id):
    if not google.authorized:
        return jsonify({"message": "Login required to claim item"}), 401
    resp = google.get("/oauth2/v1/userinfo")
    user_email = resp.json().get("email")
    if not is_allowed_email(user_email):
        return jsonify({"message": "Unauthorized"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE posts SET claimed_by=%s WHERE id=%s AND claimed_by IS NULL", (user_email, item_id))
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()

    if affected == 0:
        return jsonify({"message": "Item already claimed or not found"}), 400
    return jsonify({"message": "Item claimed successfully"})
