from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///work_calendar.db'
db = SQLAlchemy(app)

# Модель базы данных
class WorkDay(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False, unique=True)
    hours = db.Column(db.Integer, nullable=False)
    work_type = db.Column(db.String(10), nullable=False)  # 'офис' или 'дом'

# Создание базы данных
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

# API для сохранения данных
@app.route('/save', methods=['POST'])
def save():
    data = request.json
    date = data.get('date')
    hours = data.get('hours')
    work_type = data.get('work_type')

    if not date or hours is None or work_type not in ['офис', 'дом']:
        return jsonify({"error": "Некорректные данные"}), 400

    work_day = WorkDay.query.filter_by(date=date).first()
    if work_day:
        work_day.hours = hours
        work_day.work_type = work_type
    else:
        work_day = WorkDay(date=date, hours=hours, work_type=work_type)
        db.session.add(work_day)

    db.session.commit()
    return jsonify({"message": "Данные сохранены"})

# API для удаления данных
@app.route('/delete', methods=['POST'])
def delete():
    data = request.json
    date = data.get('date')

    work_day = WorkDay.query.filter_by(date=date).first()
    if work_day:
        db.session.delete(work_day)
        db.session.commit()
        return jsonify({"message": "Данные удалены"})
    
    return jsonify({"error": "Запись не найдена"}), 404

# API для получения данных
@app.route('/get', methods=['GET'])
def get():
    work_days = WorkDay.query.all()
    data = [{"date": day.date, "hours": day.hours, "work_type": day.work_type} for day in work_days]
    return jsonify(data)

# API для подсчета часов за месяц
@app.route('/total_hours', methods=['GET'])
def total_hours():
    month = request.args.get('month')
    year = request.args.get('year')

    if not month or not year:
        return jsonify({"error": "Необходимо указать месяц и год"}), 400

    month, year = int(month), int(year)
    start_date, end_date = f"{year}-{month:02d}-01", f"{year}-{month:02d}-31"

    total_hours = db.session.query(db.func.sum(WorkDay.hours)).filter(
        WorkDay.date >= start_date, WorkDay.date <= end_date
    ).scalar()

    return jsonify({"total_hours": total_hours or 0})

if __name__ == '__main__':
    app.run(debug=True)


